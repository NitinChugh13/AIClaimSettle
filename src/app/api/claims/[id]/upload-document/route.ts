import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id: claim_id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const document_type = formData.get('document_type') as string;

        if (!file || !document_type) {
            return NextResponse.json({ success: false, error: 'File and document type are required' }, { status: 400 });
        }

        // Convert File to ArrayBuffer for more reliable upload in Next.js
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${claim_id}/${fileName}`;

        const { data: storageData, error: storageError } = await supabaseAdmin.storage
            .from('claim-documents')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (storageError) {
            console.error('Upload error:', storageError);
            console.error('Storage Detail:', {
                bucket: 'claim-documents',
                filePath,
                keyUsed: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'
            });
            return NextResponse.json({ success: false, error: 'Failed to upload file to storage' }, { status: 500 });
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('claim-documents')
            .getPublicUrl(filePath);

        // 3. Insert record into claim_documents table
        const { data: docRecord, error: docError } = await supabaseAdmin
            .from('claim_documents')
            .insert([{
                claim_id,
                file_name: file.name,
                file_url: publicUrl,
                file_type: file.type,
                document_type
            }])
            .select()
            .single();

        if (docError) {
            console.error('Upload error:', docError);
            return NextResponse.json({ success: false, error: 'Failed to link document to claim' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            file_url: publicUrl,
            document_id: docRecord.id
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while uploading document' }, { status: 500 });
    }
}

