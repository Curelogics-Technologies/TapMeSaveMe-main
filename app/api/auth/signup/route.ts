import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {

  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      console.error('Missing email, password, or full name');
      return NextResponse.json({ error: 'Missing email, password, or full name' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (password.length < 6) {
      console.error('Password too short:', password.length);
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email.trim().toLowerCase());
    if (!(await query.get()).empty) {
      console.error('Email already exists:', email);
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password and generate verification token
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save user to Firestore
    const userDoc = await usersRef.add({
      email: email.trim().toLowerCase(),
      passwordHash,
      fullName: fullName.trim(),
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Verify Your TapMeSaveMe™ Account',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="font-size: 24px; color: #D52D2D; margin-bottom: 20px;">Welcome to TapMeSaveMe™!</h1>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi ${fullName},</p>
            <p style="font-size: 16px; margin-bottom: 15px;">
              Thank you for signing up! Please verify your email address to activate your account.
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #D52D2D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 16px; margin-bottom: 15px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br><a href="${verificationUrl}">${verificationUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666;">If you didn't sign up, please ignore this email.</p>
          </div>
          <div style="background-color: #1e293b; padding: 20px; display: flex; justify-content: flex-start; align-items: center;">
            <div style="width: 100px; height: 100px; border-radius: 8px; background-color: #ffffff; margin-right: 20px; margin-left: 30px;">
              <img src="https://activate.tapmesaveme.com/logo.png?height=70&width=80" alt="TapMeSaveMe Logo" style="max-width: 100px; height: auto; display: block; margin: 0px; border-radius: 10px;" />
            </div>
            <div style="margin-left: 40px; color: #d1d5db; margin-top: 5px;">
              <p style="margin: 0 0 10px;">TapMeSaveMe™ | Your Safety, Our Priority</p>
              <p style="margin: 0 0 10px;">
                <a href="https://www.tapmesaveme.com" style="color: #60a5fa; text-decoration: none;">Visit our website</a> | 
                <a href="mailto:support@tapmesaveme.com" style="color: #60a5fa; text-decoration: none;">Contact Support</a>
              </p>
              <p style="margin: 0;">© 2025 TapMeSaveMe. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    // Set CORS headers to allow only POST and OPTIONS
    const response = NextResponse.json({ success: true, user: { uid: userDoc.id, email } });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

    return response;
  } catch (error: any) {
    console.error('💥 Signup API error:', error);

    // Set CORS headers for error response
    const response = NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sign up',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });

  // Set CORS headers to allow only POST and OPTIONS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

// Handle unsupported methods
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}

export async function PUT(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}