import os
import asyncio
from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException, Cookie
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from textual_serve.server import Server as TextualServer
import uvicorn
from pathlib import Path
from typing import Optional

from viewer import HistoricFormatViewer
from session_manager import session_manager

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://labs.teleports.cloud"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active TUI instances
tui_instances = {}

# Max upload file size: 50MB
MAX_UPLOAD_SIZE = 50 * 1024 * 1024

# Create a Textual app instance
textual_app = HistoricFormatViewer([])

# Create Textual server instance
# We'll mount this as a sub-application in FastAPI
textual_server = TextualServer(textual_app)

# Mount the Textual server at /tui
app.mount("/tui", textual_server.asgi_app)

@app.get("/")
async def root():
    """Redirects to the Textual TUI client."""
    return RedirectResponse(url="/tui")


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
    session_id: str = Header(...)
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


# Removed the previous /ws WebSocket endpoint as textual_serve will manage its own.
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     """WebSocket endpoint for TUI"""
#     await websocket.accept()
#     # ... (logic for handling simple text messages, now handled by textual_serve)


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
