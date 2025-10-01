import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  uid: string;
  email: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tagId: string; email: string } }
) {
  try {
    const { tagId, email } = params;

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

    // Remove email from coManagers
    const coManagers = tagData.coManagers || [];
    const updatedCoManagers = coManagers.filter((e: string) => e.toLowerCase() !== email.toLowerCase());
    await adminDb.collection('tags').doc(tagId).update({ coManagers: updatedCoManagers });

    return NextResponse.json({ success: true, coManagers: updatedCoManagers });
  } catch (error: any) {
    console.error('Delete co-manager error:', error);
    return NextResponse.json({ error: 'Failed to delete co-manager' }, { status: 500 });
  }
}