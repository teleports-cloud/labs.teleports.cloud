#!/usr/bin/env python3
"""
Historic File Format Viewer - Beautiful Terminal UI
Built with Textual for a modern, streamlined experience
Modular architecture supporting multiple file formats
"""

import sys
from pathlib import Path
from typing import List

from textual.app import App
from textual.widgets import Header, Footer, Static, Button, Label
from textual.containers import Vertical, Center
from textual.binding import Binding
from textual.screen import Screen
from textual.app import ComposeResult

from formats import SmartWareParser
from widgets.screens import BaseViewerScreen, BaseFormatsScreen


class HomeScreen(Screen):
    """Home screen with format information and navigation"""

    CSS = """
    HomeScreen {
        align: center middle;
        background: $surface;
    }

    .home-container {
        width: 80;
        height: auto;
        background: $panel;
        border: solid $accent;
        padding: 2;
    }

    .title {
        text-align: center;
        text-style: bold;
        color: $accent;
        margin-bottom: 1;
    }

    .menu-button {
        margin: 1;
        width: 100%;
    }

    .format-info {
        margin-top: 1;
        padding: 1;
        background: $surface;
        border: solid $primary;
    }
    """

    BINDINGS = [
        Binding("q", "quit", "Quit", show=True),
        Binding("escape", "quit", "Quit", show=False),
    ]

    def __init__(self, files: List[Path]):
        super().__init__()
        self.files = files

    def compose(self) -> ComposeResult:
        """Create home screen layout"""
        with Center():
            with Vertical(classes="home-container"):
                yield Label("🔬 Historic File Format Viewer", classes="title")
                yield Label("labs.teleports.cloud", classes="title")
                yield Static("")

                # Main menu buttons
                yield Button("📁 View Data Files", id="btn-view-files", variant="primary", classes="menu-button")
                yield Button("📋 Supported Formats", id="btn-formats", variant="default", classes="menu-button")
                yield Button("📤 Upload Files", id="btn-upload", variant="default", classes="menu-button")
                yield Button("ℹ️  About", id="btn-about", variant="default", classes="menu-button")
                yield Button("❌ Exit", id="btn-exit", variant="error", classes="menu-button")

                # Quick stats
                yield Static(f"\n📊 {len(self.files)} files loaded", classes="format-info")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button presses"""
        if event.button.id == "btn-view-files":
            self.app.push_screen("viewer")
        elif event.button.id == "btn-formats":
            self.app.push_screen("formats")
        elif event.button.id == "btn-upload":
            self.app.push_screen("upload")
        elif event.button.id == "btn-about":
            self.app.push_screen("about")
        elif event.button.id == "btn-exit":
            self.app.exit()


class UploadScreen(Screen):
    """Screen for file upload functionality"""

    CSS = """
    UploadScreen {
        background: $surface;
        align: center middle;
    }

    .upload-container {
        width: 70;
        height: auto;
        padding: 2;
        border: solid $accent;
        background: $panel;
    }

    .upload-button {
        margin: 1;
        width: 100%;
    }
    """

    BINDINGS = [
        Binding("escape", "back", "Back", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def compose(self) -> ComposeResult:
        """Create upload screen"""
        yield Header()

        with Center():
            with Vertical(classes="upload-container"):
                yield Label("[bold cyan]Upload Files[/bold cyan]\n")
                yield Static("""[yellow]Upload Options:[/yellow]

📄 Single File - Upload individual file
📁 Directory - Upload entire folder of files
📦 Archive - Upload .zip or .tar.gz archive

[dim]Note: In terminal mode, upload functionality requires
file system access. Use command-line arguments to load files:

  python viewer.py file1.ws file2.ws
  python viewer.py *.ws
  python viewer.py /path/to/directory/[/dim]
""")

                yield Button("📄 Select File", id="btn-upload-file", variant="primary", classes="upload-button")
                yield Button("📁 Select Directory", id="btn-upload-dir", variant="default", classes="upload-button")
                yield Button("📦 Upload Archive", id="btn-upload-archive", variant="default", classes="upload-button")
                yield Button("← Back", id="btn-back", variant="default", classes="upload-button")

        yield Footer()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button presses"""
        if event.button.id == "btn-back":
            self.app.pop_screen()
        elif event.button.id in ["btn-upload-file", "btn-upload-dir", "btn-upload-archive"]:
            # In terminal mode, show instructions
            self.notify("Use command-line arguments to load files: python viewer.py *.ws")

    def action_back(self) -> None:
        """Return to home screen"""
        self.app.pop_screen()


class AboutScreen(Screen):
    """About screen with project information"""

    CSS = """
    AboutScreen {
        background: $surface;
        align: center middle;
    }

    .about-container {
        width: 70;
        height: auto;
        padding: 2;
        border: solid $accent;
        background: $panel;
    }
    """

    BINDINGS = [
        Binding("escape", "back", "Back", show=True),
    ]

    def compose(self) -> ComposeResult:
        """Create about screen"""
        yield Header()

        with Center():
            with Vertical(classes="about-container"):
                yield Static("""[bold cyan]About Historic File Format Viewer[/bold cyan]

[bold]Project:[/bold] Historic File Format Recovery & Conversion
[bold]Version:[/bold] 2.0
[bold]Built with:[/bold] Python + Textual
[bold]Website:[/bold] labs.teleports.cloud

[bold yellow]Mission:[/bold]
Recover and convert data from historic file formats (1970s-2000s)
into modern, accessible formats.

[bold green]Features:[/bold]
• Modular format support
• Binary format reverse engineering
• Pattern-based data extraction
• Beautiful terminal user interface
• Export to modern formats (CSV, Excel)
• Web-based viewer

[bold]Supported Formats:[/bold]
• SmartWare II (.ws) - Database
• dBase III/IV (.dbf) - Database [Coming Soon]
• Lotus 1-2-3 (.wk1, .wk3) - Spreadsheet [Coming Soon]
• WordPerfect (.wpd) - Word Processor [Coming Soon]

[dim]Press ESC to return to home[/dim]
""")

        yield Footer()

    def action_back(self) -> None:
        """Return to home screen"""
        self.app.pop_screen()


class HistoricFormatViewer(App):
    """Historic File Format Viewer - Beautiful TUI with modular format support"""

    TITLE = "Historic File Format Viewer"

    def __init__(self, files: List[Path]):
        super().__init__()
        self.files = files

        # Install screens
        self.install_screen(HomeScreen(files), name="home")

        # Create viewer screen with SmartWare parser
        viewer = BaseViewerScreen(files, SmartWareParser, "SmartWare II")
        self.install_screen(viewer, name="viewer")

        # Format information
        format_info = """[bold cyan]Supported File Formats[/bold cyan]

[bold]SmartWare II Database Files (.ws)[/bold]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Magic Bytes: 0x53 0x04
Era: 1980s-1990s DOS/Windows software
Application: SmartWare II integrated office suite

[bold yellow]Data Extraction Method:[/bold yellow]
• Binary format reverse-engineered
• Pattern matching for dates (YYYY/MM/DD)
• Field ID extraction
• IEEE 754 double precision number extraction
• Proximity-based field grouping

[bold]Future Format Support:[/bold]
• dBase III/IV (.dbf) - Database files
• Lotus 1-2-3 (.wk1, .wk3, .wks) - Spreadsheets
• WordPerfect (.wpd) - Word processor documents
• VisiCalc (.vc) - Early spreadsheets
• AppleWorks (.cwk) - Productivity files

[dim]Press ESC to return to home[/dim]
"""
        self.install_screen(BaseFormatsScreen(format_info), name="formats")
        self.install_screen(UploadScreen(), name="upload")
        self.install_screen(AboutScreen(), name="about")

    def on_mount(self) -> None:
        """Start with home screen"""
        self.push_screen("home")


def main():
    """Entry point"""
    # Collect files from command line arguments
    files = []

    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            path = Path(arg)
            if path.exists() and path.is_file():
                files.append(path)

    # Launch TUI (even with empty file list - user can upload via interface)
    app = HistoricFormatViewer(files)
    app.run()


if __name__ == "__main__":
    main()
