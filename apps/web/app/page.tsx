"use client";

import Link from "next/link";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s", icon: "💾" },
];

const VintageComputerGraphic = () => (
  <svg viewBox="0 0 600 400" className="w-full max-w-2xl h-auto mx-auto mb-8" fill="none" stroke="black" strokeWidth="2.5">
    {/* Fedora hat - left side */}
    <ellipse cx="150" cy="190" rx="55" ry="10" fill="none" stroke="black" strokeWidth="2.5"/>
    <path d="M 100 190 Q 100 150 150 140 Q 200 150 200 190" fill="none" stroke="black" strokeWidth="2.5"/>
    <rect x="120" y="155" width="60" height="35" rx="3" fill="none" stroke="black" strokeWidth="2.5"/>
    <line x1="125" y1="170" x2="175" y2="170" stroke="black" strokeWidth="2"/>

    {/* Whip coiled - bottom left */}
    <path d="M 140 240 Q 120 245 110 255" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="145" cy="260" rx="30" ry="8" fill="none" stroke="black" strokeWidth="2.5"/>
    <ellipse cx="145" cy="256" rx="22" ry="6" fill="none" stroke="black" strokeWidth="2"/>
    <ellipse cx="145" cy="252" rx="14" ry="4" fill="none" stroke="black" strokeWidth="2"/>

    {/* Computer tower - right side */}
    <rect x="300" y="80" width="220" height="280" rx="6" fill="none" stroke="black" strokeWidth="3"/>

    {/* Floppy disk drive - 5.25" */}
    <rect x="320" y="120" width="180" height="60" fill="none" stroke="black" strokeWidth="2.5"/>
    {/* Floppy disk visible in drive */}
    <circle cx="370" cy="150" r="20" fill="white" stroke="black" strokeWidth="2.5"/>
    <circle cx="370" cy="150" r="8" fill="black"/>
    <path d="M 362 142 L 362 158 L 378 158 L 378 142 Z" fill="black"/>
    <circle cx="370" cy="150" r="5" fill="white"/>
    {/* Drive slot/opening */}
    <line x1="450" y1="145" x2="480" y2="145" stroke="black" strokeWidth="2"/>
    <rect x="445" y="155" width="40" height="12" rx="2" fill="none" stroke="black" strokeWidth="2"/>

    {/* Power button and LED */}
    <circle cx="340" cy="330" r="8" fill="none" stroke="black" strokeWidth="2.5"/>
    <path d="M 340 323 L 340 330" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="370" cy="330" r="4" fill="black"/>

    {/* Ventilation grilles */}
    <line x1="480" y1="280" x2="480" y2="320" stroke="black" strokeWidth="2"/>
    <line x1="487" y1="280" x2="487" y2="320" stroke="black" strokeWidth="2"/>
    <line x1="494" y1="280" x2="494" y2="320" stroke="black" strokeWidth="2"/>
    <line x1="501" y1="280" x2="501" y2="320" stroke="black" strokeWidth="2"/>
  </svg>
);

export default function LandingPage() {
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-colors rounded"
          >
            Open Terminal
            <span className="text-xl">↗</span>
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
