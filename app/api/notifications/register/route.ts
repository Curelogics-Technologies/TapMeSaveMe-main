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

    const usersRef = adminDb.collection('users');
    const query = usersRef.where('email', '==', email);
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    let fcmTokens = userDoc.data()?.fcmTokens || [];
    
    if (!fcmTokens.includes(fcmToken)) {
      fcmTokens.push(fcmToken);
    }
    await userDoc.ref.update({
      fcmTokens,
      lastUpdated: new Date().toISOString(),
    });

    console.log(`FCM Token added to user ${email}:`, fcmToken);

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