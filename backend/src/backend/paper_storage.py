import pickle
from pathlib import Path
from typing import List, Optional
from .dataclass.researchPapers import ResearchPaper

class PaperStorage:
    def __init__(self, storage_path: str = "papers.pickle"):
        """Initialize the paper storage with a path to the pickle file."""
        self.storage_path = Path(storage_path)
        self.papers: List[ResearchPaper] = []
        self._load_papers()

    def _load_papers(self) -> None:
        """Load papers from pickle file if it exists."""
        if self.storage_path.exists():
            try:
                with open(self.storage_path, 'rb') as f:
                    self.papers = pickle.load(f)
            except (pickle.UnpicklingError, EOFError):
                self.papers = []
        else:
            self.papers = []

    def save_papers(self) -> None:
        """Save current papers to pickle file."""
        with open(self.storage_path, 'wb') as f:
            pickle.dump(self.papers, f)

    def add_paper(self, paper: ResearchPaper) -> None:
        """Add a new paper and save to storage."""
        self.papers.append(paper)
        self.save_papers()

    def add_papers(self, papers: List[ResearchPaper]) -> None:
        """Add multiple papers and save to storage."""
        self.papers.extend(papers)
        self.save_papers()

    def get_all_papers(self) -> List[ResearchPaper]:
        """Retrieve all papers."""
        return self.papers

    def get_paper_by_id(self, paper_id: str) -> Optional[ResearchPaper]:
        """Retrieve a specific paper by ID."""
        return next((paper for paper in self.papers if paper.id == paper_id), None)

    def clear_storage(self) -> None:
        """Clear all papers from storage."""
        self.papers = []
        self.save_papers()
