import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Unlock, Eye, EyeOff, Plus, Trash2, ArrowUpRight, Upload, AlertCircle, CheckCircle2, Inbox, Mail } from "lucide-react";
import { Project } from "../types";
import { PROJECTS } from "../data";
import nyEditImg from "../assets/images/new_york_edit_screenshot_1782938321194.jpg";
import studioAxonImg from "../assets/images/studio_axon_screenshot_1782938345687.jpg";
import novaSystemsImg from "../assets/images/nova_systems_screenshot_1782938360537.jpg";
import muralisArtImg from "../assets/images/muralis_art_screenshot_1782938374136.jpg";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
  projects: Project[];
}

// Gorgeous curated local placeholders so they can easily create beautiful assets instantly
const PRESET_IMAGES = [
  {
    name: "Luxury Editorial (The New York Edit)",
    url: nyEditImg
  },
  {
    name: "Brutalist Concrete (Studio Axon)",
    url: studioAxonImg
  },
  {
    name: "Premium Tactical Hardware (Nova Systems)",
    url: novaSystemsImg
  },
  {
    name: "Swiss Fine Art (Muralis Art)",
    url: muralisArtImg
  }
];

export default function AdminPortal({ isOpen, onClose, onProjectAdded, projects }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // New Project Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Creative Direction • Web Design");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [description, setDescription] = useState("");
  const [detailInputs, setDetailInputs] = useState<string[]>([""]);
  const [projectLink, setProjectLink] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // States for actual image files and administrative data purge
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localFileUploaded, setLocalFileUploaded] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const [activeTab, setActiveTab] = useState<"projects" | "inquiries">("projects");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isInquiriesLoading, setIsInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState("");
  const [serverProjectIds, setServerProjectIds] = useState<string[]>([]);

  const customProjects = projects.filter(p => !PROJECTS.some(staticProj => staticProj.id === p.id));

  // Fetch inquiries from server
  const fetchInquiries = async () => {
    const token = sessionStorage.getItem("admin_token") || "";
    setIsInquiriesLoading(true);
    setInquiriesError("");
    try {
      const response = await fetch("/api/inquiries", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setInquiries(data.data || []);
      } else {
        setInquiriesError(data.error || "Failed to fetch contact inquiries.");
      }
    } catch (err) {
      setInquiriesError("Unable to connect to the server.");
    } finally {
      setIsInquiriesLoading(false);
    }
  };

  // Delete specific inquiry
  const handleDeleteInquiry = async (id: string) => {
    const token = sessionStorage.getItem("admin_token") || "";
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      } else {
        setInquiriesError(data.error || "Failed to delete inquiry.");
      }
    } catch (err) {
      setInquiriesError("Failed to delete inquiry. Check server connection.");
    }
  };

  // Fetch server project IDs to detect localStorage-only draft projects
  const fetchServerProjectIds = async () => {
    try {
      const response = await fetch("/api/projects");
      const resJson = await response.json();
      if (response.ok && resJson.success && Array.isArray(resJson.data)) {
        const serverProjs: Project[] = resJson.data;
        setServerProjectIds(serverProjs.map(p => p.id));
      }
    } catch (err) {
      console.warn("Could not fetch remote projects list", err);
    }
  };

  // Load existing session auth token and fetch server projects/inquiries
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchServerProjectIds();
      fetchInquiries();
    }
  }, [isAuthenticated, projects]);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setAuthError("Password is required.");
      return;
    }

    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", resData.token);
        setPassword("");
      } else {
        setAuthError(resData.error || "Verification failed! Access Denied.");
      }
    } catch {
      setAuthError("Server unavailable at this moment. Confirm configuration.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(png|jpeg|jpg|webp|gif)/)) {
      setUploadError("Only actual PNG, JPG, JPEG, WEBP or GIF images are supported.");
      return;
    }

    setIsUploadingImage(true);
    setUploadError("");
    setLocalFileUploaded(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const token = sessionStorage.getItem("admin_token") || "";

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          setImageUrl(resData.url);
          setAltText(`Uploaded asset: ${file.name}`);
          setLocalFileUploaded(true);
          setUploadError("");
        } else {
          setUploadError(resData.error || "Image upload failed. Server could not process file.");
          setLocalFileUploaded(false);
          setImageUrl("");
        }
      } catch (err) {
        setUploadError("Network connection error during image upload. Please try again.");
        setLocalFileUploaded(false);
        setImageUrl("");
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Could not parse file. Select a valid image file.");
      setIsUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handlePurgeAll = async () => {
    setIsPurging(true);
    setUploadError("");
    setPurgeSuccess(false);
    const token = sessionStorage.getItem("admin_token") || "";

    try {
      const response = await fetch("/api/projects/purge", {
        method: "POST",
        headers: {
          "Authorization": token
        }
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        // Also clear local client fallback items
        localStorage.setItem("local_custom_projects", "[]");
        localStorage.setItem("local_hide_mock_data", "true");

        setPurgeSuccess(true);
        onProjectAdded(); // triggers refresh

        // Reset fields
        setTitle("");
        setImageUrl("");
        setAltText("");
        setDescription("");
        setDetailInputs([""]);
        setProjectLink("");

        setTimeout(() => setPurgeSuccess(false), 5000);
      } else {
        setUploadError(resData.error || "Purge sequence failed. Check server permissions.");
      }
    } catch {
      // Offline fallback
      localStorage.setItem("local_custom_projects", "[]");
      localStorage.setItem("local_hide_mock_data", "true");
      setPurgeSuccess(true);
      onProjectAdded();
    } finally {
      setIsPurging(false);
      setShowPurgeConfirm(false);
    }
  };

  const handleRestoreMockData = async () => {
    setIsPurging(true);
    setUploadError("");
    const token = sessionStorage.getItem("admin_token") || "";

    try {
      const response = await fetch("/api/projects/restore-mock", {
        method: "POST",
        headers: {
          "Authorization": token
        }
      });

      if (response.ok) {
        localStorage.removeItem("local_hide_mock_data");
        onProjectAdded();
      } else {
        setUploadError("Could not complete restoration on the server.");
      }
    } catch {
      localStorage.removeItem("local_hide_mock_data");
      onProjectAdded();
    } finally {
      setIsPurging(false);
    }
  };

  const [deleteError, setDeleteError] = useState("");

  const handleDeleteProject = async (projectId: string) => {
    const token = sessionStorage.getItem("admin_token") || "";
    setDeleteError("");

    try {
      // 1. Try fire-wall safe POST request first
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ id: projectId })
      });

      if (response.ok) {
        // Also clear from local fallback items
        try {
          const localData = localStorage.getItem("local_custom_projects") || "[]";
          const localList = JSON.parse(localData);
          const filtered = localList.filter((p: any) => p.id !== projectId);
          localStorage.setItem("local_custom_projects", JSON.stringify(filtered));
        } catch (e) {
          console.error("Local storage delete failure:", e);
        }

        onProjectAdded(); // Refreshes the lists
        return;
      }

      // 2. If POST fails, fallback to traditional DELETE method
      const delResponse = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token
        }
      });

      if (delResponse.ok) {
        // Also clear from local fallback items
        try {
          const localData = localStorage.getItem("local_custom_projects") || "[]";
          const localList = JSON.parse(localData);
          const filtered = localList.filter((p: any) => p.id !== projectId);
          localStorage.setItem("local_custom_projects", JSON.stringify(filtered));
        } catch (e) {
          console.error("Local storage delete failure:", e);
        }

        onProjectAdded(); // Refreshes the lists
      } else {
        const resData = await delResponse.json();
        setDeleteError(resData.error || "Could not delete this project from the server.");
      }
    } catch (err) {
      // 3. Fallback: delete from local state
      try {
        const localData = localStorage.getItem("local_custom_projects") || "[]";
        const localList = JSON.parse(localData);
        const filtered = localList.filter((p: any) => p.id !== projectId);
        localStorage.setItem("local_custom_projects", JSON.stringify(filtered));
        onProjectAdded();
      } catch (e) {
        setDeleteError("Underlying network and browser storage blockades prevented deletion.");
      }
    }
  };

  const handlePublishProject = async (e: FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess(false);

    if (!title || !category || !year || !imageUrl || !description) {
      setUploadError("Please provide all required attributes (Title, Category, Year, Image, Description).");
      return;
    }

    const filteredDetails = detailInputs.filter(d => d.trim() !== "");
    if (filteredDetails.length === 0) {
      setUploadError("At least one core implementation detail is required.");
      return;
    }

    setIsPublishing(true);
    const token = sessionStorage.getItem("admin_token") || "";

    const newProject: Project = {
      id: title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      title: title.trim(),
      category: category.trim(),
      year: year.trim(),
      image: imageUrl.trim(),
      alt: altText.trim() || `Showcase image for ${title}`,
      description: description.trim(),
      details: filteredDetails,
      link: projectLink.trim() || undefined
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(newProject),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setUploadSuccess(true);
        onProjectAdded(); // Refreshes primary list state dynamically
        
        // Reset states
        setTitle("");
        setImageUrl("");
        setAltText("");
        setDescription("");
        setDetailInputs([""]);
        setProjectLink("");

        setTimeout(() => setUploadSuccess(false), 5000);
      } else {
        setUploadError(resData.error || "Publish failed. Double check authorization parameters.");
      }
    } catch {
      // Fallback: save to localStorage so it works locally even if server returns mock or offline
      try {
        const localData = localStorage.getItem("local_custom_projects") || "[]";
        const localList = JSON.parse(localData);
        localList.push(newProject);
        localStorage.setItem("local_custom_projects", JSON.stringify(localList));
        
        setUploadSuccess(true);
        onProjectAdded();
        
        setTitle("");
        setImageUrl("");
        setAltText("");
        setDescription("");
        setDetailInputs([""]);
        setProjectLink("");
        setTimeout(() => setUploadSuccess(false), 5000);
      } catch (err) {
        setUploadError("Underlying network and browser storage blockades prevented saving.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const addDetailField = () => {
    setDetailInputs([...detailInputs, ""]);
  };

  const updateDetailField = (idx: number, val: string) => {
    const updated = [...detailInputs];
    updated[idx] = val;
    setDetailInputs(updated);
  };

  const removeDetailField = (idx: number) => {
    if (detailInputs.length === 1) return;
    setDetailInputs(detailInputs.filter((_, i) => i !== idx));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* Opacity Scrim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0b1c30]/65 backdrop-blur-sm"
          />

          {/* Core Window box matching custom portfolio editorial grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl h-[88vh] bg-white dark:bg-[#0c0c0e] rounded-lg shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-neutral-800 z-10 mx-4 text-slate-900 dark:text-zinc-100 transition-colors duration-300"
          >
            {/* Header controls layout */}
            <div className="sticky top-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md px-6 py-4.5 border-b border-slate-100 dark:border-neutral-900 flex justify-between items-center z-20 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-transparent dark:border-blue-900/30 px-2.5 py-1 rounded-full">
                  Admin Console
                </span>
                <span className="text-xs font-semibold text-brand-slate dark:text-zinc-400">
                  {isAuthenticated ? "Secure Project Publisher" : "Authorization Required"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-rose-600 font-bold"
                  >
                    Logout
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-brand-navy dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-full transition-colors"
                  aria-label="Close admin dashboard"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Switch: Lock screen vs Publisher workspace */}
            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
              <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                  // LOCK SCREEN SCREEN
                  <motion.div
                    key="lock-screen"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-md mx-auto py-16 text-center space-y-8"
                  >
                    <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-neutral-800 rounded-full flex items-center justify-center mx-auto text-brand-navy dark:text-zinc-100">
                      <Lock className="w-6 h-6 text-brand-blue" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                        Protected Portfolio Workspace.
                      </h3>
                      <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 leading-relaxed">
                        Access is restricted. Input the admin password to verify credentials. No secrets are stored in public source code.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter administrative token..."
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-4 py-3 text-xs text-brand-navy dark:text-zinc-100 rounded-md font-mono outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue placeholder-slate-400 dark:placeholder-zinc-600"
                          disabled={isSubmittingAuth}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {authError && (
                        <div className="flex items-center gap-2 text-rose-600 text-[11px] font-semibold bg-rose-50 border border-rose-100 px-3 py-2 rounded">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingAuth}
                        className="w-full bg-brand-navy hover:bg-brand-blue text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all flex justify-center items-center gap-2 shadow-sm"
                      >
                        {isSubmittingAuth ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            Authorize Session <Unlock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  // DUAL-TAB WORKSPACE DASHBOARD
                  <motion.div
                    key="workspace-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* Tab Navigation header */}
                    <div className="flex gap-6 border-b border-slate-100 dark:border-neutral-900 pb-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab("projects")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer ${
                          activeTab === "projects"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        Projects Publisher
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("inquiries")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "inquiries"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        Inquiries Inbox
                        {inquiries.length > 0 && (
                          <span className="bg-brand-blue text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                            {inquiries.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {activeTab === "projects" ? (
                      <>
                        <div className="border-b border-slate-100 dark:border-neutral-900 pb-5">
                          <h3 className="font-display font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                            Publish New Project Case Study.
                          </h3>
                          <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 mt-1.5">
                            Populate corresponding parameters. Newly added items will align structurally to the grid architecture and editorial flow.
                          </p>
                        </div>

                        <form onSubmit={handlePublishProject} className="space-y-6">
                          
                          {/* Grid for basics */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                              <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                Project Title *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Apex Studio"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                Year *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 2026"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                              Categories • Tags *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Creative Direction • Web Design"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue"
                            />
                          </div>

                          {/* Image block choice or direct URL or actual file upload */}
                          <div className="space-y-4 p-5 bg-slate-50 dark:bg-zinc-900/40 rounded-lg border border-slate-200 dark:border-neutral-850">
                            <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy dark:text-zinc-100 font-semibold">
                              Project Hero Image Asset *
                            </label>
                            
                            {/* File Upload Zone */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-brand-slate dark:text-zinc-400 block font-medium">Upload an actual PNG, JPG, or JPEG file from your computer:</span>
                              <div className="relative border-2 border-dashed border-slate-300 dark:border-neutral-800 rounded-xl p-6 bg-white dark:bg-zinc-900/60 hover:border-brand-blue transition-all duration-200 flex flex-col items-center justify-center text-center">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                  onChange={handleFileChange}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  disabled={isUploadingImage}
                                />
                                {isUploadingImage ? (
                                  <div className="space-y-2 flex flex-col items-center">
                                    <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                    <span className="font-sans text-[10px] text-brand-blue font-bold tracking-wider uppercase">Uploading asset to server...</span>
                                  </div>
                                ) : uploadError ? (
                                  <div className="space-y-1.5 flex flex-col items-center max-w-[320px] px-2 text-center">
                                    <AlertCircle className="w-7 h-7 text-rose-500 shrink-0" />
                                    <span className="font-sans text-[11px] text-rose-600 font-bold">Upload Failed</span>
                                    <span className="font-sans text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">{uploadError}</span>
                                    <span className="font-sans text-[9px] text-brand-blue font-semibold hover:underline mt-1">Try choosing another file</span>
                                  </div>
                                ) : localFileUploaded && imageUrl ? (
                                  <div className="space-y-1.5 flex flex-col items-center">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                                    <span className="font-sans text-[11px] text-emerald-600 font-bold">Image loaded successfully!</span>
                                    <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 max-w-[280px] truncate">{imageUrl.startsWith("data:") ? "Stored as local base64 payload" : imageUrl}</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2 flex flex-col items-center">
                                    <Upload className="w-7 h-7 text-slate-400 dark:text-zinc-500" />
                                    <div>
                                      <span className="font-sans text-xs text-brand-blue font-semibold hover:underline">Choose image file</span>
                                      <span className="font-sans text-xs text-slate-500 dark:text-zinc-400"> or drag and drop here</span>
                                    </div>
                                    <span className="font-sans text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-medium">PNG, JPG, WEBP or GIF up to 15MB</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="relative flex py-2 items-center">
                              <div className="flex-grow border-t border-slate-200/80 dark:border-neutral-800"></div>
                              <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">Or use a direct URL</span>
                              <div className="flex-grow border-t border-slate-200/80 dark:border-neutral-800"></div>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[10px] text-brand-slate block">Provide a high-quality direct URL:</span>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                                onChange={(e) => {
                                  setImageUrl(e.target.value);
                                  setLocalFileUploaded(false);
                                }}
                                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy rounded outline-none focus:border-brand-blue font-mono"
                              />
                            </div>

                            {/* Curated Presets */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-brand-slate block">Or select from curated premium presets:</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PRESET_IMAGES.map((imgUrl, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setImageUrl(imgUrl.url);
                                      setAltText(`Showcase representing ${imgUrl.name}`);
                                      setLocalFileUploaded(false);
                                    }}
                                    className={`group relative aspect-video overflow-hidden rounded-md border text-left cursor-pointer transition-all ${
                                      imageUrl === imgUrl.url
                                        ? "border-brand-blue ring-1 ring-brand-blue"
                                        : "border-slate-200 hover:border-brand-slate"
                                    }`}
                                  >
                                    <img
                                      src={imgUrl.url}
                                      alt={imgUrl.name}
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-[8px] text-white tracking-tight truncate">
                                      {imgUrl.name}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate">
                              Alternative Text (Accessibility)
                            </label>
                            <input
                              type="text"
                              placeholder="Describe the image context for accessibility screen readers..."
                              value={altText}
                              onChange={(e) => setAltText(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy rounded outline-none focus:border-brand-blue"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate">
                              Overview Monograph Case Description *
                            </label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Provide a minimal high-end overview description highlighting layout, aesthetic strategies, etc."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy rounded outline-none focus:border-brand-blue resize-none"
                            />
                          </div>

                          {/* Dyn array for core specs */}
                          <div className="space-y-3.5 pt-2">
                            <div className="flex justify-between items-center">
                              <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate">
                                Core Implementations & Tech Specs (At least 1)
                              </label>
                              <button
                                type="button"
                                onClick={addDetailField}
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1 hover:text-brand-navy"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Metric
                              </button>
                            </div>

                            <div className="space-y-2">
                              {detailInputs.map((val, dIdx) => (
                                <div key={dIdx} className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    placeholder={`e.g. Engineered vertical grids using mathematically aligned metrics / column width`}
                                    value={val}
                                    onChange={(e) => updateDetailField(dIdx, e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy rounded outline-none focus:border-brand-blue"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeDetailField(dIdx)}
                                    disabled={detailInputs.length === 1}
                                    className="p-2.5 text-slate-300 hover:text-rose-500 disabled:opacity-40 transition-colors bg-slate-50 rounded border border-slate-100"
                                    aria-label="Delete specification"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate">
                              Project Site Link URL (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. https://apex.ruan.dev"
                              value={projectLink}
                              onChange={(e) => setProjectLink(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy rounded outline-none focus:border-brand-blue font-mono"
                            />
                          </div>

                          {/* Action status labels */}
                          <AnimatePresence>
                            {uploadError && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded"
                              >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{uploadError}</span>
                              </motion.div>
                            )}

                            {uploadSuccess && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-100 p-3 rounded"
                              >
                                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
                                <span>Your case project was uploaded and successfully published live to the portfolio grid!</span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <button
                            type="submit"
                            disabled={isPublishing}
                            className="w-full bg-brand-navy hover:bg-brand-blue text-white font-sans text-xs font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2 shadow-sm"
                          >
                            {isPublishing ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <span className="flex items-center gap-1.5">
                                Publish to Case Directory <Upload className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </button>
                        </form>

                        {/* List of Custom Projects for Single Deletion */}
                        {customProjects.length > 0 && (
                          <div className="border-t border-slate-200/60 pt-8 mt-12 space-y-4">
                            <div className="space-y-1">
                              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1d1d1f]">
                                Manage Dynamic Projects ({customProjects.length})
                              </h4>
                              <p className="font-sans text-[11px] text-slate-500 leading-normal">
                                A list of your custom uploaded case works. Delete individual entries to remove them instantly from the main portfolio directory.
                              </p>
                            </div>

                            {deleteError && (
                              <div className="flex items-start gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{deleteError}</span>
                              </div>
                            )}

                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                              {customProjects.map((proj) => {
                                const isLocalOnly = !serverProjectIds.includes(proj.id);
                                return (
                                  <div 
                                    key={proj.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all"
                                  >
                                    <div className="flex items-center gap-3">
                                      {proj.image && (
                                        <img 
                                          src={proj.image} 
                                          alt={proj.title} 
                                          className="w-12 h-8 object-cover rounded bg-slate-100 border border-slate-200"
                                          referrerPolicy="no-referrer"
                                        />
                                      )}
                                      <div>
                                        <h5 className="font-sans font-semibold text-xs text-brand-navy flex items-center gap-2 leading-tight">
                                          {proj.title}
                                          {isLocalOnly && (
                                            <span className="font-sans text-[8px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                                              Local Draft
                                            </span>
                                          )}
                                        </h5>
                                        <span className="font-mono text-[9px] text-slate-400">
                                          {proj.category} • {proj.year}
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProject(proj.id)}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                      title="Delete project and any uploaded image file"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* System Maintenance & Purges */}
                        <div className="border-t border-slate-200/60 pt-8 mt-12 space-y-4 pb-4">
                          <div className="space-y-1">
                            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1d1d1f]">
                              Database & Showcase Maintenance
                            </h4>
                            <p className="font-sans text-[11px] text-slate-500 leading-normal">
                              Manage project state and visibility. Purge all dynamic portfolios, empty the disk uploads cache, or toggle the visibility of the original static mock websites.
                            </p>
                          </div>

                          {purgeSuccess && (
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-100 p-3 rounded">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>All custom projects and static uploaded image files have been successfully purged!</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {showPurgeConfirm ? (
                              <div className="w-full bg-rose-50 border border-rose-100 p-4 rounded-xl space-y-3">
                                <p className="font-sans text-[11px] font-semibold text-rose-800">
                                  Warning: This will permanently delete all uploaded projects and delete all uploaded image files in the uploads/ folder on the server. This action is irreversible.
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={handlePurgeAll}
                                    disabled={isPurging}
                                    className="bg-rose-600 hover:bg-rose-700 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer"
                                  >
                                    {isPurging ? "Purging..." : "Yes, Purge Everything"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowPurgeConfirm(false)}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setShowPurgeConfirm(true)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all cursor-pointer"
                                >
                                  Purge All Projects & Uploaded Images
                                </button>

                                <button
                                  type="button"
                                  onClick={handleRestoreMockData}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50 font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all cursor-pointer"
                                >
                                  Restore Mock Website Showcase Data
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // INQUIRIES LISTING VIEW
                      <div className="space-y-6">
                        <div className="border-b border-slate-100 pb-5">
                          <h3 className="font-display font-black text-2xl text-brand-navy tracking-tight">
                            Client Inquiries Inbox.
                          </h3>
                          <p className="font-sans text-xs text-brand-slate mt-1.5">
                            Read and manage project briefs submitted via the contact form. Handled securely over rate-limited backend channels.
                          </p>
                        </div>

                        {inquiriesError && (
                          <div className="flex items-start gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{inquiriesError}</span>
                          </div>
                        )}

                        {isInquiriesLoading ? (
                          <div className="py-16 text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="font-sans text-xs text-slate-400">Loading inbox transmissions...</p>
                          </div>
                        ) : inquiries.length === 0 ? (
                          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                            <div>
                              <h5 className="font-sans font-bold text-sm text-[#1d1d1f]">No client inquiries received yet</h5>
                              <p className="font-sans text-xs text-slate-400 mt-1">Ready to receive briefs from your contact form.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 pr-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {inquiries.map((inq) => (
                              <div
                                key={inq.id}
                                className="group relative bg-slate-50 hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 p-6 rounded-2xl transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 pb-3 mb-3.5">
                                  <div>
                                    <h4 className="font-sans font-bold text-sm text-[#1d1d1f] flex items-center gap-2">
                                      {inq.name}
                                      <span className="font-mono text-[9px] text-[#94a3b8] font-semibold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                                        Brief
                                      </span>
                                    </h4>
                                    <a
                                      href={`mailto:${inq.email}`}
                                      className="font-mono text-xs text-brand-blue hover:underline inline-flex items-center gap-1 mt-0.5"
                                    >
                                      <Mail className="w-3 h-3" /> {inq.email}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-3 self-start sm:self-center">
                                    <span className="font-mono text-[10px] text-slate-400">
                                      {new Date(inq.timestamp).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short"
                                      })}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteInquiry(inq.id)}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                      title="Delete inquiry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="font-sans text-xs text-[#45464d] whitespace-pre-wrap leading-relaxed">
                                  {inq.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
