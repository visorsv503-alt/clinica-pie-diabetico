// Prepara los assets de marca a partir de favicom.PNG (que ya trae alfa):
//   img/escudo.png   -> escudo recortado, con su transparencia (barra y pie)
//   img/favicon.png  -> escudo cuadrado sobre blanco, 128x128
// Uso:  node preparar-marca.mjs
// Ya se corrió: los dos archivos están en img/ y no hay que repetirlo. Solo
// haría falta si cambia el logo. Necesita el paquete `pngjs`; la ruta de abajo
// apunta a una copia que está fuera de esta carpeta, así que en otra
// computadora hay que correr antes `npm i pngjs` y dejar el import en "pngjs".
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "../../../claude videos/mandalo-sv-reel/node_modules/pngjs/lib/png.js";

const aqui = (r) => fileURLToPath(new URL(r, import.meta.url));

const src = PNG.sync.read(readFileSync(aqui("fuentes/favicom.PNG")));
const { width: W, height: H } = src;
const px = (x, y) => (W * y + x) << 2;

// 1. Caja del escudo: solo la parte superior, para dejar fuera el texto del logo.
const limiteTexto = Math.round(H * 0.66);
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < limiteTexto; y++) {
  for (let x = 0; x < W; x++) {
    if (src.data[px(x, y) + 3] > 16) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}

// Cuadrado centrado sobre el escudo, con aire alrededor.
const lado = Math.max(x1 - x0, y1 - y0);
const cajaLado = Math.round(lado * 1.14);
const cx = Math.round((x0 + x1) / 2);
const cy = Math.round((y0 + y1) / 2);
const cajaX = Math.max(0, Math.min(W - cajaLado, cx - Math.round(cajaLado / 2)));
const cajaY = Math.max(0, Math.min(H - cajaLado, cy - Math.round(cajaLado / 2)));
const L = Math.min(cajaLado, W - cajaX, H - cajaY);

console.log(`escudo: ${x0},${y0} → ${x1},${y1} · recorte ${L}x${L} desde ${cajaX},${cajaY}`);

// 2. Escudo recortado, conservando el alfa del original.
const escudo = new PNG({ width: L, height: L });
for (let y = 0; y < L; y++) {
  for (let x = 0; x < L; x++) {
    const i = px(cajaX + x, cajaY + y);
    const o = (L * y + x) << 2;
    escudo.data[o] = src.data[i];
    escudo.data[o + 1] = src.data[i + 1];
    escudo.data[o + 2] = src.data[i + 2];
    escudo.data[o + 3] = src.data[i + 3];
  }
}
writeFileSync(aqui("img/escudo.png"), PNG.sync.write(escudo));

// 3. Favicon: el mismo recorte sobre blanco, reducido a 128x128 con filtro de caja.
const N = 128;
const ico = new PNG({ width: N, height: N });
const paso = L / N;
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    let r = 0, g = 0, b = 0, n = 0;
    const xa = Math.floor(x * paso), xb = Math.min(L, Math.ceil((x + 1) * paso));
    const ya = Math.floor(y * paso), yb = Math.min(L, Math.ceil((y + 1) * paso));
    for (let sy = ya; sy < yb; sy++) {
      for (let sx = xa; sx < xb; sx++) {
        const i = px(cajaX + sx, cajaY + sy);
        const a = src.data[i + 3] / 255;
        r += src.data[i] * a + 255 * (1 - a);
        g += src.data[i + 1] * a + 255 * (1 - a);
        b += src.data[i + 2] * a + 255 * (1 - a);
        n++;
      }
    }
    const o = (N * y + x) << 2;
    ico.data[o] = Math.round(r / n);
    ico.data[o + 1] = Math.round(g / n);
    ico.data[o + 2] = Math.round(b / n);
    ico.data[o + 3] = 255;
  }
}
writeFileSync(aqui("img/favicon.png"), PNG.sync.write(ico));

console.log("listo: img/escudo.png · img/favicon.png");
