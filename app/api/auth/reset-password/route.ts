import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

const sanitizeInput = (input: string) => input.replace(/[<>{}]/g, '');

// Handle POST requests
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const { email, token, newPassword } = await request.json();

    // Validate input
    if (!email || !token || !newPassword) {
      console.error(`[${requestId}] Missing email, token, or new password`);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      console.error(`[${requestId}] New password too short: ${newPassword.length}`);
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    // Validate token format
    const isValidHex = /^[0-9a-fA-F]{64}$/.test(token);
    if (!isValidHex) {
      console.error(`[${requestId}] Invalid token format`);
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedToken = sanitizeInput(token);

    // Check reset token
    const usersRef = adminDb.collection('users');
    const query = usersRef
      .where('email', '==', sanitizedEmail)
      .where('resetToken', '==', sanitizedToken);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error(`[${requestId}] Invalid reset token or email: ${sanitizedEmail}`);
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check token expiration
    const expires = new Date(userData.resetTokenExpires);
    if (expires < new Date()) {
      console.error(`[${requestId}] Reset token has expired for: ${sanitizedEmail}`);
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    // Update password in a transaction
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await adminDb.runTransaction(async (transaction) => {
      transaction.update(userDoc.ref, {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      });
    });

    // Set CORS headers
    const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'];
    const origin = request.headers.get('origin') || '';
    const response = NextResponse.json({ success: true, message: 'Password reset successfully' });

    response.headers.set('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  } catch (error: any) {
    console.error(`[${requestId}] Reset Password API error:`, error);

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