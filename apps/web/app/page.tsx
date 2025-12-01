"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center">
          {/* Logo/Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            labs.teleports.cloud
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-6 opacity-60">
            Historic File Format Recovery
          </p>

          {/* Description */}
          <p className="text-base md:text-lg mb-12 opacity-50 max-w-2xl mx-auto leading-relaxed">
            Recover and convert data from legacy file formats into modern, accessible formats.
            Upload historic database, spreadsheet, and word processing files from the 1970s-2000s
            for automatic conversion and data extraction.
          </p>

          {/* Terminal button */}
          <Link
            href="/formats"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Open Terminal
            <span className="inline-block w-3 h-5 bg-white" style={{ opacity: showCursor ? 1 : 0 }}></span>
          </Link>
        </div>
      </div>

      {/* Supported Formats Footer */}
      <div className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xs uppercase tracking-wider opacity-40 mb-4 text-center">
            Currently Supported Formats
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {SUPPORTED_FORMATS.map((format, idx) => (
              <div key={idx} className="text-center">
                <div className="font-semibold text-sm">{format.name}</div>
                <div className="text-xs opacity-50">{format.ext}</div>
                <div className="text-xs opacity-40">{format.era}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
