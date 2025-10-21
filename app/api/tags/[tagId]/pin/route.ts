import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { hashPin, verifyPin } from '@/lib/utils';

interface JwtPayload {
  uid: string;
  email: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
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
    const { oldPin, newPin, confirmNewPin } = await request.json();

    // Validate input
    if (!oldPin || !newPin || !confirmNewPin) {
      return NextResponse.json({ error: 'All PIN fields required' }, { status: 400 });
    }
    if (newPin !== confirmNewPin) {
      return NextResponse.json({ error: 'New PINs do not match' }, { status: 400 });
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 });
    }

    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const ownerEmail = decoded.email.toLowerCase();

    // GET & VERIFY TAG
    const tagDoc = await adminDb.collection('tags').doc(tagId).get();
    if (!tagDoc.exists) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    const tagData = tagDoc.data();
    if (tagData?.ownerEmail.toLowerCase() !== ownerEmail) {
      return NextResponse.json({ error: 'Not tag owner' }, { status: 403 });
    }

    // Verify old PIN
    const isValid = await verifyPin(oldPin, tagData.pinHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid old PIN' }, { status: 400 });
    }

    // UPDATE PIN
    const newPinHash = await hashPin(newPin);
    await adminDb.collection('tags').doc(tagId).update({
      pinHash: newPinHash,
      'analytics.lastTapped': new Date().toISOString(),
    });

    // 🚀 FIXED: SAFE CO-MANAGERS HANDLING
    const coManagers = Array.isArray(tagData.coManagers) ? tagData.coManagers : [];
    const recipients = [tagData.ownerEmail, ...coManagers];
    
    console.log(`📧 Notifying ${recipients.length} users:`, recipients);

    // 🚀 BATCH EXPO MESSAGES
    const expoMessages = [];

    for (const email of recipients) {
      const userQuery = adminDb.collection('users').where('email', '==', email);
      const userSnapshot = await userQuery.get();
      
      if (userSnapshot.empty) {
        console.log(`⚠️ User not found: ${email}`);
        continue;
      }

      const userData = userSnapshot.docs[0].data();
      const fcmTokens = Array.isArray(userData.fcmTokens) ? userData.fcmTokens : [];
      
      console.log(`📱 Tokens for ${email}: ${fcmTokens.length}`);

      // ADD MESSAGES FOR EACH TOKEN
      for (const token of fcmTokens) {
        expoMessages.push({
          to: token,
          sound: 'default',
          title: `PIN Reset`,
          body: `The PIN has been changed for Tag ${tagId} and is now ${newPin}`,
          data: { tagId, updatedPin: newPin, type: 'pin_updated' }
        });
      }
    }

    // 🚀 SEND TO EXPO
    let notifiedCount = 0;
    if (expoMessages.length > 0) {
      console.log(`📤 Sending ${expoMessages.length} notifications`);
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expoMessages),
      });

      const result = await response.json();
      console.log('📨 Expo result:', result);
      notifiedCount = expoMessages.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `PIN updated! ${notifiedCount} notifications sent`,
      notified: notifiedCount
    });

  } catch (error: any) {
    console.error('Change PIN error:', error);
    return NextResponse.json({ error: 'Failed to update PIN' }, { status: 500 });
  }
}