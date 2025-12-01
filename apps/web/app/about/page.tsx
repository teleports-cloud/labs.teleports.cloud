import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="terminal min-h-screen flex flex-col">
      <div className="scan-line" />

      <header className="terminal-header py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ℹ️  About This Project</h1>
            <p className="text-sm opacity-90">SmartWare II Data Recovery</p>
          </div>
          <Link href="/" className="terminal-button py-2 px-4 rounded">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Project Info */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Project Overview
            </h2>

            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Project:</strong> SmartWare II Data Recovery
              </p>
              <p>
                <strong className="text-white">Version:</strong> 2.0
              </p>
              <p>
                <strong className="text-white">Built with:</strong> Python + Textual + Next.js + TypeScript
              </p>
            </div>
          </div>

          {/* Achievement */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Achievement
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Successfully recovered{" "}
              <span className="text-green-400 font-bold">1,761 vegetation survey records</span>{" "}
              from six SmartWare II database files spanning{" "}
              <span className="text-yellow-400 font-bold">1991-1992</span> field research.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded text-center">
                <div className="text-3xl font-bold text-green-400">1,761</div>
                <div className="text-xs text-gray-400">Records</div>
              </div>
              <div className="bg-black/30 p-4 rounded text-center">
                <div className="text-3xl font-bold text-cyan-400">6</div>
                <div className="text-xs text-gray-400">Files</div>
              </div>
              <div className="bg-black/30 p-4 rounded text-center">
                <div className="text-3xl font-bold text-yellow-400">2</div>
                <div className="text-xs text-gray-400">Years</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              Features
            </h2>

            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Binary format reverse engineering</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Pattern-based data extraction</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Beautiful terminal user interface (Textual)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Web-based viewer and parser</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Export to modern formats (CSV, Excel)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Statistical analysis and visualization</span>
              </li>
            </ul>
          </div>

          {/* Original Data */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Original Data
            </h2>

            <p className="text-gray-300">
              <strong className="text-white">Researcher:</strong> Dr. J. Carter
              <br />
              <strong className="text-white">Topic:</strong> Vegetation coverage research
              <br />
              <strong className="text-white">Period:</strong> Ecological surveys from 1991-1992
              <br />
              <strong className="text-white">Format:</strong> SmartWare II proprietary database (.ws files)
            </p>
          </div>

          {/* Technology Stack */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">
              Technology Stack
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Frontend</h3>
                <p className="text-sm text-gray-400">Next.js 14, React, TypeScript, Tailwind CSS</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Backend</h3>
                <p className="text-sm text-gray-400">Next.js API Routes, Node.js</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Terminal UI</h3>
                <p className="text-sm text-gray-400">Python, Textual, Rich</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Deployment</h3>
                <p className="text-sm text-gray-400">Vercel, GitHub</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Parser</h3>
                <p className="text-sm text-gray-400">Binary analysis, Pattern matching</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-blue-400 mb-1">Data</h3>
                <p className="text-sm text-gray-400">IEEE 754, Regex, Proximity grouping</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Links
            </h2>

            <div className="space-y-2">
              <a
                href="https://github.com/teleports-cloud/labs.teleports.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-button-primary py-3 px-4 rounded block text-center"
              >
                💻 View on GitHub
              </a>

              <Link
                href="/upload"
                className="terminal-button py-3 px-4 rounded block text-center"
              >
                📤 Try the Parser
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>SmartWare II Data Recovery Project | labs.teleports.cloud</p>
        </div>
      </footer>
    </div>
  );
}
