from fastapi import APIRouter
from typing import List
from datetime import datetime
import os
import json
from pathlib import Path
from .dataclass.researchPapers import ResearchPaper, Author, PaperKeyword, RiskFactor, load_papers_from_json

router = APIRouter()

# Get the path to the data.json file
base_dir = Path(__file__).resolve().parent
data_json_path = os.path.join(base_dir, 'clients', 'data.json')

papers = load_papers_from_json(data_json_path)

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
    filtered_papers = papers

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
    for paper in papers:
        if paper.id == paper_id:
            return paper.to_dict()
    return {"error": "Paper not found"}
