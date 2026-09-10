/**
 * Minimal PNG `tEXt` chunk reader/writer.
 *
 * Used to stamp the headline stats into public/og.png so a committed social
 * card can be checked against `src/lib/siteStats.ts` without re-rasterizing it.
 * sharp's SVG text rendering depends on the host font stack, so the PNG bytes
 * are not reproducible between macOS and the ubuntu CI runner and cannot be
 * diffed; the stamp travels inside the same bytes the pixels do, written in the
 * same generator run, so a stale card carries a stale stamp.
 *
 * tEXt is an ancillary chunk (lowercase first letter), so every decoder that
 * does not care about it skips it — including every OpenGraph scraper.
 */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function assertPng(png: Buffer): void {
  if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Not a PNG: bad signature");
  }
}

/**
 * Returns a copy of `png` with a `tEXt` chunk carrying `keyword`/`text`
 * inserted directly after IHDR. Any existing chunk with the same keyword is
 * replaced, so re-running a generator never accumulates duplicates.
 */
export function withPngTextChunk(png: Buffer, keyword: string, text: string): Buffer {
  assertPng(png);
  if (keyword.length === 0 || keyword.length > 79) {
    throw new Error(`tEXt keyword must be 1-79 characters, got ${keyword.length}`);
  }

  const data = Buffer.concat([Buffer.from(keyword, "latin1"), Buffer.from([0]), Buffer.from(text, "latin1")]);
  const type = Buffer.from("tEXt", "latin1");
  const chunk = Buffer.concat([
    (() => {
      const length = Buffer.alloc(4);
      length.writeUInt32BE(data.length, 0);
      return length;
    })(),
    type,
    data,
    (() => {
      const crc = Buffer.alloc(4);
      crc.writeUInt32BE(crc32(Buffer.concat([type, data])), 0);
      return crc;
    })(),
  ]);

  const out: Buffer[] = [PNG_SIGNATURE];
  let offset = 8;
  let inserted = false;

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const chunkType = png.subarray(offset + 4, offset + 8).toString("latin1");
    const end = offset + 12 + length;
    const existing = png.subarray(offset, end);

    const isSameKeyword =
      chunkType === "tEXt" && png.subarray(offset + 8, offset + 8 + keyword.length + 1).toString("latin1") === `${keyword}\0`;

    if (!isSameKeyword) out.push(existing);

    if (chunkType === "IHDR" && !inserted) {
      out.push(chunk);
      inserted = true;
    }

    offset = end;
  }

  if (!inserted) throw new Error("Not a PNG: no IHDR chunk");
  return Buffer.concat(out);
}

/** Reads back the text of the first `tEXt` chunk with `keyword`, or null. */
export function readPngTextChunk(png: Buffer, keyword: string): string | null {
  assertPng(png);

  let offset = 8;
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const chunkType = png.subarray(offset + 4, offset + 8).toString("latin1");
    if (chunkType === "tEXt") {
      const data = png.subarray(offset + 8, offset + 8 + length);
      const split = data.indexOf(0);
      if (split > 0 && data.subarray(0, split).toString("latin1") === keyword) {
        return data.subarray(split + 1).toString("latin1");
      }
    }
    offset += 12 + length;
  }
  return null;
}
