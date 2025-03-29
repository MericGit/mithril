from fastapi import APIRouter
from typing import List
from datetime import datetime
from .dataclass.researchPapers import ResearchPaper, Author, PaperKeyword

router = APIRouter()

# Sample data using dataclasses
sample_papers = [
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

@router.get("/api/papers")
async def get_papers():
    return [paper.to_dict() for paper in sample_papers]

@router.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    for paper in sample_papers:
        if paper.id == paper_id:
            return paper.to_dict()
    return {"error": "Paper not found"}
