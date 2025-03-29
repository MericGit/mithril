import React, { useState } from 'react';
import PaperDetails from '../components/PaperDetails';
import { samplePapers } from '../data/papers';
import '../styles/PaperDetails.css';

const Papers: React.FC = () => {
  const [selectedPaper, setSelectedPaper] = useState(samplePapers[0]);
  
  return (
    <div className="papers-page">
      <header className="app-header">
        <h1>Research Papers</h1>
      </header>
      
      <nav className="papers-nav">
        <div className="papers-list">
          {samplePapers.map(paper => (
            <div 
              key={paper.id}
              className={`paper-item ${selectedPaper.id === paper.id ? 'active' : ''}`}
              onClick={() => setSelectedPaper(paper)}
            >
              <h3 className="paper-item-title">{paper.title}</h3>
              <div className="paper-item-meta">
                <span>{paper.authors.map(a => a.name).join(', ')}</span>
                <span>{paper.journal}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>
      
      <main className="paper-content">
        <PaperDetails paper={selectedPaper} />
      </main>
    </div>
  );
};

export default Papers;
