import { createServer } from "http";
import app from "./app";

const port = process.env.PORT || 3001;

const server = createServer(app);
server.listen(port, () => {
  console.log(`REST API Server running on http://localhost:${port}/`);
  console.log(`API endpoints available at http://localhost:${port}/api/health`);
});

export default server;
