# Project Architecture

## Modular Design

The Historic File Format Viewer uses a **modular, extensible architecture** where each file format is a self-contained module with consistent, reusable widgets and layouts.

## Directory Structure

```
apps/python/
│
├── formats/                    # Format Parser Modules
│   ├── __init__.py            # Module exports
│   ├── base.py                # Base parser interface & metadata
│   ├── smartware.py           # SmartWare II parser (1980s-1990s)
│   └── dbase.py               # dBase III/IV parser (example/template)
│
├── widgets/                    # Reusable UI Components
│   ├── __init__.py            # Widget exports
│   ├── panels.py              # Shared panels (Stats, Info, FileList)
│   └── screens.py             # Shared screens (Viewer, Formats)
│
├── viewer.py                   # Main TUI application (NEW)
├── smartware_viewer.py         # Legacy viewer (DEPRECATED)
├── requirements.txt            # Dependencies
├── README.md                   # Usage guide
└── ARCHITECTURE.md             # This file
```

## Core Components

### 1. Format Parsers (`formats/`)

Each format is a module that extends `BaseFormatParser`:

```python
class SmartWareParser(BaseFormatParser):
    @classmethod
    def get_metadata(cls) -> FormatMetadata:
        """Return format metadata"""

    def get_field_names(self) -> List[str]:
        """Return extracted field names"""

    def parse(self) -> Dict[str, Any]:
        """Parse file and extract records"""
```

**Benefits:**
- Self-contained format logic
- Easy to add new formats
- Consistent interface
- Format validation built-in

### 2. Shared Widgets (`widgets/`)

Reusable UI components that work with any format:

#### Panels (`widgets/panels.py`)
- **StatsPanel** - Statistics display
- **InfoPanel** - Format information
- **FileListPanel** - File navigation sidebar

#### Screens (`widgets/screens.py`)
- **BaseViewerScreen** - Data viewer (works with any parser)
- **BaseFormatsScreen** - Format documentation

**Benefits:**
- Consistent UI across all formats
- Shared layout and styling
- Reduced code duplication
- Easy to update all formats at once

### 3. Main Application (`viewer.py`)

Orchestrates screens and formats:

```python
# Create viewer for SmartWare files
viewer = BaseViewerScreen(files, SmartWareParser, "SmartWare II")

# Create viewer for dBase files
dbase_viewer = BaseViewerScreen(files, DBaseParser, "dBase")
```

**Benefits:**
- Simple format registration
- Shared navigation
- Modular screen management

## Adding a New Format

### Step 1: Create Parser

Create `formats/yourformat.py`:

```python
from .base import BaseFormatParser, FormatMetadata

class YourFormatParser(BaseFormatParser):
    @classmethod
    def get_metadata(cls) -> FormatMetadata:
        return FormatMetadata(
            name="Your Format",
            extensions=[".ext"],
            era="1980s",
            category="Database",
            description="Description",
            magic_bytes=b'\x...',
        )

    def get_field_names(self) -> List[str]:
        return ["Field1", "Field2", ...]

    def parse(self) -> Dict[str, Any]:
        # Your parsing logic
        self.records = [...]
        self.extraction_metadata = {...}
        return {'records': self.records, 'metadata': self.extraction_metadata}
```

### Step 2: Register Format

Update `formats/__init__.py`:

```python
from .yourformat import YourFormatParser

__all__ = [..., "YourFormatParser"]
```

### Step 3: Add to Viewer

Update `viewer.py`:

```python
from formats import YourFormatParser

# In app initialization:
viewer = BaseViewerScreen(files, YourFormatParser, "Your Format")
self.install_screen(viewer, name="your-format-viewer")
```

**That's it!** The format automatically gets:
- Data table view
- Statistics panel
- Info panel
- File navigation
- Export capabilities
- Consistent styling

## Reusable Components

### Widgets are Format-Agnostic

All widgets work with any format parser:

```python
# Statistics work with any format
stats_panel.update_stats(records, metadata, "Any Format")

# Info panel adapts to format
info_panel.update_info(parser, "Any Format")

# File list works with any files
FileListPanel(files)

# Viewer works with any parser
BaseViewerScreen(files, AnyParser, "Any Format")
```

### Consistent Layout

All formats share the same layout:
- Header bar
- File list sidebar (left)
- Tabbed content (Data, Statistics, Info)
- Footer with keyboard shortcuts

### Keyboard Bindings

Consistent across all formats:
- `ESC` - Back to home
- `Q` - Quit
- `R` - Refresh
- `1-9` - Select file by number

## Benefits Summary

✅ **Easy to extend** - Add new formats by implementing one class
✅ **Consistent UI** - All formats look and behave the same
✅ **Code reuse** - Shared widgets and screens
✅ **Maintainable** - Format logic is isolated
✅ **Testable** - Each format can be tested independently
✅ **Scalable** - Add unlimited formats without code duplication

## Migration from Legacy Code

**Old Structure** (smartware_viewer.py):
- Everything in one file
- Format-specific widgets
- Hardcoded for SmartWare only
- ~650 lines

**New Structure** (modular):
- Format modules: ~120 lines each
- Shared widgets: ~150 lines
- Base interfaces: ~80 lines
- Main app: ~250 lines
- **Supports multiple formats with less total code**

## Future Formats

Planned format modules:
- Lotus 1-2-3 (.wk1, .wk3, .wks)
- WordPerfect (.wpd)
- VisiCalc (.vc)
- AppleWorks (.cwk)
- Harvard Graphics (.ch3)

Each will be a ~100-200 line module that plugs into the existing architecture!
