import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  uid: string;
  email: string;
}

// Handle CORS
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
    const { tagName } = await request.json();

    if (!tagName || typeof tagName !== 'string' || tagName.trim().length === 0) {
      return NextResponse.json(
        { error: 'tagName is required and must be a non-empty string' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const trimmedTagName = tagName.trim();

    // Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid token' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const userEmail = decoded.email.trim().toLowerCase();

    // Fetch tag
    const tagDoc = await adminDb.collection('tags').doc(tagId).get();
    if (!tagDoc.exists) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const tagData = tagDoc.data()!;
    const ownerEmail = tagData.ownerEmail?.trim().toLowerCase();
    const coManagers: string[] = (tagData.coManagers || [])
      .map((e: string) => e.trim().toLowerCase());

    const isOwner = ownerEmail === userEmail;
    const isCoManager = coManagers.includes(userEmail);

    if (!isOwner && !isCoManager) {
      return NextResponse.json(
        { error: 'Forbidden: Only owner or co-managers can update tag name' },
        { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const updateData: Record<string, any> = {};

    // Check if tagName field already exists
    if (tagData.hasOwnProperty('tagName')) {
      updateData.tagName = trimmedTagName;
    } else {
      updateData.tagName = trimmedTagName;
    }
    
    await adminDb.collection('tags').doc(tagId).update(updateData);

    return NextResponse.json(
      {
        success: true,
        message: tagData.hasOwnProperty('tagName')
          ? 'Tag name updated successfully'
          : 'Tag name added successfully',
        tagName: trimmedTagName,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Update tag name error:', error);
    return NextResponse.json(
      { error: 'Failed to update tag name' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}