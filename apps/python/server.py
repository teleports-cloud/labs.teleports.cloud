#!/usr/bin/env python3
"""
Combined HTTP + Textual WebSocket server for Render deployment
"""

import os
import sys
import subprocess

# Simple wrapper: Run textual serve as a subprocess
# This ensures it properly binds to the port

if __name__ == "__main__":
    port = os.environ.get('PORT', '10000')

    # Run textual serve with our viewer
    cmd = [
        sys.executable, '-m', 'textual', 'serve',
        'viewer.py',
        '--host', '0.0.0.0',
        '--port', port
    ]

    print(f"Starting Textual web server on port {port}")
    print(f"Command: {' '.join(cmd)}")

    # Run the command
    subprocess.run(cmd)
