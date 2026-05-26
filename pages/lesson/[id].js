// pages/lesson/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LessonPlayer from '@/components/LessonPlayer';
import QuizComponent from '@/components/QuizComponent';

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadLesson = async () => {
      try {
        // Check auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Load lessons from public/lessons.json
        const lessonsResponse = await fetch('/lessons.json');
        const lessonsData = await lessonsResponse.json();
        const lessonData = lessonsData.lessons.find(l => l.id === id);

        if (!lessonData) {
          setError('Lesson not found');
          return;
        }

        setLesson(lessonData);

        // Load user progress for this lesson
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('lesson_id', id)
          .single();

        setProgress(progressData || {
          lesson_id: id,
          status: 'in_progress',
          quiz_score: null
        });
      } catch (err) {
        setError('Failed to load lesson: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [id, router]);

  const handleQuizSubmit = async (score) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch('/api/progress/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: id,
          quizScore: score
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError('Failed to save quiz score');
        return;
      }

      setProgress(prev => ({
        ...prev,
        quiz_score: score,
        status: 'completed'
      }));
    } catch (err) {
      setError('Error submitting quiz: ' + err.message);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <Link href="/">← Back to Dashboard</Link>
        <div style={{ color: '#c33', marginTop: '20px' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <Link href="/">← Back to Dashboard</Link>
        <p style={{ marginTop: '20px' }}>Lesson not found</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/">← Back to Dashboard</Link>

      <h1 style={{ marginTop: '20px' }}>{lesson.title}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        {lesson.description}
      </p>

      {progress?.status === 'completed' && (
        <div style={{
          backgroundColor: '#f0f8f0',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ✓ Completed - Quiz Score: {progress.quiz_score?.toFixed(1)}%
        </div>
      )}

      <LessonPlayer lesson={lesson} />

      {lesson.quiz && (
        <div style={{ marginTop: '40px' }}>
          <h2>Quiz</h2>
          <QuizComponent
            quiz={lesson.quiz}
            onSubmit={handleQuizSubmit}
            previousScore={progress?.quiz_score}
          />
        </div>
      )}
    </div>
  );
}
