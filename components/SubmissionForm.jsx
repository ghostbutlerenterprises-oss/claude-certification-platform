// components/SubmissionForm.jsx
import { useState } from 'react';

export default function SubmissionForm({ onSubmit, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setSelectedFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/zip', 'application/json'];
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported. Please upload PDF, TXT, ZIP, or JSON');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await onSubmit(fileName, event.target.result);
          setSelectedFile(null);
          setFileName('');
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (err) {
      setError('Error reading file: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center',
        backgroundColor: '#f0f8ff',
        cursor: 'pointer'
      }}>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.txt,.zip,.json"
          disabled={loading}
        />

        <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            {selectedFile ? '✓ ' + fileName : 'Click to select or drag file'}
          </p>
          <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '14px' }}>
            Supported formats: PDF, TXT, ZIP, JSON (Max 10MB)
          </p>
        </label>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={!selectedFile || loading}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: selectedFile && !loading ? 1 : 0.5
          }}
        >
          {loading ? 'Uploading...' : 'Submit Project'}
        </button>

        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setFileName('');
            }}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
