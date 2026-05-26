// components/LessonPlayer.jsx
import { useState } from 'react';

export default function LessonPlayer({ lesson }) {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #ddd'
      }}>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            backgroundColor: activeTab === 'content' ? '#007bff' : '#f5f5f5',
            color: activeTab === 'content' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            backgroundColor: activeTab === 'resources' ? '#007bff' : '#f5f5f5',
            color: activeTab === 'resources' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Resources
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {activeTab === 'content' && (
          <div>
            <h3>Learning Objectives</h3>
            <ul>
              {lesson.objectives && lesson.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>

            <h3 style={{ marginTop: '30px' }}>Content</h3>
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '4px',
              lineHeight: '1.6'
            }}>
              {lesson.content || 'Content will be displayed here.'}
            </div>

            {lesson.videoUrl && (
              <div style={{ marginTop: '30px' }}>
                <h3>Video Lesson</h3>
                <div style={{
                  backgroundColor: '#000',
                  height: '400px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <p>Video: {lesson.videoUrl}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h3>Recommended Resources</h3>
            {lesson.resources && lesson.resources.length > 0 ? (
              <ul>
                {lesson.resources.map((resource, idx) => (
                  <li key={idx}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                    {resource.description && (
                      <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
                        {resource.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No additional resources for this lesson.</p>
            )}

            <h3 style={{ marginTop: '30px' }}>Key Concepts</h3>
            {lesson.keyTerms && lesson.keyTerms.length > 0 ? (
              <div>
                {lesson.keyTerms.map((term, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    marginBottom: '10px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <strong>{term.term}</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No key terms for this lesson.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
