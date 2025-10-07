import { type NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Explicitly define runtime (important for Vercel)
export const runtime = 'nodejs';

// Handle POST requests
export async function POST(request: NextRequest) {
  console.log('🚀 Login API called');
  console.log('📝 Environment check:', {
    hasJWT: !!process.env.JWT_SECRET,
    hasFirebaseProject: !!process.env.FIREBASE_PROJECT_ID,
    hasFirebaseEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasFirebaseKey: !!process.env.FIREBASE_PRIVATE_KEY,
  });

  try {
    // Validate 
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.error('❌ Missing email or password');
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    console.log('🔍 Attempting login for:', email);

    // Query Firestore for user
    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email.trim().toLowerCase());
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error('❌ User not found:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.passwordHash);
    if (!passwordMatch) {
      console.error('❌ Invalid password for:', email);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Check if email is verified
    if (!userData.emailVerified) {
      console.error('❌ Email not verified:', email);
      return NextResponse.json({ error: 'Email not verified. Please check your inbox.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { uid: userDoc.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful for:', email);

    return NextResponse.json({
      success: true,
      user: { uid: userDoc.id, email: userData.email, token },
    });
  } catch (error: any) {
    console.error('💥 Login API error:', error);
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

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}