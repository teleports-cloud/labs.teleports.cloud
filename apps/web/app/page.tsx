"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showScanLine, setShowScanLine] = useState(true);

  return (
    <div className="terminal min-h-screen flex flex-col">
      {showScanLine && <div className="scan-line" />}

      {/* Header */}
      <header className="terminal-header py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">🔬 SmartWare Data Viewer</h1>
          <p className="text-sm opacity-90">labs.teleports.cloud</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="terminal-panel p-8 mb-6">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">
              Dr. J. Carter Research Data (1991-1992)
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Recovered 1,761 vegetation survey records from SmartWare II database files
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/upload" className="terminal-button-primary py-4 px-6 rounded text-center font-semibold text-lg">
                📤 Upload & Parse Files
              </Link>

              <Link href="/formats" className="terminal-button py-4 px-6 rounded text-center font-semibold text-lg">
                📋 Supported Formats
              </Link>

              <Link href="/about" className="terminal-button py-4 px-6 rounded text-center font-semibold text-lg">
                ℹ️  About This Project
              </Link>

              <a
                href="https://github.com/teleports-cloud/labs.teleports.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-button py-4 px-6 rounded text-center font-semibold text-lg"
              >
                💻 View on GitHub
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="terminal-panel p-4 text-center">
              <div className="text-3xl font-bold text-green-400">1,761</div>
              <div className="text-sm text-gray-400">Records Recovered</div>
            </div>

            <div className="terminal-panel p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">6</div>
              <div className="text-sm text-gray-400">SmartWare II Files</div>
            </div>

            <div className="terminal-panel p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">1991-1992</div>
              <div className="text-sm text-gray-400">Research Period</div>
            </div>
          </div>

          {/* Terminal Info */}
          <div className="mt-6 p-4 bg-black/30 rounded border border-gray-800">
            <p className="text-xs text-gray-500 font-mono">
              <span className="text-green-400">$</span> ./launch-tui.sh <span className="cursor-blink">█</span>
              <br />
              <span className="text-gray-600"># Also available as terminal UI - see README</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>SmartWare II Data Recovery Project | Binary Format Reverse Engineering</p>
          <p className="text-xs mt-1">Built with Next.js + Textual + Python</p>
        </div>
      </footer>
    </div>
  );
}
