#!/usr/bin/env python3
"""
Web server that provides HTTP health checks and Textual WebSocket TUI
"""

import os
import asyncio
from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException, Cookie
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path
from typing import Optional

from viewer import HistoricFormatViewer
from session_manager import session_manager

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active TUI instances
tui_instances = {}

# Max upload file size: 50MB
MAX_UPLOAD_SIZE = 50 * 1024 * 1024


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
    stats = session_manager.get_session_stats()
    return {
        "status": "ok",
        "service": "historic-format-viewer",
        **stats
    }


@app.post("/api/session/create")
async def create_session():
    """Create a new session"""
    session_id = session_manager.create_session()
    return JSONResponse({
        "session_id": session_id,
        "created_at": session_manager.get_session(session_id).created_at.isoformat()
    })


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    session_id: Optional[str] = Cookie(None)
):
    """Upload a file to the session"""
    if not session_id:
        raise HTTPException(status_code=400, detail="No session ID provided")

    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning

    if file_size > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_UPLOAD_SIZE // (1024*1024)}MB"
        )

    # Save file to session directory
    file_path = session.upload_dir / file.filename
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        session.add_file(file_path)

        return JSONResponse({
            "filename": file.filename,
            "size": file_size,
            "path": str(file_path)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/session/{session_id}/files")
async def get_session_files(session_id: str):
    """Get list of files in session"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    files = [
        {
            "name": f.name,
            "size": f.stat().st_size if f.exists() else 0,
            "path": str(f)
        }
        for f in session.files
    ]

    return JSONResponse({"files": files})


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


@app.on_event("startup")
async def startup_event():
    """Start background tasks on startup"""
    print("Starting session cleanup task...")
    session_manager.start_cleanup_task()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting web server with TUI on port {port}")
    print(f"Session cleanup: 30 minute inactivity timeout")
    print(f"Max upload size: {MAX_UPLOAD_SIZE // (1024*1024)}MB")
    uvicorn.run(app, host="0.0.0.0", port=port)
