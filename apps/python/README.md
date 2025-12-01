# Historic File Format Viewer

Modular TUI application for recovering and converting historic file formats (1970s-2000s) into modern formats.

## Architecture

The project is organized into a modular architecture where each file format is a self-contained module:

```
apps/python/
├── formats/              # Format parser modules
│   ├── __init__.py
│   ├── base.py          # Base parser interface
│   ├── smartware.py     # SmartWare II parser
│   └── [new formats]    # Add new formats here
│
├── widgets/             # Reusable UI components
│   ├── __init__.py
│   ├── panels.py        # Reusable panels (stats, info, file list)
│   └── screens.py       # Reusable screens (viewer, formats)
│
├── viewer.py            # Main TUI application
└── smartware_viewer.py  # Legacy viewer (deprecated)
```

## Adding a New Format

To add support for a new file format:

### 1. Create the Parser Module

Create a new file in `formats/` (e.g., `formats/dbase.py`):

```python
from .base import BaseFormatParser, FormatMetadata

class DBaseParser(BaseFormatParser):
    """Parser for dBase III/IV .dbf files"""

    @classmethod
    def get_metadata(cls) -> FormatMetadata:
        return FormatMetadata(
            name="dBase III/IV",
            extensions=[".dbf"],
            era="1980s-1990s",
            category="Database",
            description="dBase database files",
            magic_bytes=b'\x03',  # dBase III magic byte
        )

    def get_field_names(self) -> List[str]:
        """Return field names extracted from the file"""
        return self.field_names  # Parsed from file header

    def parse(self) -> Dict[str, Any]:
        """Parse the dBase file"""
        # Your parsing logic here
        self.records = []  # List of dicts
        self.extraction_metadata = {}
        return {'records': self.records, 'metadata': self.extraction_metadata}
```

### 2. Register in `formats/__init__.py`

```python
from .dbase import DBaseParser

__all__ = ["BaseFormatParser", "FormatMetadata", "SmartWareParser", "DBaseParser"]
```

### 3. Add to the Viewer

In `viewer.py`, create a viewer screen for your format:

```python
from formats import DBaseParser

# In HistoricFormatViewer.__init__:
dbase_viewer = BaseViewerScreen(dbase_files, DBaseParser, "dBase")
self.install_screen(dbase_viewer, name="dbase-viewer")
```

## Reusable Widgets

The architecture provides reusable widgets that work with any format:

### StatsPanel
Displays statistics from any format's records:
```python
stats_panel.update_stats(records, metadata, "Format Name")
```

### InfoPanel
Shows format-specific information:
```python
info_panel.update_info(parser, "Format Name")
```

### FileListPanel
Sidebar for file navigation:
```python
yield FileListPanel(files)
```

### BaseViewerScreen
Complete data viewer that works with any parser:
```python
viewer = BaseViewerScreen(files, YourParser, "Format Name")
```

## Running the Viewer

```bash
# Install dependencies
pip install -r requirements.txt

# Run with SmartWare files
python viewer.py *.ws

# Run with any supported format
python viewer.py file1.dbf file2.ws file3.wk1
```

## Format Parser Interface

All format parsers must implement:

- `get_metadata()` - Return format metadata
- `get_field_names()` - Return list of field names
- `parse()` - Parse the file and populate `self.records`
- `validate()` - (optional) Validate file format

The base class provides:
- Automatic extension validation
- Magic byte checking
- Common data structures
- Conversion utilities

## Benefits of Modular Architecture

1. **Easy to add new formats** - Just implement the parser interface
2. **Consistent UI** - All formats use the same widgets and layouts
3. **Code reuse** - Share parsing logic, widgets, and screens
4. **Maintainable** - Each format is self-contained
5. **Testable** - Parser modules can be tested independently
