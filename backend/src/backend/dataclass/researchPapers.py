from dataclasses import dataclass, asdict
from typing import List
from datetime import datetime

@dataclass
class Author:
    name: str
    country: str
    affiliation: str

@dataclass
class PaperKeyword:
    keyword: str
    relevance: float

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
    """
    id: str
    title: str
    abstract: str
    authors: List[Author]
    publishedDate: str
    citations: int
    doi: str
    topics: List[str]
    keywords: List[PaperKeyword]
    journal: str

    def to_dict(self) -> dict:
        """Convert the research paper to a dictionary format for JSON serialization."""
        return asdict(self)