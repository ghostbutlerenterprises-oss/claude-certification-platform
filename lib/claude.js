// lib/claude.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Grading rubrics for each capstone
const rubrics = {
  sales: {
    title: 'Sales Automation Capstone',
    criteria: {
      architecture: 'Complete end-to-end design (lead intake to email). Max 25 points.',
      implementation: 'Working code for enrichment, scoring, email. Max 25 points.',
      accuracy: 'Lead scoring F1 score >= 0.70. Enrichment success >= 90%. Max 20 points.',
      testing: 'Unit tests, integration tests, end-to-end validation. Max 15 points.',
      documentation: 'Clear setup guide, deployment instructions, ROI calculation. Max 15 points.'
    }
  },
  cs: {
    title: 'Support Automation Capstone',
    criteria: {
      architecture: 'Complete ticket to resolution design. KB integration, routing, escalation. Max 25 points.',
      implementation: 'Working KB search, classification, routing logic. Max 25 points.',
      automation_rate: 'Handles 80%+ of tickets automatically. Classification accuracy >= 90%. Max 20 points.',
      testing: 'Classification validation, routing accuracy, end-to-end tests. Max 15 points.',
      documentation: 'KB setup guide, classification taxonomy, deployment instructions, metrics. Max 15 points.'
    }
  }
};

// Get rubric for capstone type
function getRubric(capstoneType) {
  return rubrics[capstoneType] || rubrics.sales;
}

// Grade a capstone project
export async function gradeCapstone(capstoneType, submissionContent) {
  const rubric = getRubric(capstoneType);

  const gradePrompt = `You are an expert instructor evaluating a capstone project for the Claude AI Certification Program.

PROJECT: ${rubric.title}

STUDENT SUBMISSION:
${submissionContent}

GRADING RUBRIC:
${Object.entries(rubric.criteria)
  .map(([criterion, description]) => `- ${criterion}: ${description}`)
  .join('\n')}

TASK: Grade this submission holistically based on the rubric. Provide:

1. SCORE (0-100): Overall score based on rubric
2. BREAKDOWN: Points for each criterion
3. STRENGTHS: What the student did well (2-3 points)
4. IMPROVEMENTS: What could be better (2-3 points)
5. FEEDBACK: Constructive, actionable feedback (3-4 sentences)

Format your response as JSON:
{
  "score": <number 0-100>,
  "breakdown": {
    "architecture": <number>,
    "implementation": <number>,
    "accuracy_or_automation": <number>,
    "testing": <number>,
    "documentation": <number>
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "feedback": "Detailed feedback here..."
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: gradePrompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse Claude response as JSON');
    }

    const gradeData = JSON.parse(jsonMatch[0]);
    return {
      success: true,
      score: gradeData.score,
      breakdown: gradeData.breakdown,
      strengths: gradeData.strengths,
      improvements: gradeData.improvements,
      feedback: gradeData.feedback
    };

  } catch (error) {
    console.error('Claude grading error:', error);
    return {
      success: false,
      error: error.message,
      score: 0,
      feedback: 'Unable to grade at this time. Please try again later.'
    };
  }
}

// Generate personalized learning suggestions based on quiz performance
export async function generateLearningPath(lessonHistory, quizScores) {
  const prompt = `You are a Claude AI Certification Program instructor. A student has completed several lessons with the following results:

LESSONS COMPLETED:
${lessonHistory.map(l => `- ${l.title}: Score ${l.score}%`).join('\n')}

QUIZ PERFORMANCE:
Average score: ${(quizScores.reduce((a, b) => a + b, 0) / quizScores.length).toFixed(1)}%
Weakest area: ${lessonHistory[quizScores.indexOf(Math.min(...quizScores))].title}
Strongest area: ${lessonHistory[quizScores.indexOf(Math.max(...quizScores))].title}

Provide:
1. ASSESSMENT: Overall progress assessment (2-3 sentences)
2. STRENGTHS: What they're doing well
3. FOCUS_AREAS: What needs improvement
4. NEXT_STEPS: Specific recommendations (2-3 items)

Format as JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  } catch (error) {
    console.error('Claude learning path error:', error);
    return null;
  }
}

// Generate email feedback for capstone grades
export async function generateFeedbackEmail(studentName, capstoneType, score, feedback) {
  const gradeLevel = score >= 90 ? 'excellent'
                   : score >= 80 ? 'good'
                   : score >= 70 ? 'satisfactory'
                   : 'needs improvement';

  const prompt = `You are a supportive instructor. Write a personalized email to ${studentName} about their capstone project grade.

GRADE: ${score}/100 (${gradeLevel})
CAPSTONE: ${capstoneType} Automation
FEEDBACK: ${feedback}

Write a warm, encouraging email that:
1. Celebrates their effort and progress
2. Acknowledges their score
3. Highlights key feedback
4. Encourages next steps

Keep it 150-200 words. Warm and professional tone.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].type === 'text'
      ? message.content[0].text
      : '';

  } catch (error) {
    console.error('Claude email generation error:', error);
    return `Great work on completing your capstone, ${studentName}! Your score of ${score}/100 reflects solid understanding. Keep building on this foundation!`;
  }
}

export default anthropic;
