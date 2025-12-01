"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface ParseResult {
  records: any[];
  metadata: {
    filename: string;
    dates_found: number;
    quadrats_found: number;
    numbers_found: number;
    records: number;
  };
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleParse = async () => {
    if (!file) return;

    setParsing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse file");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setParsing(false);
    }
  };

  const downloadCSV = () => {
    if (!result) return;

    const headers = Object.keys(result.records[0]);
    const csv = [
      headers.join(","),
      ...result.records.map((record) =>
        headers.map((h) => record[h] ?? "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.metadata.filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="terminal min-h-screen flex flex-col">
      <div className="scan-line" />

      <header className="terminal-header py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📤 Upload & Parse Files</h1>
            <p className="text-sm opacity-90">SmartWare II Data Parser</p>
          </div>
          <Link href="/" className="terminal-button py-2 px-4 rounded">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="terminal-panel p-8 mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Select File</h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ws"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />

                <label
                  htmlFor="file-input"
                  className="cursor-pointer block"
                >
                  <div className="text-6xl mb-4">📁</div>
                  <div className="text-lg font-semibold mb-2">
                    {file ? file.name : "Click to select .ws file"}
                  </div>
                  <div className="text-sm text-gray-500">
                    SmartWare II database files (.ws)
                  </div>
                </label>
              </div>

              <button
                onClick={handleParse}
                disabled={!file || parsing}
                className="terminal-button-primary py-3 px-6 rounded w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {parsing ? "Parsing..." : "Parse File"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded p-4 mb-6">
              <p className="text-red-200">❌ Error: {error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <>
              <div className="terminal-panel p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-green-400">
                    ✅ Parse Complete
                  </h2>
                  <button
                    onClick={downloadCSV}
                    className="terminal-button py-2 px-4 rounded"
                  >
                    📥 Download CSV
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {result.metadata.records}
                    </div>
                    <div className="text-xs text-gray-400">Records</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {result.metadata.dates_found}
                    </div>
                    <div className="text-xs text-gray-400">Dates Found</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {result.metadata.quadrats_found}
                    </div>
                    <div className="text-xs text-gray-400">Quadrats Found</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {result.metadata.numbers_found}
                    </div>
                    <div className="text-xs text-gray-400">Numbers Found</div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="terminal-panel p-6">
                <h3 className="text-lg font-bold mb-4">
                  Data Preview (first 50 records)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {Object.keys(result.records[0]).map((header) => (
                          <th
                            key={header}
                            className="text-left py-2 px-3 text-cyan-400"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.records.slice(0, 50).map((record, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-800 hover:bg-gray-900/50"
                        >
                          {Object.values(record).map((value, j) => (
                            <td key={j} className="py-2 px-3">
                              {value !== null && value !== undefined ? String(value) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {result.records.length > 50 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Showing 50 of {result.records.length} records. Download CSV
                    for full dataset.
                  </p>
                )}
              </div>
            </>
          )}
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
