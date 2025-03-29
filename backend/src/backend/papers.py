from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import os
import base64
from pathlib import Path
from .dataclass.researchPapers import ResearchPaper, Author, PaperKeyword, RiskFactor
from .clients.agiClient import AGIClient

router = APIRouter()
agi_client = AGIClient()

# Path to local data directory for storing uploaded PDFs
UPLOAD_DIR = Path(__file__).resolve().parent / "local_data"
UPLOAD_DIR.mkdir(exist_ok=True)

# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes

# Path to data.json file
DATA_PATH = os.path.join(os.path.dirname(__file__), 'clients', 'data.json')

def load_data_from_json() -> List[ResearchPaper]:
    """Load data from data.json and convert to ResearchPaper objects"""
    try:
        with open(DATA_PATH, 'r') as f:
            data_list = json.load(f)
            papers = []
            
            for data in data_list:
                # Create base paper object
                paper = ResearchPaper(
                    id=str(len(papers) + 1),
                    title=data.get("paper_title", ""),
                    abstract=data.get("paper_abstract", ""),
                    paper_summary=data.get("paper_summary", ""),
                    presumed_publish_country=data.get("presumed_publish_country", ""),
                    topics=data.get("topics", []),
                    topics_relevence=data.get("topics_relevence", []),
                    risk_score=data.get("risk_score", 0),
                    author_info=data.get("author_info", []),
                    publishedDate=data.get("paper_publish_date", datetime.now().strftime("%Y-%m-%d")),
                    addedDate=datetime.now().strftime("%Y-%m-%d"),  # Always set to current time
                    citations=0,
                    doi=data.get("paper_doi", ""),
                    journal=data.get("paper_journal", "")
                )
                
                # Add authors
                for i, author_name in enumerate(data.get("authors", [])):
                    affiliation = ""
                    country = data.get("presumed_publish_country", "")
                    
                    if i < len(data.get("author_info", [])):
                        info = data["author_info"][i]
                        if ": " in info and ", " in info:
                            parts = info.split(", ")
                            if len(parts) > 1:
                                affiliation = parts[1]
                    
                    paper.authors.append(Author(
                        name=author_name,
                        country=country,
                        affiliation=affiliation
                    ))
                
                # Add keywords/topics
                for i, topic in enumerate(data.get("topics", [])):
                    relevance = 0.5
                    if i < len(data.get("topics_relevence", [])):
                        relevance = data["topics_relevence"][i] / 100.0
                    
                    paper.keywords.append(PaperKeyword(
                        keyword=topic,
                        relevance=relevance
                    ))
                
                # Add risk factor if score exists
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
                        relatedKeywords=paper.topics[:2] if len(paper.topics) >= 2 else paper.topics,
                        potentialImpact="This research may have security implications based on the risk assessment.",
                        mitigationSuggestion="Review the paper carefully and consult with security experts."
                    ))
                
                papers.append(paper)
            
            return papers
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

def save_papers_to_json():
    papers_data = [paper.to_dict() for paper in sample_papers]
    with open(DATA_PATH, 'w') as f:
        json.dump(papers_data, f, indent=4)

# Load papers from data.json
sample_papers = load_data_from_json()

@router.post("/api/papers/save")
async def save_paper(request: Request):
    """Save uploaded PDF file to local_data directory"""
    try:
        body = await request.json()
        filename = body.get('filename')
        content = body.get('content')  # base64 encoded content

        if not filename or not content:
            raise HTTPException(status_code=400, detail="Missing filename or content")

        if not filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        try:
            # Decode base64 content
            file_content = base64.b64decode(content)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid file content")

        # Save file to local_data directory
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as f:
            f.write(file_content)

        return {"message": "File saved successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/papers/analyze")
async def analyze_paper(request: Request):
    """Analyze PDF file using AGIClient"""
    try:
        body = await request.json()
        filename = body.get('filename')

        if not filename:
            raise HTTPException(status_code=400, detail="Missing filename")

        # Get file path
        file_path = UPLOAD_DIR / filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        try:
            # Process the PDF using AGIClient
            paper_data = agi_client.nlp_pipeline(str(file_path))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AGI analysis failed: {str(e)}")
        
        # Create a new ResearchPaper object
        paper = ResearchPaper(
            id=str(len(sample_papers) + 1),
            title=paper_data.get("paper_title", ""),
            abstract=paper_data.get("paper_abstract", ""),
            paper_summary=paper_data.get("paper_summary", ""),
            presumed_publish_country=paper_data.get("presumed_publish_country", ""),
            topics=paper_data.get("topics", []),
            topics_relevence=paper_data.get("topics_relevence", []),
            risk_score=paper_data.get("risk_score", 0),
            author_info=paper_data.get("author_info", []),
            publishedDate=paper_data.get("paper_publish_date", datetime.now().strftime("%Y-%m-%d")),
            addedDate=datetime.now().strftime("%Y-%m-%d"),  # Always set to current time
            citations=0,
            doi=paper_data.get("paper_doi", ""),
            journal=paper_data.get("paper_journal", "")
        )
        
        # Add authors
        for i, author_name in enumerate(paper_data.get("authors", [])):
            affiliation = ""
            country = paper_data.get("presumed_publish_country", "")
            
            if i < len(paper_data.get("author_info", [])):
                info = paper_data["author_info"][i]
                if ": " in info and ", " in info:
                    parts = info.split(", ")
                    if len(parts) > 1:
                        affiliation = parts[1]
            
            paper.authors.append(Author(
                name=author_name,
                country=country,
                affiliation=affiliation
            ))
        
        # Add keywords/topics
        for i, topic in enumerate(paper_data.get("topics", [])):
            relevance = 0.5
            if i < len(paper_data.get("topics_relevence", [])):
                relevance = paper_data["topics_relevence"][i] / 100.0
            
            paper.keywords.append(PaperKeyword(
                keyword=topic,
                relevance=relevance
            ))
        
        # Add risk factor if score exists
        risk_score = paper_data.get("risk_score", 0)
        reasoning = paper_data.get("reasoning", "")
        
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
                relatedKeywords=paper.topics[:2] if len(paper.topics) >= 2 else paper.topics,
                potentialImpact="This research may have security implications based on the risk assessment.",
                mitigationSuggestion="Review the paper carefully and consult with security experts."
            ))
        
        # Insert the new paper at the beginning of the list
        sample_papers.insert(0, paper)
        
        # Save updated papers to data.json
        save_papers_to_json()

        return paper

    except Exception as e:
        # Clean up the file if there was an error
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/papers")
async def get_papers(
    countries: List[str] = None,
    topics: List[str] = None,
    journal: str = None,
    date_from: str = None,
    date_to: str = None,
    min_citations: int = None,
    keyword: Optional[str] = None
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
            if any(topic in paper.topics for topic in topics)
        ]

    if journal:
        filtered_papers = [
            paper for paper in filtered_papers
            if paper.journal == journal
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

    if keyword:
        keyword_lower = keyword.lower()
        filtered_papers = [
            paper for paper in filtered_papers
            if keyword_lower in paper.title.lower() or
               any(keyword_lower in topic.lower() for topic in paper.topics)
        ]

    return [paper.to_dict() for paper in filtered_papers]

@router.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    for paper in sample_papers:
        if paper.id == paper_id:
            return paper.to_dict()
    return {"error": "Paper not found"}