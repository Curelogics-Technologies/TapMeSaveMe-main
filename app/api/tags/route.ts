import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { Query } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

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
  // Added optional fields based on schema
  coManagers?: string[];
  getUpdatesByEmail?: boolean;
  productType?: string;
  status?: string;
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

    const userEmail = decoded.email.trim().toLowerCase();

    // Build Firestore query
    let query: Query = adminDb.collection('tags')
      .where('ownerEmail', '==', userEmail);

    // Apply optional activated filter
    const activated = request.nextUrl.searchParams.get('activated');
    if (activated !== null) {
      query = query.where('activated', '==', activated === 'true');
    }

    const ownerSnapshot = await query.get();

    // Fetch tags where user is a co-manager
    const coManagerQuery: Query = adminDb.collection('tags')
      .where('coManagers', 'array-contains', userEmail);

    // Apply the same optional activated filter to co-manager query
    let coManagerFilteredQuery = coManagerQuery;
    if (activated !== null) {
      coManagerFilteredQuery = coManagerQuery.where('activated', '==', activated === 'true');
    }

    const coManagerSnapshot = await coManagerFilteredQuery.get();

    // Combine and dedupe results (using a Map by doc ID)
    const tagsMap = new Map<string, TagData>();

    ownerSnapshot.docs.forEach(doc => {
      tagsMap.set(doc.id, {
        ...doc.data(),
        tagId: doc.id,
      } as TagData);
    });

    coManagerSnapshot.docs.forEach(doc => {
      if (!tagsMap.has(doc.id)) {
        tagsMap.set(doc.id, {
          ...doc.data(),
          tagId: doc.id,
        } as TagData);
      }
    });

    const tags: TagData[] = Array.from(tagsMap.values());

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