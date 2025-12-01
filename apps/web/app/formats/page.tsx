import Link from "next/link";

export default function FormatsPage() {
  return (
    <div className="terminal min-h-screen flex flex-col">
      <div className="scan-line" />

      <header className="terminal-header py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📋 Supported Formats</h1>
            <p className="text-sm opacity-90">File Format Documentation</p>
          </div>
          <Link href="/" className="terminal-button py-2 px-4 rounded">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* SmartWare II */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              SmartWare II Database Files (.ws)
            </h2>

            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Format Details</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Magic Bytes: <code className="bg-black/50 px-2 py-1 rounded">0x53 0x04</code></li>
                  <li>Era: 1980s-1990s DOS/Windows software</li>
                  <li>Application: SmartWare II integrated office suite</li>
                  <li>Binary proprietary format</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Data Extraction Method</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Binary format reverse-engineered</li>
                  <li>Pattern matching for dates (YYYY/MM/DD)</li>
                  <li>Quadrat ID extraction (m/s/w + numbers)</li>
                  <li>IEEE 754 double precision number extraction</li>
                  <li>Proximity-based field grouping</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Extracted Fields</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Date</span> - Survey date
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Quadrat</span> - Sampling location ID
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Green Grass</span> - Living grass coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Dead Grass</span> - Dead grass coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Green Forb</span> - Living forbs coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Dead Forb</span> - Dead forbs coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Litter</span> - Plant litter coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Tree Cover</span> - Canopy coverage %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Bare Ground</span> - Exposed soil %
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">Total</span> - Sum verification
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Future Formats */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Future Format Support
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-yellow-400 mb-2">📄 CSV Files</h3>
                <p className="text-sm text-gray-400">Raw import for comma-separated values</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-yellow-400 mb-2">📊 Excel Files</h3>
                <p className="text-sm text-gray-400">.xlsx and .xls spreadsheet support</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-yellow-400 mb-2">🗄️ dBASE Files</h3>
                <p className="text-sm text-gray-400">.dbf database file format</p>
              </div>

              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h3 className="font-bold text-yellow-400 mb-2">📦 Archives</h3>
                <p className="text-sm text-gray-400">.zip and .tar.gz extraction</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="terminal-panel p-6">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">
              Technical Implementation
            </h2>

            <pre className="bg-black/50 p-4 rounded text-sm overflow-x-auto">
              <code className="text-green-400">{`// Pattern Recognition
const datePattern = /19\\d{2}\\/\\d{2}\\/\\d{2}/g;
const quadratPattern = /[msw]\\d+[rq]\\d+[q]?\\d*/g;

// IEEE 754 Double Extraction
for (let i = 0; i < data.length - 8; i++) {
  const value = data.readDoubleLE(i);
  if (isValid(value)) numbers.push([i, value]);
}

// Proximity-based Grouping
for (const [datePos, date] of dates) {
  const nearbyQuadrats = quadrats.filter(
    ([pos]) => Math.abs(pos - datePos) < 100
  );
  // Group related fields...
}`}</code>
            </pre>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>SmartWare II Data Recovery Project</p>
        </div>
      </footer>
    </div>
  );
}
