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
  coManagers?: string[];
  getUpdatesByEmail?: boolean;
  productType?: string;
  status?: string;
  role: 'owner' | 'coManager';
}

interface JwtPayload {
  uid: string;
  email: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
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
      const data = doc.data();
      const normalizedOwnerEmail = data.ownerEmail?.trim().toLowerCase();
      tagsMap.set(doc.id, {
        ...data,
        tagId: doc.id,
        role: (normalizedOwnerEmail === userEmail) ? 'owner' : 'coManager',
      } as TagData);
    });

    coManagerSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const normalizedOwnerEmail = data.ownerEmail?.trim().toLowerCase();
      const isOwner = (normalizedOwnerEmail === userEmail);
      if (!tagsMap.has(doc.id)) {
        tagsMap.set(doc.id, {
          ...data,
          tagId: doc.id,
          role: isOwner ? 'owner' : 'coManager',
        } as TagData);
      } else {
        // If already added as coManager but actually owner (unlikely, but handle), update role
        const existing = tagsMap.get(doc.id);
        if (existing && isOwner) {
          existing.role = 'owner';
        }
      }
    });

    const tags: TagData[] = Array.from(tagsMap.values());

    return NextResponse.json(
      {
        success: true,
        data: tags,
        count: tags.length,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch tags',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
      }
    );
  }
}