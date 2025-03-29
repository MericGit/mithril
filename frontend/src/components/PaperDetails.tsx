import React from 'react';
import { ResearchPaper } from '../types/Paper';

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
        <div className="authors-grid">
          {paper.authors.map((author, index) => (
            <div key={index} className="author-card">
              <div className="author-name">{author.name}</div>
              <div className="author-affiliation">{author.affiliation}</div>
              <div className="author-country">{author.country}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Abstract */}
      <div className="abstract-section">
        <h2>Abstract</h2>
        <p className="abstract-text">{paper.abstract}</p>
      </div>

      {/* Topics and Keywords */}
      <div className="analysis-section">
        <div className="topics-section">
          <h2>Research Topics</h2>
          <div className="topics-list">
            {paper.topics.map((topic, index) => (
              <span key={index} className="topic-tag">{topic}</span>
            ))}
          </div>
        </div>

        <div className="keywords-section">
          <h2>Keyword Analysis</h2>
          <div className="keywords-visualization">
            {paper.keywords.sort((a, b) => b.relevance - a.relevance).map((keyword, index) => (
              <div key={index} className="keyword-bar">
                <div className="keyword-label">{keyword.keyword}</div>
                <div className="keyword-bar-container">
                  <div 
                    className="keyword-bar-fill"
                    style={{ width: `${keyword.relevance * 100}%` }}
                  />
                  <span className="keyword-score">{(keyword.relevance * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default PaperDetails;
