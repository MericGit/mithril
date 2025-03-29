from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
import json
import os
from .dataclass.researchPapers import ResearchPaper, Author, PaperKeyword, RiskFactor

router = APIRouter()

# Path to data.json file
DATA_PATH = '/Users/andreamor/Documents/mithril/backend/src/backend/clients/data.json'

def load_data_from_json() -> List[ResearchPaper]:
    """Load data from data.json and convert to ResearchPaper objects"""
    try:
        with open(DATA_PATH, 'r') as f:
            data_list = json.load(f)
        
        # Ensure data is a list
        if not isinstance(data_list, list):
            data_list = [data_list]
        
        papers = []
        
        # Process each paper in the list
        for index, data in enumerate(data_list):
            # Convert the data to a ResearchPaper object
            paper = ResearchPaper(
                id=str(index + 1),  # Generate a unique ID
                title=data.get("paper_title", ""),
                abstract=data.get("paper_abstract", ""),
                paper_summary=data.get("paper_summary", ""),
                presumed_publish_country=data.get("presumed_publish_country", ""),
                topics=data.get("topics", []),
                topics_relevence=data.get("topics_relevence", []),
                risk_score=data.get("risk_score", 0),
                author_info=data.get("author_info", []),
                publishedDate=datetime.now().strftime("%Y-%m-%d"),  # Default to current date
                citations=0,  # Default value
                doi="",  # Default value
                journal="",  # Default value
            )
            
            # Process authors
            authors_list = data.get("authors", [])
            author_info_list = data.get("author_info", [])
            
            # Create Author objects
            for i, author_name in enumerate(authors_list):
                # Try to extract affiliation from author_info if available
                affiliation = ""
                country = data.get("presumed_publish_country", "")
                
                if i < len(author_info_list):
                    info = author_info_list[i]
                    # Extract affiliation from info if possible
                    if ": " in info and ", " in info:
                        parts = info.split(", ")
                        if len(parts) > 1:
                            affiliation = parts[1]
                
                paper.authors.append(Author(
                    name=author_name,
                    country=country,
                    affiliation=affiliation
                ))
            
            # Process keywords/topics with relevance
            topics = data.get("topics", [])
            relevance_scores = data.get("topics_relevence", [])
            
            for i, topic in enumerate(topics):
                relevance = 0.5  # Default relevance
                if i < len(relevance_scores):
                    # Convert percentage to decimal
                    relevance = relevance_scores[i] / 100.0
                
                paper.keywords.append(PaperKeyword(
                    keyword=topic,
                    relevance=relevance
                ))
            
            # Create a risk factor based on the risk score
            risk_score = data.get("risk_score", 0)
            reasoning = data.get("reasoning", "")
            
            if risk_score > 0:
                risk_type = "LOW"
                if risk_score >= 70:
                    risk_type = "HIGH"
                elif risk_score >= 40:
                    risk_type = "MEDIUM"
                    
                paper.riskFactors.append(RiskFactor(
                    type=risk_type,
                    category="Security",
                    description=reasoning,
                    relatedKeywords=topics[:2] if len(topics) >= 2 else topics,  # Use first two topics as related keywords
                    potentialImpact="This research may have security implications based on the risk assessment.",
                    mitigationSuggestion="Review the paper carefully and consult with security experts."
                ))
            
            papers.append(paper)
        
        return papers
    except Exception as e:
        print(f"Error loading data from JSON: {e}")
        # Return sample data as fallback
        return [
            ResearchPaper(
                id="1",
                title="Advances in Quantum Computing: A Survey of Recent Developments",
                abstract="This comprehensive survey examines recent developments in quantum computing, focusing on quantum supremacy achievements and practical applications in cryptography and optimization...",
                authors=[
                    Author(
                        name="Sarah Chen",
                        country="United States",
                        affiliation="Stanford University"
                    ),
                    Author(
                        name="Alexander Petrov",
                        country="Russia",
                        affiliation="Moscow State University"
                    )
                ],
                publishedDate="2024-12-15",
                citations=145,
                doi="10.1234/qc.2024.12345",
                topics=["Quantum Computing", "Cryptography", "Computer Science"],
                keywords=[
                    PaperKeyword(keyword="quantum supremacy", relevance=0.95),
                    PaperKeyword(keyword="quantum circuits", relevance=0.85)
                ],
                journal="Nature Quantum Information"
            ),
            ResearchPaper(
                id="2",
                title="Deep Learning Applications in Autonomous Systems",
                abstract="This paper explores novel applications of deep learning in autonomous systems, with a focus on real-time decision making and adaptive control mechanisms...",
                authors=[
                    Author(
                        name="Wei Zhang",
                        country="China",
                        affiliation="Tsinghua University"
                    ),
                    Author(
                        name="Emily Brown",
                        country="United States",
                        affiliation="MIT"
                    )
                ],
                publishedDate="2025-01-20",
                citations=89,
                doi="10.1234/ai.2025.67890",
                topics=["Artificial Intelligence", "Robotics", "Computer Vision"],
                keywords=[
                    PaperKeyword(keyword="deep learning", relevance=0.95),
                    PaperKeyword(keyword="autonomous systems", relevance=0.90)
                ],
                journal="IEEE Transactions on Artificial Intelligence"
            )
        ]

# Load papers from data.json
sample_papers = load_data_from_json()

@router.get("/api/papers")
async def get_papers(
    countries: List[str] = None,
    topics: List[str] = None,
    authors: List[str] = None,
    keywords: List[str] = None,
    journal: str = None,
    date_from: str = None,
    date_to: str = None,
    min_citations: int = None
):
    filtered_papers = sample_papers

    if countries:
        filtered_papers = [
            paper for paper in filtered_papers
            if any(author.country in countries for author in paper.authors)
        ]

    if topics:
        filtered_papers = [
            paper for paper in filtered_papers
            if any(topic in topics for topic in paper.topics)
        ]

    if authors:
        filtered_papers = [
            paper for paper in filtered_papers
            if any(author.name in authors for author in paper.authors)
        ]

    if keywords:
        filtered_papers = [
            paper for paper in filtered_papers
            if any(kw.keyword in keywords for kw in paper.keywords)
        ]

    if journal:
        filtered_papers = [
            paper for paper in filtered_papers
            if paper.journal.lower() == journal.lower()
        ]

    if date_from:
        filtered_papers = [
            paper for paper in filtered_papers
            if paper.publishedDate >= date_from
        ]

    if date_to:
        filtered_papers = [
            paper for paper in filtered_papers
            if paper.publishedDate <= date_to
        ]

    if min_citations is not None:
        filtered_papers = [
            paper for paper in filtered_papers
            if paper.citations >= min_citations
        ]

    return [paper.to_dict() for paper in filtered_papers]

@router.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    for paper in sample_papers:
        if paper.id == paper_id:
            return paper.to_dict()
    return {"error": "Paper not found"}
