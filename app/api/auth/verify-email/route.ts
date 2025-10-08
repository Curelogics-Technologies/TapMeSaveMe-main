import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// Handle GET requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Validate input
    if (!token || !email) {
      console.error('Missing token or email');
      return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
    }

    // Query Firestore for user
    const usersRef = adminDb.collection('users');
    const query = usersRef
      .where('email', '==', email.trim().toLowerCase())
      .where('verificationToken', '==', token);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error('Invalid verification token or email:', email);
      return NextResponse.json({ error: 'Invalid verification token or email' }, { status: 400 });
    }

    // Update user document
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ emailVerified: true, verificationToken: null });

    // Set CORS headers to allow only GET and OPTIONS
    const response = NextResponse.json({ success: true, message: 'Email verified successfully' });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

    return response;
  } catch (error: any) {
    console.error('💥 Verify Email API error:', error);

    // Set CORS headers for error response
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

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });

  // Set CORS headers to allow only GET and OPTIONS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  return response;
}

// Handle unsupported methods
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}

export async function PUT(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}