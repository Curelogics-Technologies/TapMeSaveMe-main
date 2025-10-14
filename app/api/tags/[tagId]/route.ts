import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    uid: string;
    email: string;
}

// Handle CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204, // No Content
        headers: {
            'Access-Control-Allow-Origin': '*', // use your frontend URL in production
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}

interface UpdateTagData {
    fullName?: string;
    emergencyContacts?: Array<{
        name?: string;
        phone?: string;
        relationship?: string;
        customRelationship?: string;
    }>;
    medicalNotes?: string;
    insuranceInfo?: string;
    additionalNotes?: string;
    coManagers?: string[];
    productType?: string;
    status?: string;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { tagId: string } }
) {
    try {
        const { tagId } = params;
        const data: UpdateTagData = await request.json();

        // Validate inputs
        if (data.fullName && !data.fullName.trim()) {
            return NextResponse.json({ error: 'Full name cannot be empty' }, { status: 400 });
        }

        if (data.emergencyContacts) {
            if (!Array.isArray(data.emergencyContacts) || data.emergencyContacts.length === 0) {
                return NextResponse.json({ error: 'At least one emergency contact is required' }, { status: 400 });
            }
            for (const contact of data.emergencyContacts) {
                if (!contact.name || !contact.phone) {
                    return NextResponse.json({ error: 'All emergency contacts must have a name and phone number' }, { status: 400 });
                }
                if (contact.relationship === 'Other' && (!contact.customRelationship || !contact.customRelationship.trim())) {
                    return NextResponse.json({ error: 'Custom relationship required for "Other"' }, { status: 400 });
                }
                // Validate phone number format (e.g., starts with + and 7-15 digits)
                const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
                if (!cleanPhone.startsWith('+') || cleanPhone.substring(1).length < 7 || cleanPhone.substring(1).length > 15) {
                    return NextResponse.json({ error: `Invalid phone number for contact ${contact.name}` }, { status: 400 });
                }
            }
        }

        if (data.coManagers) {
            if (!Array.isArray(data.coManagers)) {
                return NextResponse.json({ error: 'Co-managers must be an array' }, { status: 400 });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (const email of data.coManagers) {
                if (email && !emailRegex.test(email)) {
                    return NextResponse.json({ error: `Invalid email: ${email}` }, { status: 400 });
                }
            }
        }

        if (data.productType && !['Unspecified', 'Bracelet', 'Sticker', 'Pet Collar', 'Pin'].includes(data.productType)) {
            return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
        }

        if (data.status && !['active', 'lost', 'deactivated'].includes(data.status)) {
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

        // Prepare update data
        const updateData: any = {
            'analytics.lastTapped': new Date().toISOString(),
        };
        if (data.fullName) updateData.fullName = data.fullName;
        if (data.emergencyContacts) {
            updateData.emergencyContacts = data.emergencyContacts.map(contact => ({
                name: contact.name,
                phone: contact.phone,
                relationship: contact.relationship === 'Other' ? contact.customRelationship : contact.relationship,
            }));
        }
        if (data.medicalNotes !== undefined) updateData.medicalNotes = data.medicalNotes;
        if (data.insuranceInfo !== undefined) updateData.insuranceInfo = data.insuranceInfo;
        if (data.additionalNotes !== undefined) updateData.additionalNotes = data.additionalNotes;
        if (data.coManagers) updateData.coManagers = data.coManagers.filter(email => email.trim() !== '');
        if (data.productType) updateData.productType = data.productType;
        if (data.status) {
            updateData.status = data.status;
            updateData.activated = data.status === 'deactivated' ? false : true;
        }

        // Update tag in Firestore
        await adminDb.collection('tags').doc(tagId).update(updateData);

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Tag updated successfully' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // replace with your domain in production
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    } catch (error: any) {
        console.error('Update tag error:', error);
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}