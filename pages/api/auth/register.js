// pages/api/auth/register.js
import { createServerSupabaseClient, db } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name, specialization } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!['sales', 'cs'].includes(specialization)) {
    return res.status(400).json({ error: 'Invalid specialization' });
  }

  try {
    const supabase = createServerSupabaseClient();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false // User will need to confirm email
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({
        error: authError.message === 'User already registered'
          ? 'Email already registered'
          : authError.message
      });
    }

    // Create user profile in database
    await db.createUserProfile(
      authData.user.id,
      email,
      name,
      specialization
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to confirm.',
      userId: authData.user.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
}
