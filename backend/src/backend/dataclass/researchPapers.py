from dataclasses import dataclass
from typing import List, Optional
from pathlib import Path

@dataclass
class ResearchPaper:
    """
    Represents a research paper with its metadata and file location.
    
    Attributes:
        countries: List of countries where the research originated
        authors: List of authors of the paper
        file_path: Path to the research paper file
        topic: Main topic or subject area of the paper
        title: Title of the research paper
        institutions: List of institutions involved in the research
    """
    countries: List[str]
    authors: List[str]
    file_path: Path
    topic: str
    title: str
    institutions: List[str]
    
    def __post_init__(self):
        """Validate and convert file_path to Path object if it's a string."""
        if isinstance(self.file_path, str):
            self.file_path = Path(self.file_path)
            
    @property
    def exists(self) -> bool:
        """Check if the paper file exists in the specified location."""
        return self.file_path.exists()
    
    def __str__(self) -> str:
        """Return a string representation of the research paper."""
        return f"{self.title} by {', '.join(self.authors)} ({', '.join(self.countries)}) - {self.topic}"