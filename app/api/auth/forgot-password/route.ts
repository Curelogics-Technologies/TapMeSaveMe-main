import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
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
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if user exists
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email.trim().toLowerCase());
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    await userDoc.ref.update({
      resetToken,
      resetTokenExpires: new Date(Date.now() + 3600000).toISOString(), // Expires in 1 hour
    });

    // Send reset email
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Reset Your TapMeSaveMe™ Password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="font-size: 24px; color: #D52D2D; margin-bottom: 20px;">Password Reset Request</h1>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi ${userData.fullName || 'User'},</p>
            <p style="font-size: 16px; margin-bottom: 15px;">
              You requested to reset your password. Click the button below to set a new password.
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #D52D2D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 16px; margin-bottom: 15px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br><a href="${resetUrl}">${resetUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666;">This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
          </div>
          <div style="background-color: #1e293b; padding: 20px; text-align: center; color: #d1d5db;">
            <p style="margin: 0 0 10px;">TapMeSaveMe™ | Your Safety, Our Priority</p>
            <p style="margin: 0;"><a href="mailto:support@tapmesaveme.com" style="color: #60a5fa;">support@tapmesaveme.com</a></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Password reset email sent' });
  } catch (error: any) {
    console.error('Forgot Password API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send reset email',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}