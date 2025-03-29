import React from 'react';
import { ResearchPaper } from '../types/Paper';
import RiskAnalysis from './RiskAnalysis';
import '../styles/PaperDetails.css';

interface PaperDetailsProps {
  paper: ResearchPaper;
}

const PaperDetails: React.FC<PaperDetailsProps> = ({ paper }) => {
  // Helper function to determine risk score class
  const getRiskScoreClass = (score: number): string => {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };
  return (
    <div className="paper-details">
      {/* Paper Header */}
      <div className="paper-header">
        <h1 className="paper-title">{paper.title}</h1>
        <div className="paper-meta">
          {paper.journal && <span className="journal">{paper.journal}</span>}
          {paper.doi && <span className="doi">DOI: {paper.doi}</span>}
          <span className="date">Published: {new Date(paper.publishedDate).toLocaleDateString()}</span>
          {paper.presumed_publish_country && (
            <span className="country">Country: {paper.presumed_publish_country}</span>
          )}
        </div>
      </div>

      {/* Authors Section */}
      <div className="authors-section">
        <h2>Authors</h2>
        <div className="authors-list">
          {paper.authors.map((author, index) => (
            <div key={index} className="author-card">
              <div className="author-name">{author.name}</div>
              <div className="author-details">
                <span>{author.affiliation}</span>
                <span>{author.country}</span>
              </div>
              {/* Display additional author info if available */}
              {paper.author_info && paper.author_info[index] && (
                <div className="author-bio">
                  <p>{paper.author_info[index]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Abstract Section */}
      <div className="abstract-section">
        <h2>Abstract</h2>
        <p className="abstract-text">{paper.abstract}</p>
      </div>

      {/* Summary Section - New */}
      {paper.paper_summary && (
        <div className="summary-section">
          <h2>Summary</h2>
          <p className="summary-text">{paper.paper_summary}</p>
        </div>
      )}

      {/* Topics Section */}
      <div className="topics-section">
        <h2>Topics</h2>
        <div className="topics-list">
          {paper.topics.map((topic, index) => (
            <span key={index} className="topic-tag">
              {topic}
              {paper.topics_relevence && paper.topics_relevence[index] && (
                <span className="topic-relevance"> ({paper.topics_relevence[index]}%)</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="risk-analysis-section">
        <h2>Risk Analysis</h2>
        {paper.risk_score !== undefined && (
          <div className="risk-score-container">
            <div className={`risk-score ${getRiskScoreClass(paper.risk_score)}`}>
              <span className="score-value">{paper.risk_score}</span>
              <span className="score-label">Risk Score</span>
            </div>
          </div>
        )}
        <RiskAnalysis riskFactors={paper.riskFactors || []} />
      </div>
    </div>
  );
};

export default PaperDetails;
