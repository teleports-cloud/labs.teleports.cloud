"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import config, { getCreateSessionUrl, getUploadUrl } from "../config";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null); // New state for errors
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null); // Clear previous errors

    try {
      // Create session
      const sessionResponse = await fetch(getCreateSessionUrl(), {
        method: "POST",
      });
      if (!sessionResponse.ok) {
        throw new Error(`Failed to create session: ${sessionResponse.statusText}`);
      }
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.session_id;

      // Set session cookie
      document.cookie = `session_id=${sessionId}; path=/`;

      // Store files in localStorage to be picked up by the terminal page
      const fileData = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      localStorage.setItem('pendingUploadFiles', JSON.stringify(fileData));
      localStorage.setItem('sessionIdForUpload', sessionId);

      // Store the actual File objects (FileList) on the window object temporarily
      // This is a workaround for passing FileList across pages via localStorage, which only accepts serializable data.
      (window as any).pendingUploadFilesRaw = files;


      // Navigate to terminal immediately
      router.push("/terminal");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error instanceof Error ? error.message : "An unknown error occurred during upload.");
    } finally {
      setIsUploading(false); // Ensure isUploading is reset even on error
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative"> {/* Added relative positioning */}
      {/* Build Status Badges */}
      <div className="absolute top-4 right-4 flex gap-2 z-10"> {/* Positioning badges */}
        {/* Frontend Build Status Badge */}
        <a href="https://github.com/teleports-cloud/labs.teleports.cloud/actions/workflows/build-frontend.yml" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/github/actions/workflow/status/teleports-cloud/labs.teleports.cloud/build-frontend.yml?label=frontend%20build&logo=github&style=for-the-badge" alt="Frontend Build Status" className="h-6" />
        </a>
        {/* Backend Build Status Badge */}
        <a href="https://github.com/teleports-cloud/labs.teleports.cloud/actions/workflows/build-backend.yml" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/github/actions/workflow/status/teleports-cloud/labs.teleports.cloud/build-backend.yml?label=backend%20build&logo=github&style=for-the-badge" alt="Backend Build Status" className="h-6" />
        </a>
        {/* Mirror Sync Status Badge (Optional, using mirror.yml status) */}
        <a href="https://github.com/teleports-cloud/labs.teleports.cloud/actions/workflows/mirror.yml" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/github/actions/workflow/status/teleports-cloud/labs.teleports.cloud/mirror.yml?label=mirror%20sync&logo=github&style=for-the-badge" alt="Mirror Sync Status" className="h-6" />
        </a>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-3xl w-full text-center">
          {/* Hero graphic */}
          <div className="mb-6">
            <Image
              src="/hero.svg"
              alt="Vintage computer with Indiana Jones hat and whip"
              width={450}
              height={180}
              className="mx-auto w-full max-w-md"
              priority
            />
          </div>

          {/* Indiana Jones quote */}
          <p className="text-xl md:text-2xl font-serif italic text-gray-700 mb-2">
            "It belongs in a museum!"
          </p>

          {/* Attribution */}
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-10">
            Digital archaeology by teleports.cloud labs
          </p>

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              block mx-auto px-16 py-20
              bg-white border-4 border-black rounded-xl
              cursor-pointer transition-all
              hover:bg-gray-50 hover:border-gray-700 hover:shadow-2xl
              ${isDragging ? "bg-gray-100 border-gray-600 scale-[1.02] shadow-2xl" : "shadow-lg"}
              ${isUploading ? "opacity-50 cursor-wait" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-6">
              <svg
                className="w-20 h-20 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-3xl font-bold text-black mb-3">
                  {isUploading ? "Uploading..." : "Drop Files Here"}
                </p>
                <p className="text-lg text-gray-600 mb-2">
                  or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Convert legacy files to modern formats • Max 50MB
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Supported Formats Footer */}
      <div className="border-t border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
            Supported Formats
          </p>
          <p className="text-sm font-mono text-gray-600">
            {SUPPORTED_FORMATS.map((format, idx) => (
              <span key={idx}>
                {format.name} ({format.ext}) · {format.era}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
