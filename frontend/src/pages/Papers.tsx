import React, { useState, useEffect, useCallback } from 'react';
import PaperDetails from '../components/PaperDetails';
import { getPapers } from '../services/api';
import { ResearchPaper } from '../types/Paper';
import '../styles/Papers.css';

const Papers: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [journal, setJournal] = useState('');
  const [minCitations, setMinCitations] = useState<number | ''>('');

  // Handlers
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

  // Filter papers based on criteria
  const filterPapers = useCallback(() => {
    let filtered = [...papers];

    if (keywords.length > 0) {
      filtered = filtered.filter(paper =>
        paper.keywords.some(k => keywords.includes(k.keyword.toLowerCase()))
      );
    }

    if (topics.length > 0) {
      filtered = filtered.filter(paper =>
        paper.topics.some(t => topics.includes(t.toLowerCase()))
      );
    }

    if (journal) {
      filtered = filtered.filter(paper =>
        paper.journal.toLowerCase().includes(journal.toLowerCase())
      );
    }

    if (minCitations !== '') {
      filtered = filtered.filter(paper => paper.citations >= minCitations);
    }

    setFilteredPapers(filtered);
    if (filtered.length > 0 && !selectedPaper) {
      setSelectedPaper(filtered[0]);
    }
  }, [papers, keywords, topics, journal, minCitations, selectedPaper]);

  // Fetch papers on mount
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const fetchedPapers = await getPapers();
        setPapers(fetchedPapers);
        setFilteredPapers(fetchedPapers);
        if (fetchedPapers.length > 0) {
          setSelectedPaper(fetchedPapers[0]);
        }
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError('Failed to fetch papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    filterPapers();
  }, [filterPapers]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="papers-page">
      <header className="app-header">
        <div className="header-content">
          <h1>Research Papers</h1>
        </div>
        
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
            {filteredPapers.length === 0 ? (
              <div className="no-results">No papers match the current filters</div>
            ) : (
              filteredPapers.map(paper => (
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
          <div className="paper-content">
            <PaperDetails paper={selectedPaper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Papers;
