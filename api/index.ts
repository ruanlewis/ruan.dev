import { Request, Response } from "express";

let app: any;
let errorOnLoad: any = null;

try {
  const serverModule = await import("../server.ts");
  app = serverModule.default;
} catch (err: any) {
  console.error("CRITICAL Startup Error:", err);
  errorOnLoad = err;
}

export default async function handler(req: Request, res: Response) {
  if (errorOnLoad) {
    res.status(500).json({
      success: false,
      error: "Express server failed to initialize on Vercel.",
      message: errorOnLoad.message,
      stack: errorOnLoad.stack ? errorOnLoad.stack.toString() : "No stack trace available"
    });
    return;
  }
  
  if (!app) {
    res.status(500).json({
      success: false,
      error: "Express app instance is undefined on Vercel."
    });
    return;
  }

  // Delegate the request to the express app
  return app(req, res);
}
