import { readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { deflateSync, inflateSync } from 'zlib'

// ------- PNG -------
function crc32(buf) {
  let c,
    crc = 0xffffffff
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function encodePng(w, h, rgba) {
  const stride = w * 4 + 1
  const raw = Buffer.alloc(stride * h)
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0
    rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG')
  let off = 8,
    w = 0,
    h = 0,
    bitDepth = 8,
    colorType = 6,
    idat = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off),
      type = buf.toString('ascii', off + 4, off + 8)
    const data = buf.subarray(off + 8, off + 8 + len)
    if (type === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    }
    if (type === 'IDAT') idat.push(data)
    off += 12 + len
  }
  if (bitDepth !== 8) throw new Error('bit depth ' + bitDepth + ' unsupported')
  const ch =
    colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : colorType === 4 ? 2 : 0
  if (!ch) throw new Error('color type ' + colorType + ' unsupported')
  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * ch
  const px = Buffer.alloc(w * h * 4)
  let pos = 0
  const lines = []
  for (let y = 0; y < h; y++) {
    const f = raw[pos++]
    const line = Buffer.from(raw.subarray(pos, pos + stride))
    pos += stride
    const prev = y > 0 ? lines[y - 1] : Buffer.alloc(stride)
    const out = Buffer.alloc(stride)
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? line[x - ch] : 0
      const b = prev[x]
      const c = x >= ch ? prev[x - ch] : 0
      let v = line[x]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) {
        const p = a + b - c,
          pa = Math.abs(p - a),
          pb = Math.abs(p - b),
          pc = Math.abs(p - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      out[x] = v & 0xff
    }
    lines.push(out)
    const o = y * w * 4
    for (let x = 0; x < w; x++) {
      const s = x * ch
      if (ch === 4) {
        px[o + x * 4] = out[s]
        px[o + x * 4 + 1] = out[s + 1]
        px[o + x * 4 + 2] = out[s + 2]
        px[o + x * 4 + 3] = out[s + 3]
      } else if (ch === 3) {
        px[o + x * 4] = out[s]
        px[o + x * 4 + 1] = out[s + 1]
        px[o + x * 4 + 2] = out[s + 2]
        px[o + x * 4 + 3] = 255
      } else if (ch === 2) {
        const g = out[s]
        px[o + x * 4] = g
        px[o + x * 4 + 1] = g
        px[o + x * 4 + 2] = g
        px[o + x * 4 + 3] = out[s + 1]
      } else {
        const g = out[s]
        px[o + x * 4] = g
        px[o + x * 4 + 1] = g
        px[o + x * 4 + 2] = g
        px[o + x * 4 + 3] = 255
      }
    }
  }
  return { w, h, px }
}

// ------- resize / crop -------
function resize(src, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4)
  const xr = src.w / dw,
    yr = src.h / dh
  for (let y = 0; y < dh; y++) {
    const sy0 = Math.floor(y * yr),
      sy1 = Math.min(src.h - 1, Math.floor((y + 1) * yr - 1e-9))
    for (let x = 0; x < dw; x++) {
      const sx0 = Math.floor(x * xr),
        sx1 = Math.min(src.w - 1, Math.floor((x + 1) * xr - 1e-9))
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        n = 0
      for (let sy = sy0; sy <= sy1; sy++)
        for (let sx = sx0; sx <= sx1; sx++) {
          const i = (sy * src.w + sx) * 4
          const al = src.px[i + 3] / 255
          r += src.px[i] * al
          g += src.px[i + 1] * al
          b += src.px[i + 2] * al
          a += src.px[i + 3]
          n++
        }
      const o = (y * dw + x) * 4
      if (a > 0) {
        out[o] = Math.min(255, Math.round((r / a) * 255))
        out[o + 1] = Math.min(255, Math.round((g / a) * 255))
        out[o + 2] = Math.min(255, Math.round((b / a) * 255))
      }
      out[o + 3] = Math.round(a / n)
    }
  }
  return { w: dw, h: dh, px: out }
}
function crop(src, cx, cy, cw, chh) {
  const out = Buffer.alloc(cw * chh * 4)
  for (let y = 0; y < chh; y++)
    for (let x = 0; x < cw; x++) {
      const s = ((cy + y) * src.w + (cx + x)) * 4,
        o = (y * cw + x) * 4
      out[o] = src.px[s]
      out[o + 1] = src.px[s + 1]
      out[o + 2] = src.px[s + 2]
      out[o + 3] = src.px[s + 3]
    }
  return { w: cw, h: chh, px: out }
}

// ------- JPEG -------
const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20,
  13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52,
  45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
]
const YQT = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113,
  92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99,
]
const CQT = [
  17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 47, 99, 99, 99, 99, 99, 99,
  47, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
]

function encodeJpeg(px, w, h, quality = 82) {
  const Y = new Float32Array(w * h),
    Cb = new Float32Array(w * h),
    Cr = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4],
      g = px[i * 4 + 1],
      b = px[i * 4 + 2]
    Y[i] = 0.299 * r + 0.587 * g + 0.114 * b - 128
    Cb[i] = -0.168736 * r - 0.331264 * g + 0.5 * b
    Cr[i] = 0.5 * r - 0.418688 * g - 0.081312 * b
  }
  const qp = quality < 50 ? 5000 / quality : 200 - quality * 2
  function qt(base) {
    const t = new Int32Array(64)
    for (let i = 0; i < 64; i++) {
      t[ZIGZAG[i]] = Math.max(1, Math.min(255, Math.floor((base[ZIGZAG[i]] * qp + 50) / 100)))
    }
    return t
  }

  const DC_L = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    DC_V = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const AC_L = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d],
    AC_V = []
  for (let i = 0; i < 162; i++) AC_V.push(i + 1)
  function buildHuff(bits, vals) {
    const codes = {}
    let code = 0,
      k = 0
    for (let l = 1; l <= 16; l++) {
      for (let i = 0; i < bits[l - 1]; i++) {
        codes[vals[k]] = [code, l]
        code++
        k++
      }
      code <<= 1
    }
    return codes
  }
  const dcCodes = buildHuff(DC_L, DC_V),
    acCodes = buildHuff(AC_L, AC_V)

  const out = []
  const w16 = (v) => {
    out.push((v >> 8) & 0xff, v & 0xff)
  }
  for (const tbl of [qt(YQT), qt(CQT)]) {
    out.push(0xff, 0xdb)
    w16(67)
    out.push(0)
    for (let i = 0; i < 64; i++) out.push(tbl[ZIGZAG[i]])
  }
  out.push(0xff, 0xc0)
  w16(17)
  out.push(8)
  w16(h)
  w16(w)
  out.push(3)
  out.push(1, 1, 1, 0, 2, 1, 1, 1, 3, 1, 1, 1)
  for (const [id, bits, vals] of [
    [0x00, DC_L, DC_V],
    [0x01, AC_L, AC_V],
    [0x10, DC_L, DC_V],
    [0x11, AC_L, AC_V],
  ]) {
    out.push(0xff, 0xc4)
    let total = 0
    for (let i = 0; i < 16; i++) total += bits[i]
    w16(2 + 1 + 16 + total)
    out.push(id)
    for (let i = 0; i < 16; i++) out.push(bits[i])
    for (const v of vals) out.push(v)
  }
  out.push(0xff, 0xda)
  w16(12)
  out.push(3)
  out.push(1, 0x00, 2, 0x11, 3, 0x11, 0, 63, 0)

  const COS = []
  for (let u = 0; u < 8; u++) {
    COS[u] = []
    for (let x = 0; x < 8; x++) COS[u][x] = Math.cos(((2 * x + 1) * u * Math.PI) / 16)
  }
  function fdct(blk) {
    for (let u = 0; u < 8; u++)
      for (let v = 0; v < 8; v++) {
        let s = 0
        for (let x = 0; x < 8; x++)
          for (let y = 0; y < 8; y++) {
            s += blk[y * 8 + x] * COS[u][x] * COS[v][y]
          }
        const cu = u === 0 ? 1 / Math.SQRT2 : 1,
          cv = v === 0 ? 1 / Math.SQRT2 : 1
        fdt[v * 8 + u] = 0.25 * cu * cv * s
      }
  }
  const fdt = new Float64Array(64)
  const qL = qt(YQT),
    qC = qt(CQT)
  const prevDC = [0, 0, 0]
  const outBits = []
  let acc = 0,
    nbits = 0
  function putBit(v, n) {
    for (let i = n - 1; i >= 0; i--) {
      acc = (acc << 1) | ((v >> i) & 1)
      if (++nbits === 8) {
        outBits.push(acc)
        acc = 0
        nbits = 0
      }
    }
  }
  function flushBits() {
    while (nbits < 8) {
      acc = (acc << 1) | 1
      nbits++
    }
    outBits.push(acc)
  }
  function encodeBlock(comp, bx, by) {
    const plane = comp === 0 ? Y : comp === 1 ? Cb : Cr
    const blk = new Float32Array(64)
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        const gy = by * 8 + y,
          gx = bx * 8 + x
        blk[y * 8 + x] = gy < h && gx < w ? plane[gy * w + gx] : 0
      }
    fdct(blk)
    const q = comp === 0 ? qL : qC
    const coef = new Int32Array(64)
    for (let i = 0; i < 64; i++) coef[i] = Math.round(fdt[i] / q[i])
    const diff = coef[0] - prevDC[comp]
    prevDC[comp] = coef[0]
    let s = 0,
      a2 = Math.abs(diff)
    while (a2) {
      s++
      a2 >>= 1
    }
    const dcC = dcCodes[s]
    putBit(dcC[0], dcC[1])
    if (s) putBit(diff < 0 ? diff - 1 : diff, s)
    let run = 0
    for (let k = 1; k < 64; k++) {
      const c = coef[ZIGZAG[k]]
      if (c === 0) {
        run++
        continue
      }
      while (run > 15) {
        putBit(acCodes[0xf0][0], acCodes[0xf0][1])
        run -= 16
      }
      let ss = 0,
        aa = Math.abs(c)
      while (aa) {
        ss++
        aa >>= 1
      }
      const acC = acCodes[(run << 4) | ss]
      putBit(acC[0], acC[1])
      putBit(c < 0 ? c - 1 : c, ss)
      run = 0
    }
    putBit(acCodes[0][0], acCodes[0][1])
  }

  for (let by = 0; by < Math.ceil(h / 8); by++) {
    for (let bx = 0; bx < Math.ceil(w / 8); bx++) {
      encodeBlock(0, bx, by)
      encodeBlock(1, bx, by)
      encodeBlock(2, bx, by)
    }
  }
  flushBits()

  const bytes = Buffer.alloc(outBits.length * 2 + 16)
  let bi = 0
  for (const b of outBits) {
    bytes[bi++] = b & 0xff
    if ((b & 0xff) === 0xff) bytes[bi++] = 0
  }
  return Buffer.concat([Buffer.from(out), bytes.subarray(0, bi), Buffer.from([0xff, 0xd9])])
}

// ------- main -------
const PHOTO = 'src/assets/image-2d172.png'
const LOGO = 'src/assets/image-9b520.png'
if (!existsSync(PHOTO) || !existsSync(LOGO)) {
  console.error(
    'originais não encontrados (rode save_uploaded_assets antes): ' + PHOTO + ', ' + LOGO,
  )
  process.exit(1)
}
const photo = decodePng(readFileSync(PHOTO))
const logo = decodePng(readFileSync(LOGO))
console.log('photo', photo.w, 'x', photo.h, '| logo', logo.w, 'x', logo.h)

// 1. foto: recorte 4:5 (largura total, topo) → 800×1000 JPEG
{
  const target = 4 / 5
  let cw = photo.w,
    chh = Math.round(cw / target)
  if (chh > photo.h) {
    chh = photo.h
    cw = Math.round(chh * target)
  }
  const cx = Math.max(0, Math.min(photo.w - cw, Math.round((photo.w - cw) / 2)))
  const cy = Math.max(0, Math.min(photo.h - chh, 0))
  const c = crop(photo, cx, cy, cw, chh)
  const out = resize(c, 800, 1000)
  writeFileSync('public/images/psicologa.jpg', encodeJpeg(out.px, 800, 1000, 82))
  console.log(
    'psicologa.jpg written (800x1000, ' + statSync('public/images/psicologa.jpg').size + ' bytes)',
  )
}

// 2. logo: quadrado completo → 480×480 JPEG
{
  const l = resize(logo, 480, 480)
  writeFileSync('public/images/logo.jpg', encodeJpeg(l.px, 480, 480, 88))
  console.log('logo.jpg written (480x480, ' + statSync('public/images/logo.jpg').size + ' bytes)')
}

// 3. monograma: recorte central do logo → favicon PNG
{
  const side = Math.min(logo.w, logo.h)
  const cw = Math.round(side * 0.5),
    chh = Math.round(side * 0.5)
  const cx = Math.round((logo.w - cw) * 0.5),
    cy = Math.round((logo.h - chh) * 0.42)
  const mono = crop(logo, cx, cy, cw, chh)
  writeFileSync('favicon.png', encodePng(48, 48, resize(mono, 48, 48).px))
  writeFileSync('public/images/favicon-180.png', encodePng(180, 180, resize(mono, 180, 180).px))
  writeFileSync('public/images/favicon-512.png', encodePng(512, 512, resize(mono, 512, 512).px))
  console.log('favicon.png (48) + favicon-180.png + favicon-512.png written')
}
