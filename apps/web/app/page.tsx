"use client";

import Link from "next/link";
import Image from "next/image";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
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

          {/* Terminal button */}
          <Link
            href="/terminal"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-all rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            Launch Converter
            <span className="text-xl">→</span>
          </Link>
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
