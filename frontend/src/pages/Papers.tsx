import React, { useState, useEffect, useCallback, useRef } from 'react';
import PaperDetails from '../components/PaperDetails';
import { getPapers, uploadPaper } from '../services/api';
import { ResearchPaper } from '../types/Paper';
import { useNavigate } from 'react-router-dom';
import { researchTopics } from '../data/researchTopics';
import '../styles/Papers.css';

const Papers: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Filter states
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [journal, setJournal] = useState('');
  const [minCitations, setMinCitations] = useState<number | ''>('');

  // File upload handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError(null);

    try {
      const uploadedPaper = await uploadPaper(formData, (progress) => {
        setUploadProgress(progress);
      });

      // Add the new paper to the list and select it
      setPapers(prev => [uploadedPaper, ...prev]);
      setSelectedPaper(uploadedPaper);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to the papers page
      navigate('/papers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload paper');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
          <div className="upload-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
          <label htmlFor="topic-select">Keyword Search: </label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search"
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="topic-select">Research Topic: </label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={handleTopicChange}
              className="topic-dropdown"
            >
              <option value="All">All Topics</option>
              {researchTopics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <button onClick={handleAddKeyword}>Search</button>
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
