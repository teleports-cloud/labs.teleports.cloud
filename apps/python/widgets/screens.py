"""Reusable screen components"""

from typing import List, Dict, Type
from pathlib import Path
from textual.screen import Screen
from textual.widgets import Header, Footer, DataTable, TabbedContent, TabPane, Static, Button, Label
from textual.containers import Container, Vertical
from textual.binding import Binding
from textual.reactive import reactive
from textual.app import ComposeResult

from ..formats.base import BaseFormatParser
from .panels import StatsPanel, InfoPanel, FileListPanel


class BaseViewerScreen(Screen):
    """Base viewer screen that works with any format parser"""

    CSS = """
    BaseViewerScreen {
        background: $surface;
    }

    DataTable {
        height: 1fr;
        border: solid $accent;
    }

    StatsPanel {
        height: 1fr;
        border: solid $accent;
        padding: 1;
    }

    InfoPanel {
        height: 1fr;
        border: solid $accent;
        padding: 1;
    }

    .main-content {
        height: 1fr;
    }
    """

    BINDINGS = [
        Binding("escape", "back", "Back", show=True),
        Binding("q", "quit", "Quit", show=True),
        Binding("r", "refresh", "Refresh", show=True),
        Binding("1,2,3,4,5,6,7,8,9", "select_file", "Select File", show=False),
    ]

    current_file_index = reactive(0)

    def __init__(self, files: List[Path], parser_class: Type[BaseFormatParser], format_name: str = "Data"):
        super().__init__()
        self.files = files
        self.parser_class = parser_class
        self.format_name = format_name
        self.parsers = {}
        self.current_parser = None

    def compose(self) -> ComposeResult:
        """Create viewer widgets"""
        yield Header()

        with Container():
            # File list sidebar
            yield FileListPanel(self.files)

            # Main content area
            with Vertical(classes="main-content"):
                with TabbedContent():
                    with TabPane("Data", id="tab-data"):
                        yield DataTable(id="data-table")

                    with TabPane("Statistics", id="tab-stats"):
                        yield StatsPanel(id="stats-panel")

                    with TabPane("Info", id="tab-info"):
                        yield InfoPanel(id="info-panel")

        yield Footer()

    def on_mount(self) -> None:
        """Initialize the viewer"""
        # Load first file
        if self.files:
            self.load_file(0)

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle file selection buttons"""
        if event.button.id and event.button.id.startswith("file-"):
            file_num = int(event.button.id.split("-")[1])
            self.load_file(file_num - 1)

    def load_file(self, index: int) -> None:
        """Load and parse a file"""
        if not (0 <= index < len(self.files)):
            return

        file = self.files[index]
        self.current_file_index = index

        # Parse if not cached
        if file not in self.parsers:
            parser = self.parser_class(file)
            parser.parse()
            self.parsers[file] = parser

        self.current_parser = self.parsers[file]
        self.update_displays()

    def update_displays(self) -> None:
        """Update all display widgets with current data"""
        if not self.current_parser:
            return

        records = self.current_parser.records
        metadata = self.current_parser.extraction_metadata

        # Update data table
        table = self.query_one("#data-table", DataTable)
        table.clear(columns=True)

        if records:
            # Add columns
            headers = self.current_parser.get_field_names()
            for header in headers:
                table.add_column(header, key=header)

            # Add rows (first 100 for performance)
            for record in records[:100]:
                row = [str(record.get(h, '')) if record.get(h) is not None else '-'
                       for h in headers]
                table.add_row(*row)

        # Update stats
        stats_panel = self.query_one("#stats-panel", StatsPanel)
        stats_panel.update_stats(records, metadata, self.format_name)

        # Update info
        info_panel = self.query_one("#info-panel", InfoPanel)
        info_panel.update_info(self.current_parser, self.format_name)

    def action_refresh(self) -> None:
        """Refresh current file"""
        # Clear cache and reload
        if self.current_parser:
            file = self.files[self.current_file_index]
            if file in self.parsers:
                del self.parsers[file]
            self.load_file(self.current_file_index)

    def action_select_file(self, key: str) -> None:
        """Select file by number key"""
        try:
            file_num = int(key) - 1
            self.load_file(file_num)
        except (ValueError, IndexError):
            pass

    def action_back(self) -> None:
        """Return to home screen"""
        self.app.pop_screen()


class BaseFormatsScreen(Screen):
    """Base formats information screen"""

    CSS = """
    BaseFormatsScreen {
        background: $surface;
    }

    .formats-container {
        padding: 2;
        overflow-y: auto;
        height: 100%;
    }

    .format-section {
        margin: 1;
        padding: 1;
        border: solid $primary;
        background: $panel;
    }
    """

    BINDINGS = [
        Binding("escape", "back", "Back", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self, format_info: str):
        super().__init__()
        self.format_info = format_info

    def compose(self) -> ComposeResult:
        """Create formats screen"""
        yield Header()
        yield Static(self.format_info, classes="format-section")
        yield Footer()

    def action_back(self) -> None:
        """Return to home screen"""
        self.app.pop_screen()
