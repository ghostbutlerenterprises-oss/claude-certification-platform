// pages/api/progress/track.js
import { createServerSupabaseClient, db, supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lessonId, quizScore } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: 'Missing lessonId' });
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

    // Record the progress
    const progressData = await db.recordProgress(
      user.id,
      lessonId,
      quizScore
    );

    // Get updated progress stats
    const allProgress = await db.getProgress(user.id);
    const completedCount = allProgress.filter(p => p.status === 'completed').length;
    const avgScore = allProgress.length > 0
      ? (allProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / allProgress.length).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      progress: progressData,
      stats: {
        lessonsCompleted: completedCount,
        averageScore: avgScore,
        totalLessons: 26
      }
    });

  } catch (error) {
    console.error('Progress tracking error:', error);
    return res.status(500).json({ error: 'Failed to track progress' });
  }
}
