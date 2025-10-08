import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Define transporter globally to match signup API
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
    const { email } = await request.json();

    // Validate input
    if (!email) {
      console.error('Missing email in request body');
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('Resend verification requested for:', normalizedEmail);

    // Query Firestore for user
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', normalizedEmail);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error('User not found:', normalizedEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.emailVerified) {
      console.log('Email already verified:', normalizedEmail);
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await userDoc.ref.update({ verificationToken });

    // Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: normalizedEmail,
      subject: 'Verify Your Email - TapMeSaveMe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Welcome to TapMeSaveMe™</h2>
          <p>Please verify your email address to complete your registration.</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
            Verify Email
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p style="color: #4b5563; font-size: 12px;">If you did not sign up for TapMeSaveMe, please ignore this email.</p>
          <p style="color: #4b5563; font-size: 12px;">TapMeSaveMe™ | Your Safety, Our Priority</p>
        </div>
      `,
    });

    console.log('Verification email resent for:', normalizedEmail, { verificationToken });

    const response = NextResponse.json({ success: true, message: 'Verification email resent successfully' });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  } catch (error: any) {
    console.error('Resend Verification API error:', error, { stack: error.stack });
    let errorMessage = 'Failed to resend verification email';
    if (error.code === 'EENVELOPE' && error.responseCode === 509) {
      errorMessage = 'Invalid sender email configuration. Contact support.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'SMTP authentication failed. Check credentials.';
    }
    const response = NextResponse.json(
      {
        success: false,
        error: errorMessage,
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

export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}