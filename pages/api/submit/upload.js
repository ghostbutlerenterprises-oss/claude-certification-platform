// pages/api/submit/upload.js
import { createServerSupabaseClient, db, supabase, storage } from '@/lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { capstoneId, fileName, fileContent } = req.body;

  if (!capstoneId || !fileName || !fileContent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get current user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create submission record
    const submissionFilePath = `submissions/${user.id}/${capstoneId}/${Date.now()}-${fileName}`;
    const submission = await db.uploadSubmission(
      user.id,
      capstoneId,
      submissionFilePath
    );

    // Store file content (convert base64 if needed)
    let fileBuffer;
    if (typeof fileContent === 'string' && fileContent.startsWith('data:')) {
      // Base64 encoded file
      const base64Data = fileContent.split(',')[1];
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else if (typeof fileContent === 'string') {
      fileBuffer = Buffer.from(fileContent, 'utf-8');
    } else {
      fileBuffer = fileContent;
    }

    // Save to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(submissionFilePath, fileBuffer, {
        contentType: 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('submissions')
      .getPublicUrl(submissionFilePath);

    return res.status(201).json({
      success: true,
      submissionId: submission[0].id,
      fileUrl: publicUrl,
      fileName,
      submittedAt: submission[0].submitted_at,
      status: 'pending_review'
    });

  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload file',
      details: error.message
    });
  }
}
