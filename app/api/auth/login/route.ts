import { type NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Query Firestore for user
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email.trim().toLowerCase());
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Check if email is verified
    if (!userData.emailVerified) {
      return NextResponse.json({ error: 'Email not verified. Please check your inbox.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { uid: userDoc.id, email: userData.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      success: true,
      user: { uid: userDoc.id, email: userData.email, token },
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to log in',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}