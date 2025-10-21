import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

const sanitizeInput = (input: string) => input.replace(/[<>{}]/g, '');

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error(`[${requestId}] JWT_SECRET is not configured`);
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Get and verify JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(`[${requestId}] Missing or invalid Authorization header`);
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error(`[${requestId}] Invalid token:`, error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userEmail = (decodedToken as any).email;
    if (!userEmail) {
      console.error(`[${requestId}] No email in token`);
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error(`[${requestId}] Invalid JSON payload:`, error);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { oldPassword, newPassword, confirmPassword } = body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      console.error(`[${requestId}] Missing required fields: oldPassword=${!!oldPassword}, newPassword=${!!newPassword}, confirmPassword=${!!confirmPassword}`);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      console.error(`[${requestId}] Passwords do not match`);
      return NextResponse.json({ error: 'New password and confirmation do not match' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      console.error(`[${requestId}] New password too short: length=${newPassword.length}`);
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    // Enforce password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      console.error(`[${requestId}] Password does not meet complexity requirements`);
      return NextResponse.json(
        { error: 'New password must include uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(userEmail.trim().toLowerCase());
    const sanitizedOldPassword = sanitizeInput(oldPassword);
    const sanitizedNewPassword = sanitizeInput(newPassword);

    // Check user and old password
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', sanitizedEmail);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error(`[${requestId}] User not found: ${sanitizedEmail}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify old password
    const isValidPassword = await bcrypt.compare(sanitizedOldPassword, userData.passwordHash);
    if (!isValidPassword) {
      console.error(`[${requestId}] Incorrect old password for: ${sanitizedEmail}`);
      return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
    }

    // Update password
    const newPasswordHash = await bcrypt.hash(sanitizedNewPassword, 10);
    await adminDb.runTransaction(async (transaction) => {
      transaction.update(userDoc.ref, {
        passwordHash: newPasswordHash,
        updatedAt: new Date().toISOString(),
      });
    });

    const response = NextResponse.json({ success: true, message: 'Password changed successfully' });
    const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'];
    const origin = request.headers.get('origin') || '';
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  } catch (error: any) {
    console.error(`[${requestId}] Change Password API error:`, error);
    const response = NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to change password',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return response;
}

export async function PUT(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return response;
}