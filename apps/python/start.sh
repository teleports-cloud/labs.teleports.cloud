#!/bin/bash
# Start the Textual TUI web server

cd "$(dirname "$0")"

# Install dependencies
pip install -r requirements.txt

# Run Textual in web mode
textual serve viewer.py --host 0.0.0.0 --port ${PORT:-8000}
