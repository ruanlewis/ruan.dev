import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zrjrtwccwpbwtkzzcvuc.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanJ0d2Njd3Bid3RrenpjdnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyOTUyMTIsImV4cCI6MjA5OTg3MTIxMn0.6Ma7TpGXQxbQwqrVwWQQc9Ui5-Seho1YIUup5tgiAjY";

let supabase: any = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http")) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn("Supabase credentials are not fully configured or invalid. Falling back to local JSON file persistence.");
  }
} catch (err) {
  console.warn("Supabase client failed to initialize (will use local JSON file fallback):", err);
}

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Warn if ADMIN_PASSWORD is not provided, fallback to allow server setup
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_temp_secure_password";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("WARNING: The ADMIN_PASSWORD environment variable is not defined! Using default fallback password.");
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
// On Vercel, use the writable /tmp directory to avoid EROFS (Read-only file system) errors
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;

const PROJECTS_FILE = isVercel ? "/tmp/custom_projects.json" : path.join(process.cwd(), "custom_projects.json");
const SETTINGS_FILE = isVercel ? "/tmp/settings.json" : path.join(process.cwd(), "settings.json");
const INQUIRIES_FILE = isVercel ? "/tmp/inquiries.json" : path.join(process.cwd(), "inquiries.json");
const UPLOADS_DIR = isVercel ? "/tmp/uploads" : path.join(process.cwd(), "uploads");
const UPLOADS_METADATA_FILE = isVercel ? "/tmp/custom_uploads.json" : path.join(process.cwd(), "custom_uploads.json");

// Sync creation of uploads directory (skip on Vercel — read-only filesystem)
if (process.env.VERCEL !== "1" && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded image assets statically before any route handling
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper to read persisted uploads metadata
async function getPersistedUploads() {
  try {
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Failed reading uploads from Supabase, trying local fallback:", err);
  }

  try {
    if (fs.existsSync(UPLOADS_METADATA_FILE)) {
      const data = fs.readFileSync(UPLOADS_METADATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local custom uploads file:", err);
  }
  return [];
}

// Helper to write/persist uploads metadata
async function savePersistedUploads(uploads: any[]) {
  try {
    for (const upload of uploads) {
      await supabase
        .from("uploads")
        .upsert({
          id: upload.id,
          filename: upload.filename,
          url: upload.url,
          size: upload.size,
          created_at: upload.created_at
        });
    }
  } catch (err) {
    console.warn("Failed writing uploads to Supabase, trying local fallback:", err);
  }

  try {
    fs.writeFileSync(UPLOADS_METADATA_FILE, JSON.stringify(uploads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local custom uploads file:", err);
  }
}

// Helper to delete an upload
async function deleteUploadById(id: string): Promise<boolean> {
  try {
    await supabase.from("uploads").delete().eq("id", id);
  } catch (err) {
    console.warn("Failed deleting upload from Supabase:", err);
  }

  try {
    // Also delete the physical file
    const filePath = path.join(UPLOADS_DIR, id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted uploaded file on disk: ${filePath}`);
    }
  } catch (err) {
    console.error("Error deleting local file from disk:", err);
  }

  try {
    const uploads = await getPersistedUploads();
    const filtered = uploads.filter((u: any) => u.id !== id);
    fs.writeFileSync(UPLOADS_METADATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error updating local custom uploads file:", err);
    return false;
  }
}

// Helper to read settings
async function getSettings() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "app_settings")
      .single();
    if (!error && data) {
      return data.value;
    }
  } catch (err) {
    console.warn("Failed reading settings from Supabase, trying local fallback:", err);
  }

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local settings file:", err);
  }
  return { hideMockData: false, hiddenProjectIds: [] };
}

// Helper to save settings
async function saveSettings(settings: any) {
  try {
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "app_settings", value: settings });
    if (!error) return;
  } catch (err) {
    console.warn("Failed saving settings to Supabase, trying local fallback:", err);
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local settings file:", err);
  }
}

// Helper to read persisted projects
async function getPersistedProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) {
      return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        image: p.image,
        description: p.description,
        details: Array.isArray(p.details) ? p.details : [],
        link: p.link
      }));
    }
  } catch (err) {
    console.warn("Failed reading projects from Supabase, trying local fallback:", err);
  }

  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local custom projects file:", err);
  }
  return [];
}

// Helper to write/persist projects
async function savePersistedProjects(projects: any[]) {
  try {
    // Upsert projects to Supabase
    for (const project of projects) {
      await supabase
        .from("projects")
        .upsert({
          id: project.id,
          title: project.title,
          category: project.category,
          year: project.year,
          image: project.image,
          description: project.description,
          details: project.details || [],
          link: project.link
        });
    }
  } catch (err) {
    console.warn("Failed writing projects to Supabase, trying local fallback:", err);
  }

  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local custom projects file:", err);
  }
}

// Helper to read inquiries
async function getPersistedInquiries() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("timestamp", { ascending: false });
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Failed reading inquiries from Supabase, trying local fallback:", err);
  }

  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local inquiries file:", err);
  }
  return [];
}

// Helper to save inquiries
async function savePersistedInquiries(inquiries: any[]) {
  try {
    for (const inq of inquiries) {
      await supabase
        .from("inquiries")
        .upsert({
          id: inq.id,
          name: inq.name,
          email: inq.email,
          message: inq.message,
          timestamp: inq.timestamp
        });
    }
  } catch (err) {
    console.warn("Failed writing inquiries to Supabase, trying local fallback:", err);
  }

  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local inquiries file:", err);
  }
}

// Helper to delete project by ID
async function deleteProjectById(id: string): Promise<boolean> {
  const DEFAULT_IDS = ["new-york-edit", "studio-axon", "nova-systems", "muralis-art"];
  if (DEFAULT_IDS.includes(id)) {
    try {
      const settings = await getSettings();
      settings.hiddenProjectIds = settings.hiddenProjectIds || [];
      if (!settings.hiddenProjectIds.includes(id)) {
        settings.hiddenProjectIds.push(id);
      }
      await saveSettings(settings);
      return true;
    } catch (err) {
      console.error("Error hiding default project:", err);
      return false;
    }
  }

  try {
    await supabase.from("projects").delete().eq("id", id);
  } catch (err) {
    console.warn("Failed deleting project from Supabase:", err);
  }

  try {
    const projects = await getPersistedProjects();
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
    try {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing local custom projects file fallback:", err);
    }
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
app.get("/api/projects", async (req, res) => {
  const customList = await getPersistedProjects();
  const settings = await getSettings();
  res.json({ 
    success: true, 
    data: customList, 
    hideMockData: settings.hideMockData,
    hiddenProjectIds: settings.hiddenProjectIds || [],
    customParallaxImages: settings.customParallaxImages || {}
  });
});

// API: Save custom parallax images configuration
app.post("/api/settings/parallax", requireAdmin, async (req, res) => {
  const { customParallaxImages } = req.body;
  if (!customParallaxImages || typeof customParallaxImages !== "object") {
    return res.status(400).json({ success: false, error: "Invalid customParallaxImages parameter" });
  }
  const settings = await getSettings();
  settings.customParallaxImages = customParallaxImages;
  await saveSettings(settings);
  res.json({ success: true, customParallaxImages: settings.customParallaxImages });
});

// API: Save dynamic project with strong input validation to prevent bloating
app.post("/api/projects", requireAdmin, async (req, res) => {
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

  const projects = await getPersistedProjects();
  const filtered = projects.filter((p: any) => p.id !== newProject.id);
  filtered.push(newProject);
  
  await savePersistedProjects(filtered);
  res.json({ success: true, project: newProject });
});


// API: Upload actual PNG/JPG file using base64 payload with magic bytes & extension verification
app.post("/api/upload", requireAdmin, async (req, res) => {
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
      const hex = buffer.subarray(0, 4).toString("hex").toUpperCase();
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
      const detectedHex = buffer.subarray(0, 8).toString("hex").toUpperCase();
      console.warn(`Upload signature verification failed. Extension: ${ext}, Detected hex header: ${detectedHex}`);
      return res.status(400).json({ success: false, error: `Invalid file content signature (header: ${detectedHex}). Upload failed.` });
    }

    const cleanBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueName = `${Date.now()}-${cleanBaseName}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(targetPath, buffer);

    const uploadedUrl = `/uploads/${uniqueName}`;

    // Track upload in database and local file
    try {
      const uploads = await getPersistedUploads();
      const newUpload = {
        id: uniqueName,
        filename: fileName,
        url: uploadedUrl,
        size: buffer.length,
        created_at: new Date().toISOString()
      };
      uploads.push(newUpload);
      await savePersistedUploads(uploads);
    } catch (trackErr) {
      console.warn("Could not record uploaded file metadata in database:", trackErr);
    }

    res.json({ success: true, url: uploadedUrl });
  } catch (err) {
    console.error("Error writing uploaded file:", err);
    res.status(500).json({ success: false, error: "Could not save file onto the server filesystem" });
  }
});

// API: Get all custom uploaded files (Admin only)
app.get("/api/uploads", requireAdmin, async (req, res) => {
  try {
    const uploads = await getPersistedUploads();
    res.json({ success: true, data: uploads });
  } catch (err) {
    console.error("Error fetching uploads:", err);
    res.status(500).json({ success: false, error: "Failed to fetch uploads." });
  }
});

// API: Delete a single custom upload (DELETE)
app.delete("/api/uploads/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteUploadById(id);
    if (success) {
      res.json({ success: true, message: `Upload '${id}' deleted successfully.` });
    } else {
      res.status(500).json({ success: false, error: "Failed to delete upload from server." });
    }
  } catch (err) {
    console.error("Error deleting upload:", err);
    res.status(500).json({ success: false, error: "Could not delete upload." });
  }
});

// API: Delete a single custom upload (POST fallback for firewalls)
app.post("/api/uploads/delete", requireAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Missing upload id" });
  }
  try {
    const success = await deleteUploadById(id);
    if (success) {
      res.json({ success: true, message: `Upload '${id}' deleted successfully.` });
    } else {
      res.status(500).json({ success: false, error: "Failed to delete upload from server." });
    }
  } catch (err) {
    console.error("Error deleting upload:", err);
    res.status(500).json({ success: false, error: "Could not delete upload." });
  }
});

// API: Purge all dynamic project data, uploaded assets, and hide mock website showcase data
app.post("/api/projects/purge", requireAdmin, async (req, res) => {
  try {
    // 1. Purge Supabase tables
    try {
      await supabase.from("projects").delete().neq("id", "placeholder-not-exist");
      await supabase.from("inquiries").delete().neq("id", "placeholder-not-exist");
      await supabase.from("settings").delete().eq("key", "app_settings");
      await supabase.from("uploads").delete().neq("id", "placeholder-not-exist");
    } catch (dbErr) {
      console.warn("Could not delete from Supabase on purge:", dbErr);
    }

    // 2. Clear local file backup
    await savePersistedProjects([]);
    try {
      fs.writeFileSync(UPLOADS_METADATA_FILE, "[]", "utf-8");
    } catch (e) {
      console.warn("Could not clear custom_uploads.json file fallback:", e);
    }

    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const settings = await getSettings();
    settings.hideMockData = true;
    settings.customParallaxImages = {};
    await saveSettings(settings);

    res.json({ success: true, message: "Purged custom projects, deleted static upload files, and hid mock showcase listings successfully." });
  } catch (err) {
    console.error("Error purging showcase and image data:", err);
    res.status(500).json({ success: false, error: "An unexpected error occurred during the purge sequence." });
  }
});

// API: Restore default mock website showcase data
app.post("/api/projects/restore-mock", requireAdmin, async (req, res) => {
  try {
    const settings = await getSettings();
    settings.hideMockData = false;
    settings.hiddenProjectIds = [];
    await saveSettings(settings);

    res.json({ success: true, message: "Restored mock website showcase data visibility and all default case studies." });
  } catch (err) {
    console.error("Error restoring mock showcase visibility:", err);
    res.status(500).json({ success: false, error: "Could not restore mock showcase visibility." });
  }
});

// API: Restore a single hidden default project (POST)
app.post("/api/projects/restore", requireAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Missing project id" });
  }
  try {
    const settings = await getSettings();
    settings.hiddenProjectIds = (settings.hiddenProjectIds || []).filter((hId: string) => hId !== id);
    await saveSettings(settings);
    res.json({ success: true, message: `Project '${id}' restored successfully.` });
  } catch (err) {
    console.error("Error restoring hidden project:", err);
    res.status(500).json({ success: false, error: "Could not restore project." });
  }
});

// API: Delete a single custom project (DELETE)
app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const success = await deleteProjectById(id);
  if (success) {
    res.json({ success: true, message: `Project '${id}' deleted successfully.` });
  } else {
    res.status(500).json({ success: false, error: "Failed to delete project from server." });
  }
});

// API: Delete a single custom project (POST fallback)
app.post("/api/projects/delete", requireAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Missing project id" });
  }
  const success = await deleteProjectById(id);
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
  async (req, res) => {
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
      const inquiries = await getPersistedInquiries();
      const newInquiry = {
        id: crypto.randomBytes(8).toString("hex"),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      inquiries.push(newInquiry);
      await savePersistedInquiries(inquiries);

      // Extract and log package selection details in the message console / server log
      const packageMatch = message.match(/\[Selected Service Package\]\s*([^\n]+)/);
      const selectedPkg = packageMatch ? packageMatch[1].trim() : "Not Specified";
      console.log(`[Contact API] Inquiry successfully logged for: ${name.trim()} (${email.trim()}) - Chosen Package: ${selectedPkg}`);

      res.json({ success: true, message: "Inquiry received successfully!" });
    } catch (err) {
      console.error("Error saving inquiry:", err);
      res.status(500).json({ success: false, error: "Could not save message onto the server." });
    }
  }
);

// API: Get inquiries list (Admin only)
app.get("/api/inquiries", requireAdmin, async (req, res) => {
  const inquiries = await getPersistedInquiries();
  res.json({ success: true, data: inquiries });
});

// API: Delete specific inquiry (Admin only)
app.delete("/api/inquiries/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const inquiries = await getPersistedInquiries();
    const filtered = inquiries.filter((item: any) => item.id !== id);
    await savePersistedInquiries(filtered);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    res.status(500).json({ success: false, error: "Failed to delete inquiry" });
  }
});


// Serve frontend assets (Express v4 format uses app.get('*', ...))
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

// Only start the server if not running inside a Vercel serverless environment
if (process.env.VERCEL !== "1" && process.env.VERCEL_ENV === undefined) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
