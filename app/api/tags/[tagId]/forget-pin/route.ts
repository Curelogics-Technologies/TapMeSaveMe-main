import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Get tag document
    const tagDoc = await adminDb.collection('tags').doc(tagId).get();
    if (!tagDoc.exists) {
      return NextResponse.json({ error: 'Tag not found' }, { 
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const tagData = tagDoc.data();
    const ownerEmail = tagData?.ownerEmail?.trim().toLowerCase();

    // Check if email matches owner
    if (ownerEmail !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match tag owner' }, { 
        status: 403,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 🔥 FIXED: GENERATE 4-DIGIT PIN (Math.random)
    const newPin = Math.floor(Math.random() * 9000 + 1000).toString();  // 1000-9999
    const pinHash = await bcrypt.hash(newPin, 12);  // bcrypt.hash() - SALT 12

    // Update Firestore with bcrypt PIN
    await adminDb.collection('tags').doc(tagId).update({ 
      pinHash,
      updatedAt: new Date().toISOString()
    });

    // 🔥 EMAIL TRANSPORTER (nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // STARTTLS on port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@tapmesaveme.com',
      to: email,
      subject: '🚨 Your New TapMeSaveMe™ PIN',
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #333333;">
          <!-- Content -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="font-size: 24px; color: #D52D2D; margin-bottom: 20px;">Your New TapMeSaveMe™ PIN!</h1>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi,</p>
            <p style="font-size: 16px; margin-bottom: 15px;">
              Your new 4-digit PIN for tag <strong>${tagId}</strong> has been generated successfully.
            </p>
            <p style="font-size: 16px; margin-bottom: 15px;">
              <strong>Your New PIN: ${newPin}</strong>
            </p>
            <p style="font-size: 16px; margin-bottom: 15px;">
              To use your PIN:
            </p>
            <ul style="font-size: 16px; margin-bottom: 15px; padding-left: 20px;">
              <li>Go to your tag's profile page</li>
              <li>Click "Edit Information"</li>
              <li>Enter this PIN: <strong>${newPin}</strong></li>
              <li>Update your emergency information</li>
            </ul>
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="https://activate.tapmesaveme.com/t/${tagId}" style="display: inline-block; background-color: #D52D2D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Edit Your Profile
              </a>
            </div>
            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">
              <small>This PIN was generated because you requested to forget your previous PIN.</small>
            </p>
          </div>
          <!-- Footer -->
          <div style="background-color: #1e293b; padding: 20px; display: flex; justify-content: flex-start; align-items: center;">
            <div style="width: 100px; height: 100px; border-radius: 8px; background-color: #ffffff; margin-right: 20px; margin-left: 30px;">
              <img src="https://activate.tapmesaveme.com/logo.png?height=70&width=80" alt="TapMeSaveMe Logo" style="max-width: 100px; height: auto; display: block; margin: 0px; border-radius: 10px;" />
            </div>
            <div style="margin-left: 40px; color: #d1d5db; margin-top: 5px;">
              <p style="margin: 0 0 10px;">TapMeSaveMe™ | Your Safety, Our Priority</p>
              <p style="margin: 0 0 10px;">
                <a href="https://www.tapmesaveme.com" style="color: #60a5fa; text-decoration: none;">Visit our website</a> | 
                <a href="mailto:support@tapmesaveme.com" style="color: #60a5fa; text-decoration: none;">Contact Support</a>
              </p>
              <p style="margin: 0;">© 2025 TapMeSaveMe. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'New PIN sent to your email',
      pinSent: true 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('💥 Forget PIN API error:', error);
    return NextResponse.json({ error: 'Failed to send PIN' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}