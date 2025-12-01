import { NextRequest, NextResponse } from 'next/server';

// SmartWare Parser (TypeScript implementation)
class SmartWareParser {
  private data: Buffer;
  private filename: string;

  constructor(data: Buffer, filename: string) {
    this.data = data;
    this.filename = filename;
  }

  parse() {
    const dates = this.extractDates();
    const quadrats = this.extractQuadrats();
    const numbers = this.extractNumbers();

    const records: any[] = [];
    const numbersMap = new Map(numbers.map(([pos, val]) => [pos, val]));

    for (const [datePos, dateStr] of dates) {
      const nearbyQuads = quadrats.filter(([pos]) => Math.abs(pos - datePos) < 100);

      for (const [quadPos, quadId] of nearbyQuads) {
        const rowNums: (number | null)[] = [];

        for (const pos of Array.from(numbersMap.keys()).sort((a, b) => a - b)) {
          if (pos > quadPos && pos < quadPos + 300) {
            rowNums.push(numbersMap.get(pos)!);
            if (rowNums.length >= 9) break;
          }
        }

        if (rowNums.length >= 3) {
          while (rowNums.length < 9) {
            rowNums.push(null);
          }

          records.push({
            Date: dateStr,
            Quadrat: quadId,
            'Green Grass': rowNums[0],
            'Dead Grass': rowNums[1],
            'Green Forb': rowNums[2],
            'Dead Forb': rowNums[3],
            Litter: rowNums[4],
            'Tree Cover': rowNums[5],
            'Bare Ground': rowNums[6],
            Total: rowNums[7],
          });
        }
      }
    }

    return {
      records,
      metadata: {
        filename: this.filename,
        dates_found: dates.length,
        quadrats_found: quadrats.length,
        numbers_found: numbers.length,
        records: records.length,
      },
    };
  }

  private extractDates(): [number, string][] {
    const pattern = /19\d{2}\/\d{2}\/\d{2}/g;
    const matches: [number, string][] = [];
    const text = this.data.toString('latin1');

    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push([match.index, match[0]]);
    }

    return matches;
  }

  private extractQuadrats(): [number, string][] {
    const pattern = /[msw]\d+[rq]\d+[q]?\d*/g;
    const matches: [number, string][] = [];
    const text = this.data.toString('latin1');

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const qid = match[0];
      if (qid.length >= 4 && qid.length <= 10) {
        matches.push([match.index, qid]);
      }
    }

    return matches;
  }

  private extractNumbers(): [number, number][] {
    const numbers: [number, number][] = [];

    for (let i = 0; i < this.data.length - 8; i++) {
      try {
        const value = this.data.readDoubleLE(i);

        if (!isNaN(value) && isFinite(value)) {
          if ((value >= 0 && value <= 10000) || (value >= -10 && value <= 0)) {
            numbers.push([i, Math.round(value * 10000) / 10000]);
          }
        }
      } catch (e) {
        // Skip invalid reads
      }
    }

    return numbers;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parser = new SmartWareParser(buffer, file.name);
    const result = parser.parse();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    );
  }
}
