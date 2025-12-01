"""SmartWare II format parser"""

import re
import struct
from pathlib import Path
from typing import List, Dict, Any

from .base import BaseFormatParser, FormatMetadata


class SmartWareParser(BaseFormatParser):
    """Parser for SmartWare II .ws files"""

    @classmethod
    def get_metadata(cls) -> FormatMetadata:
        return FormatMetadata(
            name="SmartWare II",
            extensions=[".ws"],
            era="1980s-1990s",
            category="Database",
            description="SmartWare II integrated office suite database files",
            magic_bytes=b'\x53\x04',
        )

    def get_field_names(self) -> List[str]:
        """Return field names for SmartWare vegetation data"""
        return [
            'Date',
            'Quadrat',
            'Green Grass',
            'Dead Grass',
            'Green Forb',
            'Dead Forb',
            'Litter',
            'Tree Cover',
            'Bare Ground',
            'Total',
        ]

    def parse(self) -> Dict[str, Any]:
        """Parse SmartWare II file and extract vegetation survey data"""
        dates = self._extract_dates()
        quadrats = self._extract_quadrats()
        numbers = self._extract_numbers()

        # Simple proximity-based grouping
        records = []
        numbers_dict = {pos: val for pos, val in numbers}

        for date_pos, date_str in dates:
            nearby_quads = [(pos, qid) for pos, qid in quadrats if abs(pos - date_pos) < 100]

            for quad_pos, quad_id in nearby_quads:
                row_nums = []
                for pos in sorted(numbers_dict.keys()):
                    if quad_pos < pos < quad_pos + 300:
                        row_nums.append(numbers_dict[pos])
                        if len(row_nums) >= 9:
                            break

                if len(row_nums) >= 3:
                    while len(row_nums) < 9:
                        row_nums.append(None)

                    records.append({
                        'Date': date_str,
                        'Quadrat': quad_id,
                        'Green Grass': row_nums[0],
                        'Dead Grass': row_nums[1],
                        'Green Forb': row_nums[2],
                        'Dead Forb': row_nums[3],
                        'Litter': row_nums[4],
                        'Tree Cover': row_nums[5],
                        'Bare Ground': row_nums[6],
                        'Total': row_nums[7],
                    })

        self.records = records
        self.extraction_metadata = {
            'filename': self.filename,
            'dates_found': len(dates),
            'quadrats_found': len(quadrats),
            'numbers_found': len(numbers),
            'records': len(records),
        }

        return {'records': records, 'metadata': self.extraction_metadata}

    def _extract_dates(self):
        """Extract dates in format YYYY/MM/DD"""
        pattern = rb'(19\d{2}/\d{2}/\d{2})'
        return [(m.start(), m.group(1).decode('ascii', errors='ignore'))
                for m in re.finditer(pattern, self.data)]

    def _extract_quadrats(self):
        """Extract quadrat IDs"""
        pattern = rb'([msw]\d+[rq]\d+[q]?\d*)'
        matches = []
        for m in re.finditer(pattern, self.data):
            qid = m.group(1).decode('ascii', errors='ignore')
            if 4 <= len(qid) <= 10:
                matches.append((m.start(), qid))
        return matches

    def _extract_numbers(self):
        """Extract IEEE 754 double precision numbers"""
        numbers = []
        i = 0
        while i < len(self.data) - 8:
            try:
                value = struct.unpack('<d', self.data[i:i+8])[0]
                if not (value != value) and (0 <= value <= 10000 or -10 <= value <= 0):
                    numbers.append((i, round(value, 4)))
            except:
                pass
            i += 1
        return numbers
