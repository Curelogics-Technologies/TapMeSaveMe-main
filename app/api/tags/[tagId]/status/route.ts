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
      'Access-Control-Allow-Origin': '*', // Adjust to specific origins in production
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
      return NextResponse.json({ error: 'Invalid status. Must be "active", "lost", or "deactivated"' }, { status: 400 });
    }

    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const ownerEmail = decoded.email.toLowerCase();

    // Get tag document
    const tagDoc = await adminDb.collection('tags').doc(tagId).get();
    if (!tagDoc.exists) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    const tagData = tagDoc.data();
    if (tagData?.ownerEmail.toLowerCase() !== ownerEmail) {
      return NextResponse.json({ error: 'Unauthorized to modify tag' }, { status: 403 });
    }

    // Update status and activated (false only for "deactivated")
    const updatedActivated = status === 'active' ? true : false;
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
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}