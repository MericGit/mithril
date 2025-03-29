from dataclasses import dataclass, asdict, field
from typing import List, Optional, Dict, Any, Tuple
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

@dataclass
class CountryPublicationData:
    """
    Represents publication data for a specific country.
    
    Attributes:
        name: Name of the country
        color: HEX color code for charts
        flag: Country flag emoji
        data: List of publication counts by year
    """
    name: str
    color: str
    flag: str
    data: List[int]
    
    def to_dict(self) -> dict:
        """Convert the country publication data to a dictionary format for JSON serialization."""
        return asdict(self)

@dataclass
class PublicationsData:
    """
    Represents aggregate publication data across countries and years.
    
    Attributes:
        years: List of years for which data is available
        countries: List of country publication data
    """
    years: List[int]
    countries: List[CountryPublicationData]
    
    def to_dict(self) -> dict:
        """Convert the publications data to a dictionary format for JSON serialization."""
        return {
            "years": self.years,
            "countries": [country.to_dict() for country in self.countries]
        }

@dataclass
class WorldMapPoint:
    """
    Represents a research point on the world map.
    
    Attributes:
        id: Unique identifier for the point
        country: Country name
        topic: Research topic
        coordinates: Geographical coordinates [latitude, longitude]
        intensity: Research intensity (0.0 to 1.0)
        description: Brief description of the research
        adversarial: Whether the research is considered adversarial
    """
    id: str
    country: str
    topic: str
    # coordinates: List[float]
    intensity: float
    description: str
    adversarial: bool
    
    def to_dict(self) -> dict:
        """Convert the world map point to a dictionary format for JSON serialization."""
        return asdict(self)