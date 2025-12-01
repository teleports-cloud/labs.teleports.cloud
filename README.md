# SmartWare Data Viewer

Modern tools for recovering and analyzing data from SmartWare II spreadsheet files (.ws format, 1980s-1990s).

## 🚀 Quick Start

```bash
./launch-tui.sh
```

**Beautiful Terminal UI** - Built with Textual for a streamlined experience.

## 📦 What's This?

Dr. John Carter's climate research data (1991-1992) was trapped in **SmartWare II format** - an abandoned 1980s spreadsheet format with no modern support. This project:

1. ✅ **Reverse-engineered** the SmartWare II file format
2. ✅ **Extracted** 1,761 data records from 6 files
3. ✅ **Created** beautiful tools to view and analyze the data
4. ✅ **Deployed** a web app to Vercel

**Result**: 30-year-old data recovered and ready for analysis!

## 🎯 Features

### Terminal UI (Textual)
- **Modern interface** with sidebar navigation
- **Tabbed views**: Data / Statistics / Info
- **File switching**: Click buttons or use number keys (1-6)
- **Real-time parsing**: Load and analyze .ws files instantly
- **Keyboard shortcuts**: `r` refresh, `q` quit

### Web Application
- **Production URL**: https://web-ie4n3zkjc-buck-chanceys-projects.vercel.app
- **Custom domain**: smartsheet.teleports.cloud (DNS pending)
- **Drag & drop** file upload
- **Interactive tables** with pagination
- **Statistics dashboard**
- **Formula translation** reference
- **Export** to Excel/CSV

### Python Tools
- **smartware_viewer.py** - Beautiful Textual TUI (recommended)
- **smartware_tui.py** - Rich-based TUI (legacy)
- **smartware.py** - CLI parser
- **create_master_workbook.py** - Production extractor (1,761 records)
- **api.py** - FastAPI backend for web app

## 📁 Project Structure

```
john-old-database-sheet/
├── launch-tui.sh          ⭐ Launch beautiful TUI
├── QUICKSTART.md          📖 Quick start guide
│
├── *.ws (6 files)         📊 Original SmartWare II data
│   ├── Cab-tba.ws        Basal area (6 records)
│   ├── Cab2.ws           Vegetation (399 records)
│   ├── Cab3.ws           Vegetation (390 records)
│   ├── Cab4.ws           Vegetation (398 records)
│   ├── Malcov.ws         Vegetation (321 records)
│   └── Malcov2.ws        Vegetation (247 records)
│
├── apps/
│   ├── web/              🌐 Next.js web app (deployed)
│   └── python/           🐍 Python tools
│       ├── smartware_viewer.py ⭐ Textual TUI
│       ├── api.py              FastAPI backend
│       └── ...                 Other tools
│
└── dist/                 📚 All recovered data & documentation
    ├── *.xlsx/csv        Recovered data files
    └── *.txt/html        Format specs & reports
```

## 🔧 Installation

### Terminal UI

```bash
pip3 install textual openpyxl
./launch-tui.sh
```

### Web App (Local Development)

```bash
cd apps/web
pnpm install
pnpm dev
# Open http://localhost:3000
```

## 📊 Data Format

### SmartWare II (.ws)
- **Magic Bytes**: `0x53 0x04` (S for SmartWare)
- **Structure**: Hybrid record-based + embedded data
- **Encoding**: Little-endian IEEE 754 doubles
- **Age**: 1980s-1990s Informix software (**discontinued**)
- **Support**: **ZERO** libraries exist

### Extraction Method
- **IEEE 754 scanning** - Byte-by-byte double extraction
- **Pattern matching** - Dates (YYYY/MM/DD), Quadrat IDs (m1r1q1)
- **Proximity grouping** - Associate data by byte position
- **Formula reconstruction** - Heuristic analysis (100% validated)

See `dist/SMARTWARE_FORMAT_SPECIFICATION.txt` for complete reverse-engineered format (30 KB, 485 lines).

## 📖 Documentation

- **QUICKSTART.md** - Get started in 30 seconds
- **DEPLOYMENT_COMPLETE.md** - Vercel deployment details
- **dist/FORMAT_INVESTIGATION_SUMMARY.txt** - Executive summary
- **dist/SMARTWARE_FORMAT_SPECIFICATION.txt** - Complete format spec
- **apps/python/README.md** - Python tools documentation
- **apps/web/README.md** - Web app documentation

## 🧪 Data Contents

### Vegetation Cover (Cab2, Cab3, Cab4, Malcov, Malcov2)
- **Columns**: Date, Quadrat, Green Grass, Dead Grass, Green Forb, Dead Forb, Litter, Tree Cover, Bare Ground, Total Cover
- **Units**: Percent (%)
- **Records**: 1,500+ across 5 files

### Basal Area (Cab-tba)
- **Columns**: Line, Measurements 1-6, Average, Std Dev, Std Error
- **Units**: m²/ha (assumed)
- **Records**: 6 transect lines

### Critical: Blank vs Zero
- **Blank** (`""`) = No measurement taken
- **Zero** (`0.0`) = Measurement taken, result was zero
- **Important**: Don't treat zeros as missing data!

## 🚀 Deployment

### Continuous Integration (CircleCI)
This project uses CircleCI for automated builds and deployments.

**Pipeline**: Validates → Builds → Tests → Deploys (main branch only)

See `CIRCLECI_SETUP.md` for complete setup guide.

```bash
# Setup CircleCI
./setup-circleci.sh

# Validate config
circleci config validate
```

### Web App (Vercel)
Already deployed! Automatic deployments via CircleCI on `main` branch.

**Production**: https://web-ie4n3zkjc-buck-chanceys-projects.vercel.app

### Manual Redeploy
```bash
vercel --prod
```

## 💡 Usage Examples

### View Data in Terminal

```bash
./launch-tui.sh
# Press 1-6 to switch files
# Tab to change views (Data/Statistics/Info)
# Press q to quit
```

### Extract to Excel (Manual)

```bash
python3 apps/python/create_master_workbook.py
# Generates: Dr_Carter_Research_Data_1991-1992_MASTER.xlsx
```

### Web Upload

1. Visit https://web-ie4n3zkjc-buck-chanceys-projects.vercel.app
2. Drag & drop .ws files
3. View data, statistics, formulas
4. Export to Excel/CSV

## 🏆 Achievements

- ✅ **Format identified**: SmartWare II (not Lotus 1-2-3)
- ✅ **Format reverse-engineered**: 30 KB specification written
- ✅ **Library research**: Exhaustive (NO alternatives exist)
- ✅ **Data extracted**: 1,761 records (100% validated)
- ✅ **TUI created**: Beautiful Textual interface
- ✅ **Web app built**: Next.js + Python serverless
- ✅ **Deployed**: Production-ready on Vercel
- ✅ **Documented**: Comprehensive (65+ KB documentation)

## 📈 Stats

- **Total Records**: 1,761
- **Date Range**: 1991/05/13 to 1992/07/28
- **Files Recovered**: 6 SmartWare II worksheets
- **Lines of Code**: ~4,000+
- **Documentation**: ~1,500 lines
- **Format Spec**: 30 KB (485 lines)
- **Development Time**: ~12 hours
- **Library Searches**: 5 GitHub, 10+ web, 8 PyPI (found ZERO)

## 🤝 Credits

**Data Recovery & Development:**
- Blake Carter
- Claude (Anthropic AI, Sonnet 4.5)

**Original Research Data:**
- Dr. John Carter (Climate Science, 50+ years)
- 1991-1992 Vegetation & Basal Area Measurements

**Recovered**: November 21-23, 2025
**Web App Deployed**: November 26, 2025

## 📝 License

MIT License

## 🆘 Support

- **Technical Issues**: See `dist/RECOVERY_REPORT.html`
- **Format Questions**: See `dist/SMARTWARE_FORMAT_SPECIFICATION.txt`
- **Web App**: See `apps/web/README.md`
- **Python Tools**: See `apps/python/README.md`

---

**Status**: ✅ Complete
**Quality**: Production-ready
**Data**: Fully recovered (1,761 records)
**Tools**: Terminal UI + Web App + Python CLI
**Deployment**: Live on Vercel

🎉 **30-year-old data successfully recovered and modernized!**
