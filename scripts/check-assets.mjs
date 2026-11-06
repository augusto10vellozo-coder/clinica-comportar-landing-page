import { readFileSync, existsSync, statSync } from 'fs'

// Verifica se os assets derivados existem e são imagens válidas.
const files = [
  'public/images/psicologa.jpg',
  'public/images/logo.jpg',
  'favicon.png',
  'public/images/favicon-180.png',
  'public/images/favicon-512.png',
]
let ok = true
for (const f of files) {
  if (!existsSync(f)) {
    console.error('MISSING: ' + f)
    ok = false
    continue
  }
  const buf = readFileSync(f)
  const isPng = buf.readUInt32BE(0) === 0x89504e47
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8
  if (!isPng && !isJpg) {
    console.error('INVALID: ' + f)
    ok = false
    continue
  }
  let dims = ''
  if (isPng) dims = 'PNG ' + buf.readUInt32BE(16) + 'x' + buf.readUInt32BE(20)
  else {
    let off = 2,
      w = 0,
      h = 0
    while (off < buf.length - 9) {
      if (buf[off] !== 0xff) {
        off++
        continue
      }
      const m = buf[off + 1]
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        h = (buf[off + 5] << 8) | buf[off + 6]
        w = (buf[off + 7] << 8) | buf[off + 8]
        break
      }
      const len = (buf[off + 2] << 8) | buf[off + 3]
      off += 2 + len
    }
    dims = 'JPEG ' + w + 'x' + h
  }
  console.log(f.padEnd(34), statSync(f).size.toString().padStart(7), 'bytes ', dims)
}
if (!ok) process.exitCode = 1
