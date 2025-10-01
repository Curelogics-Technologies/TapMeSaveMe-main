import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
    }

    const usersRef = adminDb.collection('users');
    const query = usersRef
      .where('email', '==', email.trim().toLowerCase())
      .where('verificationToken', '==', token);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Invalid verification token or email' }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ emailVerified: true, verificationToken: null });

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('Verify Email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify email',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}