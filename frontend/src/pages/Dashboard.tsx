import React from 'react';
import PaperUpload from '../components/PaperUpload';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/papers');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Research Paper Risk Analysis</h1>
          <p className="subtitle">
            Upload your research paper to analyze potential risks and ethical considerations
          </p>
        </div>

        <div className="upload-section">
          <PaperUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Deep Analysis</h3>
            <p>Advanced AI model analyzes research papers for potential risks and ethical concerns</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get immediate feedback on risk factors and suggested mitigation strategies</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Comprehensive Report</h3>
            <p>Detailed breakdown of identified risks, impacts, and mitigation recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
