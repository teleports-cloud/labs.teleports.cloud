"use client";

import { useEffect, useState, useRef } from "react";

interface FileItem {
  name: string;
  size: number;
  path: string;
}

interface OperationProgress {
  id: string;
  type: "upload" | "processing" | "converting";
  fileName: string;
  progress: number;
  status: string;
}

export default function TerminalPage() {
  const [inputFiles, setInputFiles] = useState<FileItem[]>([]);
  const [outputFiles, setOutputFiles] = useState<FileItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [operations, setOperations] = useState<OperationProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if session exists from landing page upload
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(c => c.startsWith('session_id='));

    if (sessionCookie) {
      const existingSessionId = sessionCookie.split('=')[1];
      setSessionId(existingSessionId);
      // Start syncing files immediately
      refreshFiles(existingSessionId);
      startFileSync(existingSessionId);
    } else {
      // Create new session if none exists
      createSession();
    }

    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      const now = new Date();
      const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

      // Show warning at 28 minutes (2 minutes before cleanup)
      if (minutesSinceActivity >= 28 && !showInactivityWarning) {
        setShowInactivityWarning(true);
      }
    }, 60000);

    return () => {
      clearInterval(inactivityCheck);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [lastActivity, showInactivityWarning]);

  function startFileSync(sessionId: string) {
    // Sync files every 2 seconds for real-time updates
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      refreshFiles(sessionId);
    }, 2000);
  }

  async function createSession() {
    try {
      const response = await fetch("https://labs-teleports-cloud.onrender.com/api/session/create", {
        method: "POST",
      });
      const data = await response.json();
      const newSessionId = data.session_id;
      setSessionId(newSessionId);
      document.cookie = `session_id=${newSessionId}; path=/`;
      setLastActivity(new Date());
      startFileSync(newSessionId);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  }

  async function refreshFiles(sid?: string) {
    const currentSessionId = sid || sessionId;
    if (!currentSessionId) return;
    try {
      const response = await fetch(
        `https://labs-teleports-cloud.onrender.com/api/session/${currentSessionId}/files`
      );
      const data = await response.json();
      const files = data.files || [];
      setInputFiles(files.filter((f: FileItem) => !f.name.includes('_converted')));
      setOutputFiles(files.filter((f: FileItem) => f.name.includes('_converted')));
      setLastActivity(new Date());
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0 || !sessionId) return;

    setIsUploading(true);
    setUploadError("");

    try {
      for (const file of Array.from(files)) {
        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
          setUploadError(`File ${file.name} exceeds 50MB limit`);
          continue;
        }

        // Add operation to progress list
        const operationId = `upload-${Date.now()}-${file.name}`;
        setOperations(prev => [...prev, {
          id: operationId,
          type: "upload",
          fileName: file.name,
          progress: 0,
          status: "Uploading..."
        }]);

        const formData = new FormData();
        formData.append("file", file);

        // Update progress to 50% while uploading
        setOperations(prev => prev.map(op =>
          op.id === operationId ? { ...op, progress: 50 } : op
        ));

        const response = await fetch("https://labs-teleports-cloud.onrender.com/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          setOperations(prev => prev.map(op =>
            op.id === operationId ? { ...op, progress: 100, status: "Failed" } : op
          ));
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        // Mark complete
        setOperations(prev => prev.map(op =>
          op.id === operationId ? { ...op, progress: 100, status: "Complete" } : op
        ));

        // Remove from list after 3 seconds
        setTimeout(() => {
          setOperations(prev => prev.filter(op => op.id !== operationId));
        }, 3000);
      }

      setLastActivity(new Date());
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function dismissInactivityWarning() {
    setShowInactivityWarning(false);
    setLastActivity(new Date());
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Inactivity Warning Modal */}
      {showInactivityWarning && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-yellow-500 p-6 rounded-lg max-w-md">
            <h3 className="text-yellow-500 font-bold text-lg mb-2">⚠️ Session Expiring Soon</h3>
            <p className="text-white mb-4">
              Your session will be cleaned up in 2 minutes due to inactivity.
              Click continue to extend your session.
            </p>
            <button
              onClick={dismissInactivityWarning}
              className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400"
            >
              Continue Session
            </button>
          </div>
        </div>
      )}

      {/* File Browser Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-mono text-sm font-bold mb-3">Files</h2>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="block w-full bg-blue-600 text-white text-center px-3 py-2 rounded text-xs font-medium hover:bg-blue-500 cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </label>

          {/* Upload Error */}
          {uploadError && (
            <p className="text-red-400 text-xs mt-2">{uploadError}</p>
          )}

          {/* Session Info */}
          {sessionId && (
            <p className="text-gray-500 text-xs mt-2 truncate" title={sessionId}>
              Session: {sessionId.slice(0, 8)}...
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Operations Progress Section */}
          {operations.length > 0 && (
            <div className="p-3 border-b border-gray-800">
              <h3 className="text-yellow-400 font-mono text-xs uppercase mb-2">Operations</h3>
              <div className="space-y-2">
                {operations.map((op) => (
                  <div
                    key={op.id}
                    className="text-white font-mono text-xs p-2 bg-gray-800 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="truncate flex-1">{op.fileName}</div>
                      <div className="text-gray-400 text-xs ml-2">
                        {op.progress}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{op.status}</div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          op.status === "Failed" ? "bg-red-500" :
                          op.status === "Complete" ? "bg-green-500" :
                          "bg-yellow-400"
                        }`}
                        style={{ width: `${op.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Files Section */}
          <div className="p-3">
            <h3 className="text-gray-400 font-mono text-xs uppercase mb-2">Input</h3>
            {inputFiles.length === 0 ? (
              <p className="text-gray-500 font-mono text-xs">No files yet</p>
            ) : (
              <div className="space-y-1">
                {inputFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="text-white font-mono text-xs p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="truncate">{file.name}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Output Files Section */}
          <div className="p-3 border-t border-gray-800">
            <h3 className="text-gray-400 font-mono text-xs uppercase mb-2">Output</h3>
            {outputFiles.length === 0 ? (
              <p className="text-gray-500 font-mono text-xs">No output files</p>
            ) : (
              <div className="space-y-1">
                {outputFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="text-white font-mono text-xs p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="truncate">{file.name}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TUI Main Pane */}
      <div className="flex-1">
        <iframe
          src="https://labs-teleports-cloud.onrender.com"
          className="w-full h-full border-0"
          title="Historic Format Viewer TUI"
        />
      </div>
    </div>
  );
}
