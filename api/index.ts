import type { Request, Response } from "express";
// @ts-ignore - importing the pre-bundled CJS output
import * as serverModule from "../dist/server.cjs";

const mod: any = serverModule as any;
const app: any = mod.app ?? mod.default?.default ?? mod.default ?? mod;

export default function handler(req: Request, res: Response) {
  return app(req, res);
}