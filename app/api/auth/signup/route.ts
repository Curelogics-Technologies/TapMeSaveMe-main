import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcrypt';
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
      return NextResponse.json({ error: 'Missing email, password, or full name' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email.trim().toLowerCase());
    if (!(await query.get()).empty) {
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
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
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
          <div style="background-color: #1e293b; padding: 20px; text-align: center; color: #d1d5db;">
            <p style="margin: 0 0 10px;">TapMeSaveMe™ | Your Safety, Our Priority</p>
            <p style="margin: 0;"><a href="mailto:support@tapmesaveme.com" style="color: #60a5fa;">support@tapmesaveme.com</a></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, user: { uid: userDoc.id, email } });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sign up',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}