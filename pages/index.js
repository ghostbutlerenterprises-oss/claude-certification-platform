// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import DashboardStats from '@/components/DashboardStats';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    averageScore: 0,
    specialization: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);
        await loadProgress(session.user.id);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadProgress = async (userId) => {
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);

      if (userProfile) {
        setStats({
          specialization: userProfile.specialization,
          lessonsCompleted: progressData?.filter(p => p.status === 'completed').length || 0,
          averageScore: progressData?.length
            ? (progressData.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / progressData.length).toFixed(1)
            : 0
        });
      }

      setProgress(progressData || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>Claude AI Certification</h1>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>
            Welcome, {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <DashboardStats stats={stats} />

      <div style={{ marginTop: '40px' }}>
        <h2>Lessons</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {Array.from({ length: 26 }, (_, i) => {
            const lessonId = `lesson-${i + 1}`;
            const lessonProgress = progress.find(p => p.lesson_id === lessonId);
            const status = lessonProgress?.status || 'not_started';
            const score = lessonProgress?.quiz_score;

            return (
              <Link href={`/lesson/${lessonId}`} key={lessonId}>
                <div style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: status === 'completed' ? '#f0f8f0' : '#fafafa',
                  transition: 'all 0.2s'
                }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>Lesson {i + 1}</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    Status: <strong>{status}</strong>
                  </p>
                  {score !== null && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      Quiz Score: <strong>{score.toFixed(1)}%</strong>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {stats.specialization && stats.lessonsCompleted >= 6 && (
        <div style={{ marginTop: '40px' }}>
          <Link href="/submit-capstone">
            <div style={{
              padding: '20px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0 }}>Submit Capstone Project</h3>
              <p style={{ margin: '5px 0 0 0' }}>
                You're eligible to submit your {stats.specialization} capstone
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
