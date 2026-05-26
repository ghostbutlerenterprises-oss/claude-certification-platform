// components/QuizComponent.jsx
import { useState } from 'react';

export default function QuizComponent({ quiz, onSubmit, previousScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!quiz || !quiz.questions) return 0;

    let correctAnswers = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const quizScore = calculateScore();
    setScore(quizScore);
    setSubmitted(true);

    try {
      await onSubmit(quizScore);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!quiz || !quiz.questions) {
    return <p>No quiz available for this lesson.</p>;
  }

  if (submitted) {
    return (
      <div style={{
        backgroundColor: '#f0f8f0',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Quiz Submitted!</h2>
        <p style={{ fontSize: '24px', color: '#007bff', fontWeight: 'bold' }}>
          Score: {score}%
        </p>
        <p style={{ color: '#666', marginTop: '10px' }}>
          {score >= 70 ? '🎉 Great job! You passed this lesson.' : '📚 Keep studying! You can retake this quiz.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {previousScore !== null && previousScore !== undefined && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Previous Score: {previousScore.toFixed(1)}% - You can retake to improve your score
        </div>
      )}

      <form>
        {quiz.questions.map((question, idx) => (
          <div key={question.id} style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
              {idx + 1}. {question.text}
            </p>

            <div style={{ marginLeft: '20px' }}>
              {question.options.map((option) => (
                <label key={option} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || Object.keys(answers).length < quiz.questions.length}
          style={{
            padding: '12px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: Object.keys(answers).length === quiz.questions.length ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: Object.keys(answers).length === quiz.questions.length ? 1 : 0.5
          }}
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>

        {Object.keys(answers).length < quiz.questions.length && (
          <p style={{ color: '#999', marginTop: '10px' }}>
            Answer all {quiz.questions.length} questions to submit
          </p>
        )}
      </form>
    </div>
  );
}
