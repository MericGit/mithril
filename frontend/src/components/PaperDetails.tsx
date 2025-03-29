import React from 'react';
import { ResearchPaper } from '../types/Paper';
import RiskAnalysis from './RiskAnalysis';
import '../styles/PaperDetails.css';

interface PaperDetailsProps {
  paper: ResearchPaper;
}

const PaperDetails: React.FC<PaperDetailsProps> = ({ paper }) => {
  return (
    <div className="paper-details">
      {/* Paper Header */}
      <div className="paper-header">
        <h1 className="paper-title">{paper.title}</h1>
        <div className="paper-meta">
          <span className="journal">{paper.journal}</span>
          <span className="doi">DOI: {paper.doi}</span>
          <span className="date">Published: {new Date(paper.publishedDate).toLocaleDateString()}</span>
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
            </div>
          ))}
        </div>
      </div>

      {/* Abstract Section */}
      <div className="abstract-section">
        <h2>Abstract</h2>
        <p className="abstract-text">{paper.abstract}</p>
      </div>

      {/* Keywords Section */}
      <div className="keywords-section">
        <h2>Keywords</h2>
        <div className="keywords-list">
          {paper.keywords.map((keyword, index) => (
            <div key={index} className="keyword-card">
              <span className="keyword-text">{keyword.keyword}</span>
              <span className="keyword-relevance">{(keyword.relevance * 100).toFixed(0)}% relevance</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="topics-section">
        <h2>Topics</h2>
        <div className="topics-list">
          {paper.topics.map((topic, index) => (
            <span key={index} className="topic-tag">{topic}</span>
          ))}
        </div>
      </div>

      {/* Citations */}
      <div className="citations-section">
        <h2>Impact</h2>
        <div className="citations-card">
          <div className="citations-count">{paper.citations}</div>
          <div className="citations-label">Citations</div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="risk-analysis-section">
        <h2>Risk Analysis</h2>
        <RiskAnalysis riskFactors={paper.riskFactors || []} />
      </div>
    </div>
  );
};

export default PaperDetails;
