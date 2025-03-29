from dataclasses import dataclass, asdict, field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
import json
import os
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
    id: str
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

    def to_dict(self) -> dict:
        """Convert the research paper to a dictionary format for JSON serialization."""
        return asdict(self)

    @classmethod
    def from_json_data(cls, json_data: Dict[str, Any]) -> 'ResearchPaper':
        """
        Create a ResearchPaper instance from data.json format
        
        Args:
            json_data: Dictionary containing paper data from data.json
            
        Returns:
            ResearchPaper instance populated with the data
        """
        # Generate a unique ID if not present
        paper_id = str(uuid.uuid4())
        
        # Extract author information
        authors = []
        if "authors" in json_data and "author_info" in json_data:
            for i, name in enumerate(json_data["authors"]):
                # Default values
                country = ""
                affiliation = ""
                
                # Try to extract country and affiliation from author_info if available
                if i < len(json_data["author_info"]):
                    info = json_data["author_info"][i]
                    # If country is in the data, extract it
                    if "presumed_publish_country" in json_data:
                        country = json_data["presumed_publish_country"]
                    # Use the full info string as affiliation
                    affiliation = info
                
                authors.append(Author(name=name, country=country, affiliation=affiliation))
        
        # Extract topics and create keywords with relevance scores if available
        topics = json_data.get("topics", [])
        keywords = []
        
        # If topics_relevence exists and has matching length with topics
        if "topics_relevence" in json_data and len(json_data["topics_relevence"]) == len(topics):
            for i, topic in enumerate(topics):
                relevance = json_data["topics_relevence"][i] / 100.0  # Convert to 0-1 scale
                keywords.append(PaperKeyword(keyword=topic, relevance=relevance))
        else:
            # Default relevance of 1.0 if no relevance scores are provided
            keywords = [PaperKeyword(keyword=topic, relevance=1.0) for topic in topics]
        
        # Create a risk factor based on the risk_score if available
        risk_factors = []
        if "risk_score" in json_data and "reasoning" in json_data:
            risk_score = json_data["risk_score"]
            risk_type = "HIGH" if risk_score >= 75 else "MEDIUM" if risk_score >= 40 else "LOW"
            
            risk_factors.append(RiskFactor(
                type=risk_type,
                category="Security Risk",
                description=json_data.get("reasoning", ""),
                relatedKeywords=topics[:3],  # Use first 3 topics as related keywords
                potentialImpact="This research may have implications for national security based on the risk assessment.",
                mitigationSuggestion="Further review by domain experts is recommended."
            ))
        
        # Create and return the ResearchPaper instance
        return cls(
            id=paper_id,
            title="Stone Soup as a Feature Extractor for Deep Reinforcement Learning in Sensor Management",  # Inferred from summary
            abstract=json_data.get("paper_summary", ""),
            authors=authors,
            publishedDate=datetime.now().strftime("%Y-%m-%d"),  # Current date as fallback
            citations=0,  # Default value
            doi="",  # Default value
            topics=topics,
            keywords=keywords,
            journal="",  # Default value
            riskFactors=risk_factors
        )

def load_papers_from_json(json_file_path: str) -> List[ResearchPaper]:
    """
    Load papers from a JSON file
    
    Args:
        json_file_path: Path to the JSON file containing paper data
        
    Returns:
        List of ResearchPaper instances
    """
    if not os.path.exists(json_file_path):
        return []
    
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
            
        # If data is a list, process each item
        if isinstance(data, list):
            return [ResearchPaper.from_json_data(item) for item in data]
        # If data is a single object, process it
        else:
            return [ResearchPaper.from_json_data(data)]
    except Exception as e:
        print(f"Error loading papers from JSON: {e}")
        return []