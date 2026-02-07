import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

interface JwtPayload {
  uid: string;
  email: string;
}

export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID();



  try {
    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error(`[${requestId}] JWT_SECRET is not configured`);
      return NextResponse.json(
        { error: 'Server configuration error' },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
    }

    // Get and verify JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(`[${requestId}] Missing or invalid Authorization header`);
      return NextResponse.json(
        { error: 'Authentication required' },
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
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.error(`[${requestId}] Invalid token:`, error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
    }

    const userEmail = decoded.email?.trim().toLowerCase();
    if (!userEmail) {
      console.error(`[${requestId}] No email in token`);
      return NextResponse.json(
        { error: 'Invalid token payload' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
    }

    console.log(`[${requestId}] Account deletion requested for user: ${userEmail}`);

    // Check if user exists
    const userQuery = adminDb.collection('users').where('email', '==', userEmail);
    const userSnapshot = await userQuery.get();

    if (userSnapshot.empty) {
      console.error(`[${requestId}] User not found: ${userEmail}`);
      return NextResponse.json(
        { error: 'User not found' },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        }
      );
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;

    // 1. Delete all tags owned by the user
    const ownedTagsQuery = adminDb.collection('tags').where('ownerEmail', '==', userEmail);
    const ownedTagsSnapshot = await ownedTagsQuery.get();

    console.log(`[${requestId}] Deleting ${ownedTagsSnapshot.size} owned tags`);

    // Process owned tags in batches (Firestore limit is 500 operations per batch)
    const ownedTagDocs = ownedTagsSnapshot.docs;
    const BATCH_SIZE = 500;

    for (let i = 0; i < ownedTagDocs.length; i += BATCH_SIZE) {
      const batch = adminDb.batch();
      const chunk = ownedTagDocs.slice(i, i + BATCH_SIZE);
      chunk.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // 2. Remove user from co-managers array in other tags
    const coManagerTagsQuery = adminDb.collection('tags').where('coManagers', 'array-contains', userEmail);
    const coManagerTagsSnapshot = await coManagerTagsQuery.get();

    console.log(`[${requestId}] Removing user from ${coManagerTagsSnapshot.size} co-managed tags`);

    // Process co-manager updates in batches
    const coManagerDocs = coManagerTagsSnapshot.docs;

    for (let i = 0; i < coManagerDocs.length; i += BATCH_SIZE) {
      const batch = adminDb.batch();
      const chunk = coManagerDocs.slice(i, i + BATCH_SIZE);
      chunk.forEach((doc) => {
        batch.update(doc.ref, {
          coManagers: FieldValue.arrayRemove(userEmail),
        });
      });
      await batch.commit();
    }

    // 3. Delete user document (separate batch for safety)
    const userBatch = adminDb.batch();
    userBatch.delete(userDoc.ref);
    console.log(`[${requestId}] Deleting user document: ${userId}`);
    await userBatch.commit();

    console.log(`[${requestId}] Account successfully deleted for user: ${userEmail}`);

    return NextResponse.json(
      {
        message: 'Account successfully deleted',
        deletedTags: ownedTagsSnapshot.size,
        removedFromCoManaged: coManagerTagsSnapshot.size,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Error deleting account:`, error);
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
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

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}

// Block unsupported methods
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
    }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
    }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
    }
  );
}