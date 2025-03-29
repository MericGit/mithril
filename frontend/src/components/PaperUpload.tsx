import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { ResearchPaper } from '../types/Paper';
import '../styles/PaperUpload.css';

interface PaperUploadProps {
  onUploadSuccess: (paper: ResearchPaper) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const PaperUpload: React.FC<PaperUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'analyzing'>('idle');
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  const analyzeMessages = [
    "Feeling the AGI...",
    "It's not procrastinating if the AI is doing it...",
    "Assembling jargon into slightly less intimidating insights...",
    "Converting buzzwords into actual meaning...",
    "Making sense of your PhD trauma...",
    "Applying Occam's Razor to that 80-page PDF..."
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (stage === 'analyzing') {
      intervalId = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % analyzeMessages.length);
      }, 3000); // Change message every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [stage]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      // Reset state
      setError(null);
      setUploading(true);
      setStage('uploading');
      setProgress(0);
      console.log(`📄 Starting upload of ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Content = e.target?.result as string;
          if (!base64Content) throw new Error('Failed to read file');

          // Save file to local_data directory
          setProgress(30);
          const response = await fetch('http://localhost:8000/api/papers/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              content: base64Content.split(',')[1], // Remove data:application/pdf;base64, prefix
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to save file');
          }

          // Start AGI analysis
          console.log('🔍 File saved, starting AGI analysis...');
          setStage('analyzing');
          setProgress(50);

          const analysisResponse = await fetch('http://localhost:8000/api/papers/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
            }),
          });

          if (!analysisResponse.ok) {
            const error = await analysisResponse.json();
            throw new Error(error.detail || 'Analysis failed');
          }

          const data = await analysisResponse.json();
          console.log('✅ Analysis complete:', data);
          setProgress(100);
          
          // Return full paper object
          onUploadSuccess(data);
          navigate('/papers');
          
        } catch (err) {
          console.error('❌ Error:', err);
          setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
          setStage('idle');
          setUploading(false);
          setProgress(0);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setStage('idle');
      setUploading(false);
      setProgress(0);
    }
  }, [navigate, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="paper-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {stage === 'idle' && (
          <>
            {isDragActive ? (
              <p>Drop the PDF file here...</p>
            ) : (
              <p>Drag and drop a PDF file here, or click to select one</p>
            )}
          </>
        )}

        {stage === 'uploading' && (
          <div className="upload-status">
            <div className="loading-spinner"></div>
            <p>Uploading file...</p>
          </div>
        )}

        {stage === 'analyzing' && (
          <div className="upload-status">
            <div className="loading-spinner"></div>
            <p className="analyze-message">{analyzeMessages[messageIndex]}</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PaperUpload;