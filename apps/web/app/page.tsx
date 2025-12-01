"use client";

import Link from "next/link";
import Image from "next/image";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center -mt-12">
          {/* Indiana Jones quote */}
          <p className="text-3xl md:text-4xl font-bold mb-8 text-black">It belongs in a museum!</p>

          {/* Hero graphic */}
          <Image
            src="/hero.png"
            alt="Vintage computer with Indiana Jones hat and whip"
            width={500}
            height={300}
            className="mx-auto mb-8"
            priority
          />

          {/* Logo/Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight text-black">
            Labs
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-5 text-gray-600">
            Digital Archaeology
          </p>

          {/* Description */}
          <p className="text-base md:text-lg mb-8 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Recover and convert data from legacy file formats into modern, accessible formats.
            Upload historic database, spreadsheet, and word processing files from the 1970s-2000s
            for automatic conversion and data extraction.
          </p>

          {/* Terminal button */}
          <Link
            href="/terminal"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-colors rounded"
          >
            Open Terminal
            <span className="text-xl">↗</span>
          </Link>
        </div>
      </div>

      {/* Supported Formats Footer */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
            Currently Supported Formats
          </p>
          <p className="text-base font-mono text-gray-600">
            {SUPPORTED_FORMATS.map((format, idx) => (
              <span key={idx}>
                {format.name} {format.ext} • {format.era}
                {idx < SUPPORTED_FORMATS.length - 1 && " | "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
