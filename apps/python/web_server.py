#!/usr/bin/env python3
"""
Web server that provides HTTP health checks and Textual WebSocket TUI
"""

import os
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path

from viewer import HistoricFormatViewer

app = FastAPI()

# Store active TUI instances
tui_instances = {}


@app.get("/")
async def root():
    """Landing page with TUI access"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Historic File Format Viewer - TUI</title>
        <meta charset="utf-8">
        <style>
            body {
                font-family: monospace;
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
                color: #000;
            }
            h1 { border-bottom: 2px solid #000; }
            .status { color: green; font-weight: bold; }
            #terminal {
                width: 100%;
                height: 600px;
                border: 1px solid #000;
                background: #000;
                color: #0f0;
                font-family: 'Courier New', monospace;
                padding: 10px;
                overflow-y: auto;
            }
            button {
                background: #000;
                color: #fff;
                border: none;
                padding: 10px 20px;
                font-family: monospace;
                cursor: pointer;
                margin: 10px 0;
            }
            button:hover {
                background: #333;
            }
        </style>
    </head>
    <body>
        <h1>Historic File Format Viewer</h1>
        <p class="status">✓ Service is running</p>
        <p>Terminal User Interface for historic file format conversion.</p>

        <button onclick="connectTUI()">Launch TUI →</button>

        <div id="terminal"></div>

        <script>
            let ws = null;

            function connectTUI() {
                const term = document.getElementById('terminal');
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = protocol + '//' + window.location.host + '/ws';

                term.innerHTML = 'Connecting to TUI...\\n';

                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    term.innerHTML += 'Connected!\\nLoading TUI...\\n\\n';
                };

                ws.onmessage = (event) => {
                    term.innerHTML += event.data;
                    term.scrollTop = term.scrollHeight;
                };

                ws.onerror = (error) => {
                    term.innerHTML += '\\nError: Connection failed\\n';
                };

                ws.onclose = () => {
                    term.innerHTML += '\\n\\nConnection closed.\\n';
                };
            }
        </script>

        <p><small>Powered by Textual • Hosted on Render.com</small></p>
    </body>
    </html>
    """
    return HTMLResponse(content=html)


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "historic-format-viewer"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for TUI"""
    await websocket.accept()

    try:
        # Create TUI instance
        app_instance = HistoricFormatViewer([])

        # Send initial message
        await websocket.send_text("Historic File Format Viewer TUI\\n")
        await websocket.send_text("=" * 40 + "\\n\\n")
        await websocket.send_text("TUI interface coming soon!\\n")
        await websocket.send_text("For now, use the web interface at labs.teleports.cloud\\n")

        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Received: {data}\\n")

    except Exception as e:
        print(f"WebSocket error: {e}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting web server with TUI on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
