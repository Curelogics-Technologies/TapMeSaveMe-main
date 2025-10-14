import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { hashPin, verifyPin } from '@/lib/utils';

interface JwtPayload {
  uid: string;
  email: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    const { oldPin, newPin, confirmNewPin } = await request.json();

    // Validate input
    if (!oldPin || !newPin || !confirmNewPin) {
      return NextResponse.json(
        { error: 'Old PIN, new PIN, and confirm new PIN are required' },
        { status: 400 }
      );
    }
    if (newPin !== confirmNewPin) {
      return NextResponse.json(
        { error: 'New PIN and confirm PIN do not match' },
        { status: 400 }
      );
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return NextResponse.json(
        { error: 'New PIN must be exactly 4 digits' },
        { status: 400 }
      );
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

    // Verify old PIN
    const isValid = await verifyPin(oldPin, tagData.pinHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid old PIN' }, { status: 400 });
    }

    // Hash new PIN and update
    const newPinHash = await hashPin(newPin);
    await adminDb.collection('tags').doc(tagId).update({
      pinHash: newPinHash,
      'analytics.lastTapped': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'PIN updated successfully' });
  } catch (error: any) {
    console.error('Change PIN error:', error);
    return NextResponse.json({ error: 'Failed to update PIN' }, { status: 500 });
  }
}