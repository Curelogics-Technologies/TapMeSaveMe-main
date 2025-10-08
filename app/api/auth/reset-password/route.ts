import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json();

    // Validate input
    if (!email || !token || !newPassword) {
      console.error('Missing email, token, or new password');
      return NextResponse.json({ error: 'Missing email, token, or new password' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      console.error('New password too short:', newPassword.length);
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Check reset token
    const usersRef = adminDb.collection('users');
    const query = usersRef
      .where('email', '==', email.trim().toLowerCase())
      .where('resetToken', '==', token);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error('Invalid reset token or email:', email);
      return NextResponse.json({ error: 'Invalid reset token or email' }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check token expiration
    const expires = new Date(userData.resetTokenExpires);
    if (expires < new Date()) {
      console.error('Reset token has expired for:', email);
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userDoc.ref.update({
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    });

    // Set CORS headers to allow only POST and OPTIONS
    const response = NextResponse.json({ success: true, message: 'Password reset successfully' });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

    return response;
  } catch (error: any) {
    console.error('Reset Password API error:', error);

    // Set CORS headers for error response
    const response = NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reset password',
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
  response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

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