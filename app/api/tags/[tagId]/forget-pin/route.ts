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
      subject: '🚨 Your New TapMeSaveMe PIN',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Your New TapMeSaveMe PIN</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #e02424; padding: 30px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            .header h1 { color: #ffffff; font-size: 28px; margin: 0; }
            .pin-section { background-color: #fff3cd; padding: 30px; text-align: center; border-bottom: 2px solid #ffeaa7; }
            .pin { font-size: 48px; font-weight: bold; color: #e02424; letter-spacing: 10px; font-family: monospace; }
            .content { padding: 30px; text-align: center; }
            .content p { color: #1f2a44; line-height: 1.6; margin-bottom: 20px; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .warning p { color: #dc2626; margin: 0; }
            .footer { background-color: #1f2a44; color: #ffffff; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
            .footer p { margin: 5px 0; font-size: 14px; }
            .footer a { color: #10b981; text-decoration: none; }
            @media only screen and (max-width: 600px) {
              .pin { font-size: 36px; letter-spacing: 5px; }
              .container { margin: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 NEW PIN GENERATED</h1>
            </div>
            <div class="pin-section">
              <p style="font-size: 16px; color: #856404; margin-bottom: 15px;">Your new 4-digit PIN for tag <strong>${tagId}</strong></p>
              <div class="pin">${newPin}</div>
            </div>
            <div class="content">
              <h2 style="color: #1f2a44; margin-bottom: 20px;">How to Use Your New PIN</h2>
              <p><strong>1.</strong> Go to your tag's profile page</p>
              <p><strong>2.</strong> Click "Edit Information"</p>
              <p><strong>3.</strong> Enter this PIN: <strong>${newPin}</strong></p>
              <p><strong>4.</strong> Update your emergency information</p>
              
              <div class="warning">
                <p><strong>⚠️ SECURITY NOTICE:</strong> This PIN expires in 24 hours. Change it immediately after use.</p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280;">
                <em>This PIN was generated because you requested to forget your previous PIN.</em>
              </p>
            </div>
            <div class="footer">
              <p><strong>TapMeSaveMe Emergency System</strong></p>
              <p><a href="mailto:support@tapmesaveme.com">support@tapmesaveme.com</a> | 1-502-314-6453</p>
              <p><a href="https://activate.tapmesaveme.com">activate.tapmesaveme.com</a></p>
            </div>
          </div>
        </body>
        </html>
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