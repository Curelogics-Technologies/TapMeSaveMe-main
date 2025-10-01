import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  uid: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { fcmToken } = await req.json();
    if (!fcmToken) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const email = decoded.email.toLowerCase();
    if (!email) {
      return NextResponse.json(
        { error: 'User email not found in token' },
        { status: 400 }
      );
    }

    // Store or update FCM token in users collection
    const userRef = adminDb.collection('users').doc(email);
    const userDoc = await userRef.get();
    let fcmTokens = [];
    if (userDoc.exists) {
      fcmTokens = userDoc.data()?.fcmTokens || [];
    }
    // Add token if not already present (avoid duplicates)
    if (!fcmTokens.includes(fcmToken)) {
      fcmTokens.push(fcmToken);
    }
    await userRef.set(
      {
        email,
        fcmTokens,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      message: 'FCM token registered successfully',
    });
  } catch (error: any) {
    console.error('FCM registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register FCM token' },
      { status: 500 }
    );
  }
}