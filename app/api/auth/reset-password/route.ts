import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json();

    // Validate input
    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing email, token, or new password' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Check reset token
    const usersRef = adminDb.collection('users');
    const query = usersRef
      .where('email', '==', email.trim().toLowerCase())
      .where('resetToken', '==', token);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Invalid reset token or email' }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check token expiration
    const expires = new Date(userData.resetTokenExpires);
    if (expires < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userDoc.ref.update({
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Reset Password API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reset password',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}