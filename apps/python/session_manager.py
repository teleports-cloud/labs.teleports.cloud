"""
Session management for Historic Format Viewer
Handles user sessions, file uploads, and automatic cleanup
"""

import os
import uuid
import time
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path
import shutil

class Session:
    """Represents a user session"""

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.files: List[Path] = []
        self.upload_dir = Path(f"/tmp/labs-sessions/{session_id}")
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def update_activity(self):
        """Update last activity timestamp"""
        self.last_activity = datetime.now()

    def add_file(self, file_path: Path):
        """Track an uploaded file"""
        self.files.append(file_path)
        self.update_activity()

    def is_inactive(self, timeout_minutes: int = 30) -> bool:
        """Check if session has been inactive for timeout period"""
        timeout = timedelta(minutes=timeout_minutes)
        return datetime.now() - self.last_activity > timeout

    def cleanup(self):
        """Clean up session files and directory"""
        try:
            if self.upload_dir.exists():
                shutil.rmtree(self.upload_dir)
            print(f"Session {self.session_id} cleaned up")
        except Exception as e:
            print(f"Error cleaning up session {self.session_id}: {e}")


class SessionManager:
    """Manages all user sessions"""

    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self.cleanup_task = None

    def create_session(self) -> str:
        """Create a new session and return session ID"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = Session(session_id)
        print(f"Created session: {session_id}")
        return session_id

    def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        session = self.sessions.get(session_id)
        if session:
            session.update_activity()
        return session

    def remove_session(self, session_id: str):
        """Remove and cleanup a session"""
        session = self.sessions.pop(session_id, None)
        if session:
            session.cleanup()

    async def cleanup_inactive_sessions(self):
        """Background task to cleanup inactive sessions"""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute

                inactive_sessions = [
                    sid for sid, session in self.sessions.items()
                    if session.is_inactive(timeout_minutes=30)
                ]

                for session_id in inactive_sessions:
                    print(f"Cleaning up inactive session: {session_id}")
                    self.remove_session(session_id)

            except Exception as e:
                print(f"Error in cleanup task: {e}")

    def start_cleanup_task(self):
        """Start the background cleanup task"""
        if not self.cleanup_task:
            self.cleanup_task = asyncio.create_task(self.cleanup_inactive_sessions())

    def get_session_stats(self) -> dict:
        """Get statistics about active sessions"""
        return {
            "active_sessions": len(self.sessions),
            "total_files": sum(len(s.files) for s in self.sessions.values())
        }


# Global session manager instance
session_manager = SessionManager()
