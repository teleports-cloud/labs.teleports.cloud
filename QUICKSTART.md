# 🚀 Quick Start Guide

## SmartWare Data Viewer

### Terminal UI (Beautiful & Streamlined)

```bash
./launch-tui.sh
```

**Features:**
- Modern, beautiful interface (built with Textual)
- Browse all 6 .ws files with sidebar navigation
- Tabbed interface: Data / Statistics / Info
- Real-time data table (first 100 records)
- Statistical analysis
- File metadata display

**Keyboard Shortcuts:**
- `1-6` - Select file by number
- `r` - Refresh current file
- `q` - Quit

**Requirements:** Python 3 with Textual (auto-installed)

---

### Option 2: Web Application (Recommended for Sharing)

```bash
./launch-web.sh
```

Then open: http://localhost:3000

**Features:**
- Modern web interface (black & white design)
- Drag & drop file upload
- Interactive data tables
- Real-time statistics
- Formula and column reference
- Export functionality

**Requirements:** Node.js 18+ with pnpm (auto-installed)

**Production URL:** https://web-ie4n3zkjc-buck-chanceys-projects.vercel.app

---

## 📁 Project Structure

```
john-old-database-sheet/
├── launch-tui.sh           ⭐ Launch Terminal UI
├── launch-web.sh           ⭐ Launch Web App
├── *.ws                    📊 Original SmartWare II data files (6 files)
├── apps/
│   ├── web/               🌐 Next.js web application
│   └── python/            🐍 Python tools (TUI, CLI, API)
├── dist/                  📚 Documentation & recovered data
├── README.md              📖 Complete documentation
└── DEPLOYMENT_COMPLETE.md 🚀 Deployment guide

```

---

## 🎯 What Each Launcher Does

### Terminal UI (`launch-tui.sh`)
1. Checks for Python 3
2. Installs Rich library if needed
3. Finds all .ws files in current directory
4. Launches interactive TUI
5. Use keyboard shortcuts:
   - `t` - Table view
   - `s` - Statistics
   - `a` - Analysis
   - `f` - Formulas
   - `m` - Mappings
   - `n/p` - Next/Previous file
   - `q` - Quit

### Web App (`launch-web.sh`)
1. Checks for pnpm
2. Installs dependencies if needed
3. Starts Next.js dev server on port 3000
4. Opens in browser
5. Upload .ws files via drag & drop
6. Press Ctrl+C to stop

---

## 📊 Data Files

**Original SmartWare II files (1991-1992):**
- `Cab-tba.ws` - Basal area measurements (6 transect lines)
- `Cab2.ws` - Vegetation cover (399 records)
- `Cab3.ws` - Vegetation cover (390 records)
- `Cab4.ws` - Vegetation cover (398 records)
- `Malcov.ws` - Vegetation cover (321 records)
- `Malcov2.ws` - Vegetation cover (247 records)

**Total:** 1,761 data records

---

## 🔧 Manual Commands

If launchers don't work, use these:

### Terminal UI
```bash
python3 apps/python/smartware_tui.py *.ws
```

### Web App
```bash
cd apps/web
pnpm install  # First time only
pnpm dev
```

### CLI Parser
```bash
python3 apps/python/smartware.py *.ws --output-dir output
```

---

## 📖 Documentation

- **README.md** - Complete project documentation
- **DEPLOYMENT_COMPLETE.md** - Vercel deployment details
- **dist/README.txt** - Output files overview
- **dist/FORMAT_INVESTIGATION_SUMMARY.txt** - Format specification
- **apps/python/README.md** - Python tools documentation
- **apps/web/README.md** - Web app documentation

---

## 🆘 Troubleshooting

### TUI won't start
```bash
pip3 install rich openpyxl
python3 apps/python/smartware_tui.py *.ws
```

### Web app won't start
```bash
npm install -g pnpm
cd apps/web
pnpm install
pnpm dev
```

### No .ws files found
Make sure you're running from the project root directory where the .ws files are located.

---

## ✅ Quick Test

1. **Launch TUI:** `./launch-tui.sh`
2. **Press `t`** for table view
3. **Press `s`** for statistics
4. **Press `q`** to quit

Or:

1. **Launch Web:** `./launch-web.sh`
2. **Open browser** to http://localhost:3000
3. **Upload a .ws file** (drag & drop)
4. **View the data!**

---

**Project:** Dr. J. Carter Research Data Recovery (1991-1992)
**Format:** SmartWare II Worksheet (.ws)
**Status:** ✅ Fully Recovered & Deployed
