import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  uid: string;
  email: string;
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    const { productType } = await request.json();

    // Validate productType
    const validTypes = ['Unspecified', 'Bracelet', 'Sticker', 'Pet Collar', 'Pin'];
    if (!validTypes.includes(productType)) {
      return NextResponse.json({ error: 'Invalid product type' }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userEmail = decoded.email.trim().toLowerCase();

    // Get tag document
    const tagDoc = await adminDb.collection('tags').doc(tagId).get();
    if (!tagDoc.exists) {
      return NextResponse.json({ error: 'Tag not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    const tagData = tagDoc.data();

    const ownerEmail = tagData?.ownerEmail?.trim().toLowerCase();
    const coManagers: string[] = (tagData?.coManagers || []).map((email: string) => email.trim().toLowerCase());
    const isOwner = ownerEmail === userEmail;
    const isCoManager = coManagers.includes(userEmail);

    if (!isOwner && !isCoManager) {
      return NextResponse.json({ error: 'Unauthorized to modify tag' }, { 
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Update productType
    await adminDb.collection('tags').doc(tagId).update({ productType });

    return NextResponse.json({ success: true, productType }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error: any) {
    console.error('Change product type error:', error);
    return NextResponse.json({ error: 'Failed to update product type' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}