"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const HISTORIC_FORMATS = [
  { name: "SmartWare II", ext: ".ws", category: "Database", era: "1980s-1990s" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFormats = HISTORIC_FORMATS.filter(
    (format) =>
      format.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format.ext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Basic detection based on extension
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const detected = HISTORIC_FORMATS.find(f => f.ext.includes(ext));
      setDetectedFormat(detected ? detected.name : "Unknown format");
    }
  };

  return (
    <div className="terminal min-h-screen flex flex-col">
      {/* Header */}
      <header className="terminal-header py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Historic File Format Converter</h1>
          <p className="text-sm opacity-70">labs.teleports.cloud</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="terminal-panel p-8 mb-6">
            <h2 className="text-3xl font-bold mb-4">
              Recover Data from Historic File Formats
            </h2>
            <p className="text-lg mb-6 opacity-80">
              Convert legacy database, spreadsheet, and word processing files from the 1970s-2000s into modern formats.
              Upload a file for automatic detection or browse supported formats below.
            </p>

            {/* File Upload Section */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-4xl mb-3">📁</div>
                <div className="font-semibold mb-1">
                  {selectedFile ? selectedFile.name : "Drop a file here or click to browse"}
                </div>
                <div className="text-sm opacity-60">
                  {detectedFormat ? `Detected: ${detectedFormat}` : "Automatic format detection enabled"}
                </div>
              </label>

              {selectedFile && (
                <div className="mt-4">
                  <Link
                    href="/upload"
                    className="terminal-button-primary py-3 px-6 rounded inline-block font-semibold"
                  >
                    Convert File →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search formats by name, extension, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="terminal-input w-full py-3 px-4 rounded text-base"
            />
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredFormats.map((format, idx) => (
              <Link
                key={idx}
                href={`/formats/${format.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="terminal-panel p-6 hover:shadow-md transition-shadow"
              >
                <div className="font-bold text-lg mb-2">{format.name}</div>
                <div className="text-sm opacity-60 mb-1">{format.ext}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded">{format.category}</span>
                  <span className="text-xs opacity-50">{format.era}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredFormats.length === 0 && (
            <div className="terminal-panel p-8 text-center">
              <p className="opacity-60">No formats found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-300">
        <div className="max-w-6xl mx-auto text-center text-sm opacity-60">
          <p>Historic File Format Recovery & Conversion</p>
          <p className="text-xs mt-1">Binary Format Reverse Engineering</p>
        </div>
      </footer>
    </div>
  );
}
