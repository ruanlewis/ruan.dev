import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Fail loudly on startup if ADMIN_PASSWORD is not provided
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("CRITICAL ERROR: The ADMIN_PASSWORD environment variable is not defined!");
  process.exit(1);
}

// In-memory session tracking
interface Session {
  token: string;
  expiresAt: number;
}
const sessions = new Map<string, Session>();

// Session cleanup sweep every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}, 10 * 60 * 1000);

// Custom rate limiter
interface RateLimitBucket {
  count: number;
  resetTime: number;
}
const rateLimits = new Map<string, RateLimitBucket>();

function rateLimiter(windowMs: number, maxRequests: number, message: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const key = `${String(ip)}-${req.path}`;
    let bucket = rateLimits.get(key);
    if (!bucket || now > bucket.resetTime) {
      bucket = { count: 0, resetTime: now + windowMs };
      rateLimits.set(key, bucket);
    }
    bucket.count++;
    if (bucket.count > maxRequests) {
      return res.status(429).json({ success: false, error: message });
    }
    next();
  };
}

// Custom requireAdmin middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers["authorization"] || req.headers["x-admin-password"];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Unauthorized access - Token missing" });
  }
  const token = (typeof authHeader === "string" ? authHeader : "").replace(/^Bearer\s+/, "");
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return res.status(401).json({ success: false, error: "Unauthorized access - Session invalid or expired" });
  }
  next();
}

// Path to persist project uploads, settings, and contact inquiries on the server instance
const PROJECTS_FILE = path.join(process.cwd(), "custom_projects.json");
const SETTINGS_FILE = path.join(process.cwd(), "settings.json");
const INQUIRIES_FILE = path.join(process.cwd(), "inquiries.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Sync creation of uploads directory
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded image assets statically before any route handling
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper to read settings
function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading settings file:", err);
  }
  return { hideMockData: false };
}

// Helper to save settings
function saveSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving settings file:", err);
  }
}

// Helper to read persisted projects
function getPersistedProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading custom projects file:", err);
  }
  return [];
}

// Helper to write/persist projects
function savePersistedProjects(projects: any[]) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing custom projects file:", err);
  }
}

// Helper to read inquiries
function getPersistedInquiries() {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading inquiries file:", err);
  }
  return [];
}

// Helper to save inquiries
function savePersistedInquiries(inquiries: any[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing inquiries file:", err);
  }
}

// Helper to delete project by ID
function deleteProjectById(id: string): boolean {
  try {
    const projects = getPersistedProjects();
    const projectToDelete = projects.find((p: any) => p.id === id);

    if (projectToDelete && projectToDelete.image && projectToDelete.image.startsWith("/uploads/")) {
      try {
        const fileName = path.basename(projectToDelete.image);
        const filePath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted uploaded image file: ${filePath}`);
        }
      } catch (fileErr) {
        console.error("Error deleting physical upload file:", fileErr);
      }
    }

    const filtered = projects.filter((p: any) => p.id !== id);
    savePersistedProjects(filtered);
    return true;
  } catch (err) {
    console.error("Error deleting custom project:", err);
    return false;
  }
}

// API: Verify password using timing-safe comparison of SHA-256 hashes to prevent password length and matching timing leaks
app.post(
  "/api/auth/verify",
  rateLimiter(60 * 1000, 5, "Too many login attempts. Please try again in 1 minute."),
  (req, res) => {
    const { password } = req.body;
    if (typeof password !== "string") {
      return res.status(400).json({ success: false, error: "Invalid password format" });
    }

    const adminPass = ADMIN_PASSWORD;
    const passHash = crypto.createHash("sha256").update(password).digest();
    const adminHash = crypto.createHash("sha256").update(adminPass).digest();

    if (crypto.timingSafeEqual(passHash, adminHash)) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hour session
      sessions.set(token, { token, expiresAt });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  }
);

// API: Get custom projects
app.get("/api/projects", (req, res) => {
  const customList = getPersistedProjects();
  const settings = getSettings();
  res.json({ 
    success: true, 
    data: customList, 
    hideMockData: settings.hideMockData 
  });
});

// API: Save dynamic project with strong input validation to prevent bloating
app.post("/api/projects", requireAdmin, (req, res) => {
  const newProject = req.body;
  if (!newProject.title || !newProject.category || !newProject.year || !newProject.image) {
    return res.status(400).json({ success: false, error: "Missing required project attributes" });
  }

  // Length caps & types validation to block resource exhaustion
  if (typeof newProject.title !== "string" || newProject.title.length > 150) {
    return res.status(400).json({ success: false, error: "Title must be a string up to 150 characters" });
  }
  if (typeof newProject.category !== "string" || newProject.category.length > 100) {
    return res.status(400).json({ success: false, error: "Category must be a string up to 100 characters" });
  }
  if (typeof newProject.year !== "string" || newProject.year.length > 10) {
    return res.status(400).json({ success: false, error: "Year must be a string up to 10 characters" });
  }
  if (typeof newProject.image !== "string" || newProject.image.length > 20 * 1024 * 1024) {
    return res.status(400).json({ success: false, error: "Image link or payload must be under 20MB" });
  }
  if (newProject.description && (typeof newProject.description !== "string" || newProject.description.length > 1000)) {
    return res.status(400).json({ success: false, error: "Description must be up to 1000 characters" });
  }
  if (newProject.details) {
    if (!Array.isArray(newProject.details) || newProject.details.some((d: any) => typeof d !== "string" || d.length > 500)) {
      return res.status(400).json({ success: false, error: "Details must be an array of strings, each up to 500 characters" });
    }
    if (newProject.details.length > 20) {
      return res.status(400).json({ success: false, error: "Maximum of 20 detail entries allowed" });
    }
  }
  if (newProject.link && (typeof newProject.link !== "string" || newProject.link.length > 1000)) {
    return res.status(400).json({ success: false, error: "Project link must be up to 1000 characters" });
  }

  // Generate safe ID from title if not given
  if (!newProject.id) {
    newProject.id = newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  } else if (typeof newProject.id !== "string" || newProject.id.length > 150) {
    return res.status(400).json({ success: false, error: "Invalid ID specification" });
  }

  const projects = getPersistedProjects();
  const filtered = projects.filter((p: any) => p.id !== newProject.id);
  filtered.push(newProject);
  
  savePersistedProjects(filtered);
  res.json({ success: true, project: newProject });
});

// API: Upload actual PNG/JPG file using base64 payload with magic bytes & extension verification
app.post("/api/upload", requireAdmin, (req, res) => {
  const { fileName, fileType, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ success: false, error: "Missing fileName or base64Data parameter" });
  }

  if (typeof fileName !== "string" || fileName.length > 200) {
    return res.status(400).json({ success: false, error: "Invalid file name specifier" });
  }

  try {
    // Robustly separate base64 data from the data URL prefix using first comma index
    const commaIndex = base64Data.indexOf(",");
    const cleanBase64 = commaIndex !== -1 ? base64Data.substring(commaIndex + 1) : base64Data;
    const buffer = Buffer.from(cleanBase64, "base64");

    // 1. Enforce max size limit (15MB for higher-res portfolio imagery)
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: "Image file exceeds the 15MB size limit" });
    }

    // 2. Strict whitelist file extensions
    const ext = (path.extname(fileName) || ".png").toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, error: "Unsupported file extension" });
    }

    // 3. Simple byte-level signature verification
    let isValidMagic = false;
    if (buffer.length >= 2) {
      const hex = buffer.toString("hex", 0, 4).toUpperCase();
      if (hex.startsWith("89504E47")) {
        isValidMagic = true; // PNG
      } else if (hex.startsWith("FFD8")) {
        isValidMagic = true; // JPEG (FF D8 starts any valid JPEG SOI)
      } else if (hex.startsWith("47494638")) {
        isValidMagic = true; // GIF
      } else if (hex.startsWith("52494646")) {
        isValidMagic = true; // WEBP / RIFF
      }
    }

    if (!isValidMagic) {
      return res.status(400).json({ success: false, error: "Invalid file content signature. Upload failed." });
    }

    const cleanBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueName = `${Date.now()}-${cleanBaseName}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(targetPath, buffer);

    const uploadedUrl = `/uploads/${uniqueName}`;
    res.json({ success: true, url: uploadedUrl });
  } catch (err) {
    console.error("Error writing uploaded file:", err);
    res.status(500).json({ success: false, error: "Could not save file onto the server filesystem" });
  }
});

// API: Purge all dynamic project data, uploaded assets, and hide mock website showcase data
app.post("/api/projects/purge", requireAdmin, (req, res) => {
  try {
    savePersistedProjects([]);

    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const settings = getSettings();
    settings.hideMockData = true;
    saveSettings(settings);

    res.json({ success: true, message: "Purged custom projects, deleted static upload files, and hid mock showcase listings successfully." });
  } catch (err) {
    console.error("Error purging showcase and image data:", err);
    res.status(500).json({ success: false, error: "An unexpected error occurred during the purge sequence." });
  }
});

// API: Restore default mock website showcase data
app.post("/api/projects/restore-mock", requireAdmin, (req, res) => {
  try {
    const settings = getSettings();
    settings.hideMockData = false;
    saveSettings(settings);

    res.json({ success: true, message: "Restored mock website showcase data visibility." });
  } catch (err) {
    console.error("Error restoring mock showcase visibility:", err);
    res.status(500).json({ success: false, error: "Could not restore mock showcase visibility." });
  }
});

// API: Delete a single custom project (DELETE)
app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const success = deleteProjectById(id);
  if (success) {
    res.json({ success: true, message: `Project '${id}' deleted successfully.` });
  } else {
    res.status(500).json({ success: false, error: "Failed to delete project from server." });
  }
});

// API: Delete a single custom project (POST fallback)
app.post("/api/projects/delete", requireAdmin, (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Missing project id" });
  }
  const success = deleteProjectById(id);
  if (success) {
    res.json({ success: true, message: `Project '${id}' deleted successfully.` });
  } else {
    res.status(500).json({ success: false, error: "Failed to delete project from server." });
  }
});

// API: Submit a Contact Inquiry with strict spam defenses, length check, and honey-pot
app.post(
  "/api/contact",
  rateLimiter(60 * 1000, 3, "Too many messages sent. Please wait 1 minute before sending another message."),
  (req, res) => {
    const { name, email, message, honeypot } = req.body;

    // Filter out automated spam instantly via hidden honeypot field
    if (honeypot && honeypot.length > 0) {
      return res.json({ success: true, message: "Inquiry received successfully!" });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return res.status(400).json({ success: false, error: "Invalid name format (maximum 100 characters)" });
    }

    if (typeof email !== "string" || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (typeof message !== "string" || message.trim().length === 0 || message.length > 2000) {
      return res.status(400).json({ success: false, error: "Invalid message content (maximum 2000 characters)" });
    }

    try {
      const inquiries = getPersistedInquiries();
      const newInquiry = {
        id: crypto.randomBytes(8).toString("hex"),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      inquiries.push(newInquiry);
      savePersistedInquiries(inquiries);

      res.json({ success: true, message: "Inquiry received successfully!" });
    } catch (err) {
      console.error("Error saving inquiry:", err);
      res.status(500).json({ success: false, error: "Could not save message onto the server." });
    }
  }
);

// API: Get inquiries list (Admin only)
app.get("/api/inquiries", requireAdmin, (req, res) => {
  const inquiries = getPersistedInquiries();
  res.json({ success: true, data: inquiries });
});

// API: Delete specific inquiry (Admin only)
app.delete("/api/inquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const inquiries = getPersistedInquiries();
    const filtered = inquiries.filter((item: any) => item.id !== id);
    savePersistedInquiries(filtered);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    res.status(500).json({ success: false, error: "Failed to delete inquiry" });
  }
});

// Serve frontend assets (Express v4 format uses app.get('*', ...))
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
