import React, { useState, useEffect } from 'react';
import PaperDetails from '../components/PaperDetails';
// import { samplePapers } from '../data/papers';  // Keeping for reference
import { getPapers } from '../services/api';
import { ResearchPaper } from '../types/Paper';
import '../styles/PaperDetails.css';

const Papers: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const fetchedPapers = await getPapers();
        setPapers(fetchedPapers);
        setSelectedPaper(fetchedPapers[0]);
      } catch (err) {
        setError('Failed to fetch papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedPaper) return <div>No papers available</div>;

  return (
    <div className="papers-page">
      <header className="app-header">
        <h1>Research Papers</h1>
      </header>
      
      <nav className="papers-nav">
        <div className="papers-list">
          {papers.map(paper => (
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
