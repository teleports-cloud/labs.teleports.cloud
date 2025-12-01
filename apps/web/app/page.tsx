"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Create session first
      const sessionResponse = await fetch("https://labs-teleports-cloud.onrender.com/api/session/create", {
        method: "POST",
      });
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.session_id;

      // Set session cookie
      document.cookie = `session_id=${sessionId}; path=/`;

      // Upload files
      for (const file of Array.from(files)) {
        if (file.size > 50 * 1024 * 1024) {
          console.error(`File ${file.name} exceeds 50MB limit`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        await fetch("https://labs-teleports-cloud.onrender.com/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      // Navigate to terminal
      router.push("/terminal");
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-4xl w-full text-center">
          {/* Hero graphic */}
          <div className="mb-4">
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
          <p className="text-lg md:text-xl font-serif italic text-gray-700 mb-1">
            "It belongs in a museum!"
          </p>

          {/* Attribution */}
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
            Digital archaeology by teleports.cloud labs
          </p>

          {/* Logo/Title */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black mb-4">
            Labs
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
            Rescue data trapped in obsolete file formats.
            <br className="hidden md:block" />
            Convert legacy files from the 1970s–2000s into modern formats.
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
              block max-w-2xl mx-auto px-12 py-16
              bg-white border-4 border-black rounded-lg
              cursor-pointer transition-all
              hover:bg-gray-50 hover:border-gray-800
              ${isDragging ? "bg-gray-100 border-gray-600 scale-105" : ""}
              ${isUploading ? "opacity-50 cursor-wait" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16"
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
                <p className="text-2xl font-bold text-black mb-2">
                  {isUploading ? "Uploading..." : "Upload Files"}
                </p>
                <p className="text-gray-600">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Maximum 50MB per file
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
