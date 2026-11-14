"""Draws the pixel app icons (no image libraries needed) into site/icons/."""
import zlib, struct, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "icons"; OUT.mkdir(parents=True, exist_ok=True)
N, G, W, S = (0x14,0x20,0x2E), (0xF4,0xB4,0x00), (0xFF,0xF3,0xCC), (0x62,0xAD,0xEB)
# 16x16: night sky, the gold building with lit windows, a street
ART = [
 "................",
 "......w.........",
 "................",
 "....GGGGGGGG....",
 "....GwGwGwGG....",
 "....GGGGGGGG....",
 "....GwGwGwGG..w.",
 "..GGGGGGGGGGGG..",
 "..GwGGwGGwGGwG..",
 "..GGGGGGGGGGGG..",
 "..GwGGwGGwGGwG..",
 "..GGGGGGGGGGGG..",
 "..GGGGG..GGGGG..",
 "..GGGGG..GGGGG..",
 "SSSSSSSSSSSSSSSS",
 "SSSSSSSSSSSSSSSS",
]
def png(size, pad):
    cell = (size - 2 * pad) // 16; off = (size - cell * 16) // 2
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            gx, gy = (x - off) // cell, (y - off) // cell
            c = N
            if 0 <= gx < 16 and 0 <= gy < 16:
                ch = ART[gy][gx]
                c = {"G": G, "w": W, "S": S}.get(ch, N)
            row += bytes(c)
        rows.append(bytes(row))
    raw = zlib.compress(b"".join(rows), 9)
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)) + chunk(b"IDAT", raw) + chunk(b"IEND", b"")
for name, size, pad in [("icon-192.png", 192, 16), ("icon-512.png", 512, 40), ("maskable-512.png", 512, 104), ("apple-touch-icon.png", 180, 14), ("favicon-32.png", 32, 0)]:
    (OUT / name).write_bytes(png(size, pad))
print("icons written")
