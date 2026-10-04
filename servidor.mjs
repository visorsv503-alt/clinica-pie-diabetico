// Servidor estático para ver el sitio en local:  node servidor.mjs
// Luego abrir http://localhost:4700
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL(".", import.meta.url));
const PUERTO = 4700;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer(async (pedido, respuesta) => {
  try {
    const ruta = decodeURIComponent(new URL(pedido.url, "http://localhost").pathname);
    let archivo = join(RAIZ, normalize(ruta).replace(/^([/\\])+/, ""));
    if (!archivo.startsWith(RAIZ)) {
      respuesta.writeHead(403).end("Prohibido");
      return;
    }
    const info = await stat(archivo).catch(() => null);
    if (!info || info.isDirectory()) archivo = join(archivo, "index.html");

    const cuerpo = await readFile(archivo);
    respuesta.writeHead(200, {
      "Content-Type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    respuesta.end(cuerpo);
  } catch {
    respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    respuesta.end("No encontrado");
  }
}).listen(PUERTO, () => console.log(`Sitio en http://localhost:${PUERTO}`));
