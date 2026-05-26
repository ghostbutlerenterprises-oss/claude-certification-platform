// pages/submit-capstone.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SubmissionForm from '@/components/SubmissionForm';

export default function SubmitCapstone() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Load user profile to get specialization
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUserProfile(profile);

        // Check if user has existing submission
        const { data: existingSubmission } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .single();

        if (existingSubmission) {
          setSubmission(existingSubmission);
        }

        // Check if user has completed at least 6 lessons
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'completed');

        if (!progressData || progressData.length < 6) {
          setError('You must complete at least 6 lessons before submitting a capstone');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleFileUpload = async (fileName, fileContent) => {
    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch('/api/submit/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          capstoneId: `${userProfile?.specialization}-capstone`,
          fileName,
          fileContent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setSubmission(data);
      setSuccessMessage('File uploaded successfully! Your capstone will be graded by Claude AI shortly.');

      // Trigger grading
      await fetch('/api/grade/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: data.submissionId,
          capstoneType: userProfile?.specialization,
          submissionContent: fileContent,
          studentEmail: user?.email,
          studentName: userProfile?.name
        })
      }).catch(err => console.error('Grading request sent but error:', err));

    } catch (err) {
      setError('Error uploading file: ' + err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/">← Back to Dashboard</Link>

      <h1 style={{ marginTop: '20px' }}>Submit Capstone Project</h1>
      <p style={{ color: '#666' }}>
        Specialization: <strong>{userProfile?.specialization === 'sales' ? 'Sales Automation' : 'Customer Service Automation'}</strong>
      </p>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#f0f8f0',
          color: '#060',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {successMessage}
        </div>
      )}

      {submission && submission.status !== 'pending' && (
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Previous Submission</h3>
          <p>File: <strong>{submission.file_name}</strong></p>
          <p>Status: <strong>{submission.status}</strong></p>
          <p>Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
        </div>
      )}

      {!submission || submission.status === 'pending' ? (
        <SubmissionForm
          onSubmit={handleFileUpload}
          loading={submitting}
        />
      ) : (
        <div style={{
          backgroundColor: '#f0f8f0',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <h3>✓ Your capstone has been submitted</h3>
          <p>You can check your grade on the dashboard once grading is complete.</p>
        </div>
      )}

      <div style={{ marginTop: '40px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '4px' }}>
        <h3>Submission Guidelines</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>Submit a PDF, text file, or ZIP archive with your project code</li>
          <li>Include clear documentation of your implementation</li>
          <li>Demonstrate understanding of course concepts</li>
          <li>Max file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
}
