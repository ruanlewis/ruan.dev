import type { Request, Response } from "express";
// @ts-ignore - importing the pre-bundled CJS output
import app from "../dist/server.cjs";

export default function handler(req: Request, res: Response) {
  return app(req, res);
}