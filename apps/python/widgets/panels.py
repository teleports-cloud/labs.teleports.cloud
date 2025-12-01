"""Reusable panel widgets"""

from typing import List, Dict, Any
from textual.widgets import Static, Button, Label
from textual.containers import Vertical
from rich.table import Table as RichTable
from rich.panel import Panel


class StatsPanel(Static):
    """Reusable statistics display panel"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stats = {}

    def update_stats(self, records: List[Dict], metadata: Dict, format_name: str = "Data"):
        """Update statistics from records"""
        if not records:
            self.update(f"No {format_name} loaded")
            return

        # Calculate basic stats
        dates = [r.get('Date') for r in records if r.get('Date')]
        unique_keys = {}

        # Find all unique values for first few columns
        if records:
            for key in list(records[0].keys())[:5]:
                unique_vals = set(r.get(key) for r in records if r.get(key) is not None)
                if len(unique_vals) < len(records):  # Only track if not all unique
                    unique_keys[key] = len(unique_vals)

        table = RichTable(title=f"{format_name} Statistics", show_header=True, header_style="bold cyan")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", justify="right", style="green")

        table.add_row("Total Records", str(len(records)))

        if dates:
            table.add_row("Date Range", f"{dates[0]} to {dates[-1]}")

        # Add metadata
        for key, value in metadata.items():
            if key not in ['filename', 'records']:
                display_key = key.replace('_', ' ').title()
                table.add_row(display_key, str(value))

        # Add unique counts
        for key, count in unique_keys.items():
            table.add_row(f"Unique {key}s", str(count))

        # Calculate numeric column averages
        numeric_cols = [k for k, v in records[0].items()
                       if isinstance(v, (int, float)) and v is not None]

        for col in numeric_cols[:3]:  # First 3 numeric columns
            values = [r[col] for r in records if isinstance(r.get(col), (int, float))]
            if values:
                avg = sum(values) / len(values)
                table.add_row(f"{col} (avg)", f"{avg:.2f}")

        self.update(table)


class InfoPanel(Static):
    """Reusable information display panel"""

    def update_info(self, parser, format_name: str):
        """Update info panel with parser details"""
        metadata = parser.extraction_metadata

        info_text = f"""[bold]{format_name} File Information[/bold]

📄 File: {parser.filename}
📊 Records: {len(parser.records)}
"""

        # Add format-specific metadata
        for key, value in metadata.items():
            if key != 'filename':
                display_key = key.replace('_', ' ').title()
                icon = "📍" if 'found' in key else "🔢"
                info_text += f"{icon} {display_key}: {value}\n"

        # Add format description
        format_meta = parser.get_metadata()
        info_text += f"\n[dim]{format_meta.description}\n"
        info_text += f"Era: {format_meta.era}\n"
        info_text += f"Category: {format_meta.category}[/dim]"

        self.update(info_text)


class FileListPanel(Vertical):
    """Reusable file list sidebar panel"""

    DEFAULT_CSS = """
    FileListPanel {
        dock: left;
        width: 30;
        background: $panel;
        border-right: solid $accent;
        padding: 1;
    }

    FileListPanel Button {
        margin: 1;
    }

    FileListPanel Button:hover {
        background: $accent;
    }
    """

    def __init__(self, files: List, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.files = files

    def compose(self):
        """Render file list"""
        yield Label("📁 Files", id="files-header")
        for i, file in enumerate(self.files, 1):
            file_name = file.name if hasattr(file, 'name') else str(file)
            yield Button(f"{i}. {file_name}", id=f"file-{i}", variant="default")
