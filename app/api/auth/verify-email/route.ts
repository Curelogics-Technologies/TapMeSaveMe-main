import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Validate input
    if (!token || !email) {
      console.error('Missing token or email', { token, email });
      return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query Firestore for user
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', normalizedEmail).where('verificationToken', '==', token);
    const snapshot = await query.get();

    if (snapshot.empty) {
      // Check if email exists and is already verified
      const emailQuery = usersRef.where('email', '==', normalizedEmail);
      const emailSnapshot = await emailQuery.get();
      if (!emailSnapshot.empty && emailSnapshot.docs[0].data().emailVerified) {
        return NextResponse.json({ success: true, message: 'Email already verified' });
      }
      console.error('Invalid verification token or email:', normalizedEmail);
      return NextResponse.json({ error: 'Invalid verification token or email' }, { status: 400 });
    }

    // Check if already verified
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    if (userData.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }

    // Update user document
    await userDoc.ref.update({ emailVerified: true });

    const response = NextResponse.json({ success: true, message: 'Email verified successfully' });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  } catch (error: any) {
    console.error('Verify Email API error:', error, { stack: error.stack });
    const response = NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify email',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}