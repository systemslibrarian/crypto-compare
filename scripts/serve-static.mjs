import { createServer } from "node:http";
import { resolve } from "node:path";
import compression from "compression";
import handler from "serve-handler";

const args = process.argv.slice(2);
const publicDirectory = resolve(process.cwd(), args[0] ?? "out");
const listenIndex = args.findIndex((arg) => arg === "-l" || arg === "--listen");
const port = Number(listenIndex >= 0 ? args[listenIndex + 1] : 3000);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Invalid port: ${listenIndex >= 0 ? args[listenIndex + 1] : port}`);
}

const compress = compression();
const server = createServer((request, response) => {
  compress(request, response, (compressionError) => {
    if (compressionError) {
      response.statusCode = 500;
      response.end("Compression failed");
      return;
    }

    handler(request, response, { public: publicDirectory }).catch((error) => {
      console.error(error);
      if (!response.headersSent) response.statusCode = 500;
      response.end("Static server failed");
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${publicDirectory} at http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
