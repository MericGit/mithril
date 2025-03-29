import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../styles/PaperUpload.css';

interface PaperUploadProps {
  onUploadSuccess: () => void;
}

const PaperUpload: React.FC<PaperUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(uploadedFile);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulated upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      onUploadSuccess();
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="paper-upload">
      <div className="upload-container">
        <div {...getRootProps()} className="upload-area">
          <input {...getInputProps()} />
          <div className="upload-content">
            {!file ? (
              <>
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  {isDragActive ? (
                    <span>Drop the PDF here</span>
                  ) : (
                    <span>
                      <strong>Click to upload</strong> or drag and drop
                    </span>
                  )}
                </div>
                <div className="upload-hint">PDF files only</div>
              </>
            ) : (
              <>
                <div className="upload-icon">✓</div>
                <div className="file-name">{file.name}</div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}

        {file && !error && (
          <>
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {progress}% uploaded
                </div>
              </div>
            )}
            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaperUpload;
