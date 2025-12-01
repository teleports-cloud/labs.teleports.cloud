"""dBase III/IV format parser (example template)"""

import struct
from typing import List, Dict, Any
from datetime import date

from .base import BaseFormatParser, FormatMetadata


class DBaseParser(BaseFormatParser):
    """
    Parser for dBase III/IV .dbf files

    This is a template/example showing how to add a new format.
    Implement the parsing logic as needed for the actual file format.
    """

    @classmethod
    def get_metadata(cls) -> FormatMetadata:
        return FormatMetadata(
            name="dBase III/IV",
            extensions=[".dbf"],
            era="1980s-1990s",
            category="Database",
            description="dBase database files - widely used database format",
            magic_bytes=b'\x03',  # dBase III without memo
        )

    def __init__(self, filepath):
        super().__init__(filepath)
        self.field_names = []
        self.field_definitions = []

    def get_field_names(self) -> List[str]:
        """Return field names from dBase header"""
        return self.field_names

    def parse(self) -> Dict[str, Any]:
        """
        Parse dBase file

        dBase file structure:
        - Header (32 bytes)
        - Field descriptors (32 bytes each)
        - Records (variable length)
        """
        if len(self.data) < 32:
            self.extraction_metadata = {'error': 'File too small'}
            return {'records': [], 'metadata': self.extraction_metadata}

        try:
            # Parse header
            header = self._parse_header()

            # Parse field descriptors
            self._parse_field_descriptors(header['header_length'])

            # Parse records
            self._parse_records(header['record_count'], header['header_length'])

            self.extraction_metadata = {
                'filename': self.filename,
                'records': len(self.records),
                'fields': len(self.field_names),
                'last_update': header.get('last_update', 'Unknown'),
            }

        except Exception as e:
            self.extraction_metadata = {'error': str(e)}
            self.records = []

        return {'records': self.records, 'metadata': self.extraction_metadata}

    def _parse_header(self) -> Dict[str, Any]:
        """Parse dBase file header (first 32 bytes)"""
        # Byte 0: File type
        file_type = self.data[0]

        # Bytes 1-3: Last update (YY MM DD)
        year = 1900 + self.data[1]
        month = self.data[2]
        day = self.data[3]
        last_update = f"{year:04d}-{month:02d}-{day:02d}"

        # Bytes 4-7: Number of records (little-endian)
        record_count = struct.unpack('<I', self.data[4:8])[0]

        # Bytes 8-9: Header length
        header_length = struct.unpack('<H', self.data[8:10])[0]

        # Bytes 10-11: Record length
        record_length = struct.unpack('<H', self.data[10:12])[0]

        return {
            'file_type': file_type,
            'last_update': last_update,
            'record_count': record_count,
            'header_length': header_length,
            'record_length': record_length,
        }

    def _parse_field_descriptors(self, header_length: int):
        """Parse field descriptor array"""
        # Field descriptors start at byte 32
        offset = 32

        while offset < header_length - 1:
            # Each field descriptor is 32 bytes
            descriptor = self.data[offset:offset + 32]

            # Check for end of field descriptors (0x0D)
            if descriptor[0] == 0x0D:
                break

            # Parse field name (first 11 bytes, null-terminated)
            name = descriptor[0:11].split(b'\x00')[0].decode('ascii', errors='ignore')

            # Field type (byte 11)
            field_type = chr(descriptor[11])

            # Field length (byte 16)
            field_length = descriptor[16]

            self.field_names.append(name)
            self.field_definitions.append({
                'name': name,
                'type': field_type,
                'length': field_length,
            })

            offset += 32

    def _parse_records(self, record_count: int, header_length: int):
        """Parse data records"""
        offset = header_length

        for _ in range(record_count):
            # First byte: deletion flag
            if offset >= len(self.data):
                break

            deleted = self.data[offset] == ord('*')
            offset += 1

            if deleted:
                # Skip deleted records (but could optionally include them)
                record_size = sum(f['length'] for f in self.field_definitions)
                offset += record_size
                continue

            # Parse field values
            record = {}
            for field_def in self.field_definitions:
                field_length = field_def['length']
                field_data = self.data[offset:offset + field_length]

                # Parse based on field type
                value = self._parse_field_value(field_data, field_def['type'])
                record[field_def['name']] = value

                offset += field_length

            self.records.append(record)

    def _parse_field_value(self, data: bytes, field_type: str):
        """Parse individual field value based on type"""
        try:
            raw_value = data.decode('ascii', errors='ignore').strip()

            if field_type == 'C':  # Character
                return raw_value
            elif field_type == 'N':  # Numeric
                return float(raw_value) if '.' in raw_value else int(raw_value)
            elif field_type == 'L':  # Logical
                return raw_value.upper() in ('T', 'Y')
            elif field_type == 'D':  # Date (YYYYMMDD)
                if len(raw_value) == 8:
                    return f"{raw_value[0:4]}/{raw_value[4:6]}/{raw_value[6:8]}"
                return raw_value
            else:
                return raw_value
        except:
            return None
