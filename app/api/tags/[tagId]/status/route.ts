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
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['active', 'lost', 'deactivated'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "active", "lost", or "deactivated"' }, { 
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

    // Update status and activated (true for "active" or "lost", false for "deactivated")
    const updatedActivated = status === 'deactivated' ? false : true;
    await adminDb.collection('tags').doc(tagId).update({
      status,
      activated: updatedActivated,
    });

    return NextResponse.json({ success: true, status, activated: updatedActivated }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error: any) {
    console.error('Change status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}