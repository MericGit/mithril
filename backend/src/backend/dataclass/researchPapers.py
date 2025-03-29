from dataclasses import dataclass, asdict, field
from typing import List, Optional
from datetime import datetime
import uuid

@dataclass
class Author:
    name: str
    country: str = ""
    affiliation: str = ""

@dataclass
class PaperKeyword:
    keyword: str
    relevance: float

@dataclass
class RiskFactor:
    type: str  # 'HIGH', 'MEDIUM', 'LOW'
    category: str
    description: str
    relatedKeywords: List[str]
    potentialImpact: str
    mitigationSuggestion: str

@dataclass
class ResearchPaper:
    """
    Represents a research paper with its metadata.
    
    Attributes:
        id: Unique identifier for the paper
        title: Title of the research paper
        abstract: Abstract or summary of the paper
        authors: List of authors with their details
        publishedDate: Date when the paper was published
        citations: Number of citations
        doi: Digital Object Identifier
        topics: List of research topics
        keywords: List of keywords with relevance scores
        journal: Name of the journal where published
        riskFactors: List of risk factors associated with the paper
    """
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    abstract: str = ""
    authors: List[Author] = field(default_factory=list)
    publishedDate: str = ""
    citations: int = 0
    doi: str = ""
    topics: List[str] = field(default_factory=list)
    keywords: List[PaperKeyword] = field(default_factory=list)
    journal: str = ""
    riskFactors: List[RiskFactor] = field(default_factory=list)
    
    # Additional fields to match data.json
    paper_summary: str = ""
    presumed_publish_country: str = ""
    risk_score: int = 0
    author_info: List[str] = field(default_factory=list)
    topics_relevence: List[int] = field(default_factory=list)

    def to_dict(self) -> dict:
        """Convert the research paper to a dictionary format for JSON serialization."""
        return asdict(self)