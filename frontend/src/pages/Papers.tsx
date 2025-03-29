import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import PaperDetails from '../components/PaperDetails';
import { getPapers } from '../services/api';
import { ResearchPaper } from '../types/Paper';
import { useNavigate } from 'react-router-dom';
import '../styles/Papers.css';

export interface PapersRef {
  addNewPaper: (paper: ResearchPaper) => void;
}

const Papers = forwardRef<PapersRef>((props, ref) => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);


  // Add new paper to the top of the list
  const addNewPaper = useCallback((paper: ResearchPaper) => {
    setPapers(prevPapers => [paper, ...prevPapers]);
    setFilteredPapers(prevFiltered => [paper, ...prevFiltered]);
    setSelectedPaper(paper);
  }, []);

  // Expose addNewPaper method
  useImperativeHandle(ref, () => ({
    addNewPaper
  }));

  // Fetch papers on mount
  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPapers = await getPapers();
      // Sort papers by most recently added first
      const sortedPapers = fetchedPapers.sort((a, b) => {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      });
      setPapers(sortedPapers);
      setFilteredPapers(sortedPapers);
      if (sortedPapers.length > 0) {
        setSelectedPaper(prevSelected => prevSelected || sortedPapers[0]);
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch papers on mount only
  useEffect(() => {
    fetchPapers();
  }, []);

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

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(e.target.value);
  };

  // Filter papers based on criteria
  const filterPapers = useCallback(() => {
    let filtered = [...papers];

    if (keywords.length > 0) {
      filtered = filtered.filter(paper =>
        // Check if any of the selected keywords are in the paper's keywords list
        paper.keywords.some(k => keywords.includes(k.keyword.toLowerCase())) ||
        // Check if any of the selected keywords are in the paper title
        keywords.some(keyword => 
          paper.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    if (selectedTopic !== 'All') {
      filtered = filtered.filter(paper =>
        // Check if the paper's topics match the selected topic
        paper.topics.some(t => t.toLowerCase().includes(selectedTopic.toLowerCase())) ||
        // Check if the selected topic is in the paper title
        paper.title.toLowerCase().includes(selectedTopic.toLowerCase())
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
  }, [papers, keywords, selectedTopic, journal, minCitations, selectedPaper]);

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
});

export default Papers;