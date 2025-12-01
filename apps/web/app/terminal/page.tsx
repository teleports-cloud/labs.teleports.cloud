"use client";

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <iframe
        src="https://labs-teleports-cloud.onrender.com"
        className="w-full h-screen border-0"
        title="Historic Format Viewer TUI"
      />
    </div>
  );
}
