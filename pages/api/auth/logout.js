// pages/api/auth/logout.js
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createServerSupabaseClient();
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      await supabase.auth.admin.signOut(token);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    // Don't fail logout on error - client-side signOut is sufficient
    return res.status(200).json({ success: true });
  }
}
