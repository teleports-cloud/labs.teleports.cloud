"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s", icon: "💾" },
];

const VintageComputerGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-96 h-auto mx-auto mb-8" fill="none" stroke="black" strokeWidth="2.5">
    {/* Fedora hat */}
    <ellipse cx="180" cy="130" rx="45" ry="8" fill="none" stroke="black" strokeWidth="2"/>
    <path d="M 145 130 Q 145 100 180 95 Q 215 100 215 130" fill="none" stroke="black" strokeWidth="2.5"/>
    <rect x="155" y="105" width="50" height="25" rx="2" fill="none" stroke="black" strokeWidth="2"/>
    <line x1="160" y1="115" x2="200" y2="115" stroke="black" strokeWidth="1.5"/>

    {/* Whip coiled */}
    <ellipse cx="185" cy="165" rx="20" ry="6" fill="none" stroke="black" strokeWidth="2"/>
    <ellipse cx="185" cy="162" rx="15" ry="5" fill="none" stroke="black" strokeWidth="2"/>
    <ellipse cx="185" cy="159" rx="10" ry="4" fill="none" stroke="black" strokeWidth="2"/>
    <path d="M 205 165 Q 220 165 225 170 Q 230 175 228 180" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>

    {/* Computer case */}
    <rect x="230" y="100" width="140" height="180" rx="4" fill="none" stroke="black" strokeWidth="2.5"/>

    {/* Floppy drive - 5.25" */}
    <rect x="245" y="130" width="110" height="40" fill="none" stroke="black" strokeWidth="2"/>
    <circle cx="280" cy="150" r="15" fill="white" stroke="black" strokeWidth="2"/>
    <circle cx="280" cy="150" r="6" fill="black"/>
    <rect cx="280" cy="142" width="8" height="16" fill="black"/>
    <path d="M 272 142 L 272 158 L 288 158 L 288 142" fill="black"/>
    <circle cx="280" cy="150" r="4" fill="white"/>
    <line x1="330" y1="145" x2="345" y2="145" stroke="black" strokeWidth="1.5"/>
    <rect x="325" y="155" width="25" height="8" rx="1" fill="none" stroke="black" strokeWidth="1.5"/>

    {/* Power button */}
    <circle cx="260" cy="260" r="6" fill="none" stroke="black" strokeWidth="2"/>
    <path d="M 260 255 L 260 260" stroke="black" strokeWidth="2" strokeLinecap="round"/>

    {/* Ventilation slots */}
    <line x1="340" y1="240" x2="340" y2="265" stroke="black" strokeWidth="1.5"/>
    <line x1="345" y1="240" x2="345" y2="265" stroke="black" strokeWidth="1.5"/>
    <line x1="350" y1="240" x2="350" y2="265" stroke="black" strokeWidth="1.5"/>
  </svg>
);

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
          {/* Indiana Jones quote */}
          <p className="text-2xl md:text-3xl font-bold mb-8">It belongs in a museum!</p>

          {/* Indiana Jones style graphic */}
          <VintageComputerGraphic />

          {/* Logo/Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Labs
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-6 opacity-60">
            Digital Archaeology
          </p>

          {/* Description */}
          <p className="text-base md:text-lg mb-12 opacity-50 max-w-2xl mx-auto leading-relaxed">
            Recover and convert data from legacy file formats into modern, accessible formats.
            Upload historic database, spreadsheet, and word processing files from the 1970s-2000s
            for automatic conversion and data extraction.
          </p>

          {/* Terminal button */}
          <Link
            href="https://labs-teleports-cloud.onrender.com"
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
          <div className="flex flex-wrap justify-center gap-8">
            {SUPPORTED_FORMATS.map((format, idx) => (
              <div key={idx} className="text-center flex flex-col items-center gap-2">
                <div className="text-4xl">{format.icon}</div>
                <div className="font-semibold text-sm">{format.name}</div>
                <div className="text-xs opacity-50">{format.ext} • {format.era}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
