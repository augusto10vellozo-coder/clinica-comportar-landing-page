# Derivação de assets reais (foto e logo enviados pela usuária)

Este script converte os originais enviados em PNG
(`src/assets/image-2d172.png` = foto da psicóloga, `src/assets/image-9b520.png` = logo NM)
nos assets estáticos usados pela landing page:

```
node scripts/derive-assets.mjs
```

Saída:
- `public/images/psicologa.jpg` (800×1000, recorte 4:5)
- `public/images/logo.jpg` (480×480)
- `favicon.png` (48×48, monograma NM)
- `public/images/favicon-180.png` / `public/images/favicon-512.png`

O script é JS puro (sem dependências além do `zlib` do Node) e roda uma
única vez — os arquivos gerados ficam versionados no repositório.
