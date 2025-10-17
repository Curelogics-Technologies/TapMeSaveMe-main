import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { verifyPinHash } from '@/lib/bcrypt';

interface JwtPayload {
  uid: string;
  email: string;
}

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    const { pin }: { pin: string } = await request.json();

    // === 1. Validate PIN format (4 digits) ===
    if (!pin || typeof pin !== 'string' || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN: Must be exactly 4 digits' },
        { status: 400 }
      );
    }

    // === 2. Verify JWT Authentication ===
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

    // === 3. Fetch Tag Document ===
    const tagRef = adminDb.collection('tags').doc(tagId);
    const tagDoc = await tagRef.get();
    if (!tagDoc.exists) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    const tagData = tagDoc.data();
    if (!tagData?.pinHash) {
      return NextResponse.json({ error: 'No PIN set for this tag' }, { status: 400 });
    }

    // === 4. Authorization: Owner or Co-Manager ===
    const ownerEmail = tagData.ownerEmail?.trim().toLowerCase();
    const coManagers: string[] = (tagData.coManagers || []).map((e: string) => e.trim().toLowerCase());
    const isOwner = ownerEmail === userEmail;
    const isCoManager = coManagers.includes(userEmail);
    if (!isOwner && !isCoManager) {
      return NextResponse.json({ error: 'Unauthorized: Not owner or co-manager' }, { status: 403 });
    }

    // === 5. Verify PIN Hash ===
    const isValid = await verifyPinHash(pin, tagData.pinHash);
    
    // === 6. Update Analytics (even on failed attempt, for tap tracking) ===
    await tagRef.update({
      'analytics.lastTapped': new Date().toISOString(),
      // Optionally increment tapCount: FieldValue.increment(1)
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // === 7. Success Response ===
    return NextResponse.json({
      success: true,
      message: 'PIN verified successfully',
      role: isOwner ? 'owner' : 'coManager', // Optional: inform client of role
    });

  } catch (error: any) {
    console.error('PIN verification error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to verify PIN',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}