import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { Query } from 'firebase-admin/firestore';

interface TagData {
  tagId: string;
  activated: boolean;
  createdAt: string;
  ownerEmail: string;
  fullName: string;
  pinHash: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  medicalNotes: string;
  insuranceInfo: string;
  additionalNotes: string;
  analytics: {
    tapCount: number;
    lastTapped: string;
  };
}

interface JwtPayload {
  uid: string;
  email: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Build Firestore query
    let query: Query = adminDb.collection('tags').where('ownerEmail', '==', decoded.email.trim().toLowerCase());

    // Apply optional activated filter
    const activated = request.nextUrl.searchParams.get('activated');
    if (activated !== null) {
      query = query.where('activated', '==', activated === 'true');
    }

    const snapshot = await query.get();
    const tags: TagData[] = snapshot.docs.map(doc => ({
      ...doc.data(),
      tagId: doc.id,
    } as TagData));

    return NextResponse.json({
      success: true,
      data: tags,
      count: tags.length,
    });
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch tags',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}