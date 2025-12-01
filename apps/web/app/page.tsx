"use client";

import Link from "next/link";
import Image from "next/image";

const SUPPORTED_FORMATS = [
  { name: "SmartWare II", ext: ".ws", era: "1980s-1990s" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Indiana Jones quote */}
          <p className="text-2xl md:text-3xl font-bold text-black italic">
            "It belongs in a museum!"
          </p>

          {/* Hero graphic */}
          <div className="py-4">
            <Image
              src="/hero.svg"
              alt="Vintage computer with Indiana Jones hat and whip"
              width={450}
              height={245}
              className="mx-auto"
              priority
            />
          </div>

          {/* Logo/Title */}
          <div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black mb-2">
              Labs
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light">
              Digital Archaeology
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Rescue data trapped in obsolete file formats.
            <br />
            Convert legacy files from the 1970s–2000s into modern formats.
          </p>

          {/* Terminal button */}
          <div className="pt-4">
            <Link
              href="/terminal"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-all rounded-md shadow-lg hover:shadow-xl"
            >
              Launch Converter
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Supported Formats Footer */}
      <div className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
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
