import type { Request, Response } from "express";
// @ts-ignore - importing the pre-bundled CJS output
import * as serverModule from "../dist/server.cjs";

const app: any = (serverModule as any).default ?? serverModule;

export default function handler(req: Request, res: Response) {
  return app(req, res);
}