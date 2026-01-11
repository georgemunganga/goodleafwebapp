import serverless from "serverless-http";
import app from "../server/app";

const handler = serverless(app);

// Disable Vercel's default body parsing so Express can handle JSON bodies
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function vercelHandler(req: any, res: any) {
  return handler(req, res);
}
