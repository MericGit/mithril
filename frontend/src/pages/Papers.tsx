import React, { useState, useEffect, useCallback } from 'react';
import PaperDetails from '../components/PaperDetails';
import { getPapers } from '../services/api';
import { ResearchPaper } from '../types/Paper';
import '../styles/PaperDetails.css';

const Papers: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [journal, setJournal] = useState('');
  const [minCitations, setMinCitations] = useState<number | ''>('');

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        keywords: keywords.length > 0 ? keywords : undefined,
        topics: topics.length > 0 ? topics : undefined,
        journal: journal || undefined,
        minCitations: minCitations !== '' ? Number(minCitations) : undefined,
      };
      const fetchedPapers = await getPapers(filters);
      setPapers(fetchedPapers);
      setSelectedPaper(fetchedPapers[0] || null);
    } catch (err) {
      setError('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  }, [keywords, topics, journal, minCitations]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleAddKeyword = () => {
    if (keywordInput && !keywords.includes(keywordInput)) {
      setKeywords([...keywords, keywordInput]);
      setKeywordInput('');
    }
  };

  const handleAddTopic = () => {
    if (topicInput && !topics.includes(topicInput)) {
      setTopics([...topics, topicInput]);
      setTopicInput('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="papers-page">
      <header className="app-header">
        <h1>Research Papers</h1>
        
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add keyword"
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <button onClick={handleAddKeyword}>Add</button>
            <div className="tags">
              {keywords.map(keyword => (
                <span key={keyword} className="tag">
                  {keyword}
                  <button onClick={() => setKeywords(keywords.filter(k => k !== keyword))}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Add topic"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
            />
            <button onClick={handleAddTopic}>Add</button>
            <div className="tags">
              {topics.map(topic => (
                <span key={topic} className="tag">
                  {topic}
                  <button onClick={() => setTopics(topics.filter(t => t !== topic))}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <input
              type="text"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Filter by journal"
            />
          </div>

          <div className="filter-group">
            <input
              type="number"
              value={minCitations}
              onChange={(e) => setMinCitations(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Min citations"
            />
          </div>
        </div>
      </header>
      
      <div className="main-content">
        <nav className="papers-nav">
          <div className="papers-list">
            {papers.length === 0 ? (
              <div className="no-results">No papers match the current filters</div>
            ) : (
              papers.map(paper => (
                <div 
                  key={paper.id}
                  className={`paper-item ${selectedPaper?.id === paper.id ? 'active' : ''}`}
                  onClick={() => setSelectedPaper(paper)}
                >
                  <h3 className="paper-item-title">{paper.title}</h3>
                  <div className="paper-item-meta">
                    <span>{paper.authors.map(a => a.name).join(', ')}</span>
                    <span>{paper.journal}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </nav>
        
        {selectedPaper && (
          <div className="paper-details">
            <PaperDetails paper={selectedPaper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Papers;
