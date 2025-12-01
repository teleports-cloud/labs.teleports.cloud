"""Base format parser interface"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class FormatMetadata:
    """Metadata about a file format"""
    name: str
    extensions: List[str]
    era: str
    category: str  # Database, Spreadsheet, Word Processor, etc.
    description: str
    magic_bytes: Optional[bytes] = None


class BaseFormatParser(ABC):
    """Base class for all format parsers"""

    @classmethod
    @abstractmethod
    def get_metadata(cls) -> FormatMetadata:
        """Return metadata about this format"""
        pass

    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.filename = filepath.name
        self.data = filepath.read_bytes()
        self.records: List[Dict[str, Any]] = []
        self.extraction_metadata: Dict[str, Any] = {}

    @abstractmethod
    def parse(self) -> Dict[str, Any]:
        """
        Parse the file and extract data

        Returns:
            Dict with 'records' and 'metadata' keys
        """
        pass

    @abstractmethod
    def get_field_names(self) -> List[str]:
        """Return the field names extracted from this format"""
        pass

    def validate(self) -> bool:
        """
        Validate that the file matches this format

        Returns:
            True if file is valid for this format
        """
        metadata = self.get_metadata()

        # Check extension
        if metadata.extensions:
            ext = self.filepath.suffix.lower()
            if ext not in [e.lower() for e in metadata.extensions]:
                return False

        # Check magic bytes if defined
        if metadata.magic_bytes and len(self.data) >= len(metadata.magic_bytes):
            if not self.data.startswith(metadata.magic_bytes):
                return False

        return True

    def to_dict(self) -> Dict[str, Any]:
        """Convert parser results to dictionary"""
        return {
            'records': self.records,
            'metadata': self.extraction_metadata,
            'format': self.get_metadata().__dict__,
        }
