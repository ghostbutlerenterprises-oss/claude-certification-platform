// pages/api/grade/evaluate.js
import { createServerSupabaseClient, db } from '@/lib/supabase';
import { gradeCapstone, generateFeedbackEmail } from '@/lib/claude';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Increase timeout for grading
  req.socket.setTimeout(55 * 1000);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { submissionId, capstoneType, submissionContent, studentEmail, studentName } = req.body;

  if (!submissionId || !capstoneType || !submissionContent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const supabase = createServerSupabaseClient();

    // Grade the submission using Claude
    console.log(`Grading ${capstoneType} capstone...`);
    const gradeResult = await gradeCapstone(capstoneType, submissionContent);

    if (!gradeResult.success) {
      return res.status(500).json({
        error: 'Failed to grade submission',
        details: gradeResult.error
      });
    }

    // Save grade to database
    const savedGrade = await db.saveGrade(
      submissionId,
      gradeResult.score,
      gradeResult.feedback
    );

    // Generate and send email with feedback
    if (studentEmail) {
      try {
        const emailBody = await generateFeedbackEmail(
          studentName,
          capstoneType,
          gradeResult.score,
          gradeResult.feedback
        );

        await resend.emails.send({
          from: 'noreply@claudecertification.com',
          to: studentEmail,
          subject: `Your Capstone Grade: ${gradeResult.score}/100`,
          html: `
            <h2>Your Capstone Project Grade</h2>
            <p><strong>Score:</strong> ${gradeResult.score}/100</p>

            <h3>Breakdown</h3>
            <ul>
              <li>Architecture: ${gradeResult.breakdown.architecture}</li>
              <li>Implementation: ${gradeResult.breakdown.implementation}</li>
              <li>Accuracy/Automation: ${gradeResult.breakdown.accuracy_or_automation}</li>
              <li>Testing: ${gradeResult.breakdown.testing}</li>
              <li>Documentation: ${gradeResult.breakdown.documentation}</li>
            </ul>

            <h3>Strengths</h3>
            <ul>
              ${gradeResult.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>

            <h3>Areas for Improvement</h3>
            <ul>
              ${gradeResult.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>

            <h3>Feedback</h3>
            <p>${gradeResult.feedback}</p>

            <p>Keep up the great work!</p>
          `
        });
      } catch (emailError) {
        console.error('Email send error (non-fatal):', emailError);
        // Don't fail the grade if email fails
      }
    }

    return res.status(200).json({
      success: true,
      score: gradeResult.score,
      breakdown: gradeResult.breakdown,
      strengths: gradeResult.strengths,
      improvements: gradeResult.improvements,
      feedback: gradeResult.feedback,
      emailSent: !!studentEmail
    });

  } catch (error) {
    console.error('Grading error:', error);
    return res.status(500).json({
      error: 'Failed to grade submission',
      details: error.message
    });
  }
}
