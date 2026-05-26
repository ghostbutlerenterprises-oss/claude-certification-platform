// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (can be used in pages and components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = () => {
  const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  );
  return supabaseAdmin;
};

// Get current user session (client-side)
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user || null;
};

// Auth functions
export const auth = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    });
    if (error) throw error;
  }
};

// Database functions
export const db = {
  // User progress
  async recordProgress(userId, lessonId, quizScore) {
    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        quiz_score: quizScore,
        status: 'completed',
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });
    if (error) throw error;
    return data;
  },

  async getProgress(userId) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async getLessonProgress(userId, lessonId) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    return data || null;
  },

  // Submissions
  async uploadSubmission(userId, capstoneId, fileUrl) {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: userId,
        capstone_id: capstoneId,
        file_url: fileUrl,
        submitted_at: new Date().toISOString(),
        status: 'pending'
      });
    if (error) throw error;
    return data;
  },

  async getSubmissions(userId) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  // Grades
  async saveGrade(submissionId, score, feedback) {
    const { data, error } = await supabase
      .from('grades')
      .insert({
        submission_id: submissionId,
        score,
        feedback,
        graded_at: new Date().toISOString()
      });
    if (error) throw error;

    // Update submission status
    await supabase
      .from('submissions')
      .update({ status: 'graded' })
      .eq('id', submissionId);

    return data;
  },

  async getGrade(submissionId) {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('submission_id', submissionId)
      .single();
    return data || null;
  },

  // User data
  async createUserProfile(userId, email, name, specialization) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        specialization,
        created_at: new Date().toISOString()
      });
    if (error) throw error;
    return data;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return data || null;
  }
};

// File storage functions
export const storage = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    if (error) throw error;
    return data;
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    if (error) throw error;
  }
};

export default supabase;
