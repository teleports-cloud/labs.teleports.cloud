#!/bin/bash
# SmartWare Data Viewer - Beautiful Terminal UI
# Built with Textual for a modern, streamlined experience

cd "$(dirname "$0")"

echo "🚀 SmartWare Data Viewer"
echo "========================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 is not installed"
    exit 1
fi

# Check if Textual library is installed
if ! python3 -c "import textual" 2>/dev/null; then
    echo "📦 Installing Textual UI library..."
    pip3 install textual openpyxl
    echo ""
fi

# Find .ws files
WS_FILES=$(find . -maxdepth 1 -name "*.ws" -type f)
if [ -z "$WS_FILES" ]; then
    echo "⚠️  No .ws files found"
    echo "Please run from the project root where .ws files are located"
    exit 1
fi

echo "📂 Found $(echo "$WS_FILES" | wc -l | tr -d ' ') SmartWare II file(s)"
echo ""

# Launch beautiful TUI
python3 apps/python/smartware_viewer.py *.ws

echo ""
echo "✅ Viewer closed"
