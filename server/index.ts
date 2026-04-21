import express from "express";
import { createServer } from "http";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const server = createServer(app);

  const bundledStaticPath = path.resolve(__dirname, "public");
  const fallbackStaticPath = path.resolve(__dirname, "..", "dist", "public");
  const staticPath = fs.existsSync(bundledStaticPath) ? bundledStaticPath : fallbackStaticPath;

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
