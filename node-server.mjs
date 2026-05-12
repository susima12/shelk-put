import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import handler from "./dist/server/server.js";

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = new URL("./dist/client/", import.meta.url);

const MIME = {
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

async function tryServeStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/" || urlPath.endsWith("/")) return false;
  const filePath = new URL("." + urlPath, CLIENT_DIR);
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return false;
    const data = await readFile(filePath);
    const type = MIME[extname(filePath.pathname).toLowerCase()] || "application/octet-stream";
    res.statusCode = 200;
    res.setHeader("content-type", type);
    if (urlPath.startsWith("/assets/")) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    }
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

function toWebRequest(req) {
  const url = `http://${req.headers.host || "localhost"}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv));
    else if (v != null) headers.set(k, String(v));
  }
  const init = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = new ReadableStream({
      start(controller) {
        req.on("data", (c) => controller.enqueue(c));
        req.on("end", () => controller.close());
        req.on("error", (e) => controller.error(e));
      },
    });
    init.duplex = "half";
  }
  return new Request(url, init);
}

const server = createServer(async (req, res) => {
  try {
    if (await tryServeStatic(req, res)) return;
    const webReq = toWebRequest(req);
    const webRes = await handler.fetch(webReq);
    res.statusCode = webRes.status;
    webRes.headers.forEach((value, key) => res.setHeader(key, value));
    if (webRes.body) {
      const reader = webRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
