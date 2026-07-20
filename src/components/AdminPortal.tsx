import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Unlock, Eye, EyeOff, Plus, Trash2, ArrowUpRight, Upload, AlertCircle, CheckCircle2, Inbox, Mail, LayoutDashboard, Briefcase, Image as ImageIcon, RefreshCw, Layers, Sparkles, Copy, Check, ExternalLink, Calendar, PlusCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Project } from "../types";
import { PROJECTS } from "../data";

const nyEditImg = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80";
const studioAxonImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
const novaSystemsImg = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
const muralisArtImg = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
  projects: Project[];
  customParallaxImages?: Record<number, string>;
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

export default function AdminPortal({ isOpen, onClose, onProjectAdded, projects, customParallaxImages }: AdminPortalProps) {
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

  // Wizard step state for publisher
  const [formStep, setFormStep] = useState<1 | 2>(1);

  // States for actual image files and administrative data purge
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localFileUploaded, setLocalFileUploaded] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [showOverviewPurgeConfirm, setShowOverviewPurgeConfirm] = useState(false);

  // Parallax upload states
  const [uploadingParallaxSlot, setUploadingParallaxSlot] = useState<number | null>(null);
  const [parallaxErrors, setParallaxErrors] = useState<Record<number, string>>({});

  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "inquiries" | "parallax" | "uploads">("dashboard");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [isInquiriesLoading, setIsInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState("");
  const [serverProjectIds, setServerProjectIds] = useState<string[]>([]);
  const [uploadsList, setUploadsList] = useState<any[]>([]);
  const [isUploadsLoading, setIsUploadsLoading] = useState(false);
  const [uploadsError, setUploadsError] = useState("");
  const [copiedUploadId, setCopiedUploadId] = useState<string | null>(null);
  const [confirmDeleteUploadId, setConfirmDeleteUploadId] = useState<string | null>(null);

  const [hiddenPresetUrls, setHiddenPresetUrls] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("hidden_preset_urls");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleHidePresetUrl = (url: string) => {
    const updated = [...hiddenPresetUrls, url];
    setHiddenPresetUrls(updated);
    localStorage.setItem("hidden_preset_urls", JSON.stringify(updated));
  };

  // Fetch uploads from server
  const fetchUploads = async () => {
    const token = sessionStorage.getItem("admin_token") || "";
    setIsUploadsLoading(true);
    setUploadsError("");
    try {
      const response = await fetch("/api/uploads", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUploadsList(data.data || []);
      } else {
        setUploadsError(data.error || "Failed to fetch media uploads.");
      }
    } catch (err) {
      setUploadsError("Unable to connect to the server.");
    } finally {
      setIsUploadsLoading(false);
    }
  };

  // Delete specific upload
  const handleDeleteUpload = async (id: string) => {
    const token = sessionStorage.getItem("admin_token") || "";
    setUploadsError("");
    try {
      // Try DELETE request first
      const response = await fetch(`/api/uploads/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUploadsList((prev) => prev.filter((u) => u.id !== id));
      } else {
        // Fallback to POST
        const responseFallback = await fetch("/api/uploads/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        });
        const dataFallback = await responseFallback.json();
        if (responseFallback.ok && dataFallback.success) {
          setUploadsList((prev) => prev.filter((u) => u.id !== id));
        } else {
          setUploadsError(dataFallback.error || "Failed to delete upload.");
        }
      }
    } catch (err) {
      setUploadsError("Failed to delete upload. Check server connection.");
    }
  };

  const customProjects = projects.filter(p => !PROJECTS.some(staticProj => staticProj.id === p.id));
  const visibleDefaultProjects = PROJECTS.filter(staticProj => projects.some(p => p.id === staticProj.id));
  const hiddenDefaultProjects = PROJECTS.filter(staticProj => !projects.some(p => p.id === staticProj.id));

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
      fetchUploads();
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

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isValidType = file.type.match(/image\/(png|jpeg|jpg|webp|gif)/) || 
                        (fileExt && ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt));
    if (!isValidType) {
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
          fetchUploads();
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

  const handleParallaxFileChange = async (slotIdx: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isValidType = file.type.match(/image\/(png|jpeg|jpg|webp|gif)/) || 
                        (fileExt && ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt));
    if (!isValidType) {
      setParallaxErrors(prev => ({ ...prev, [slotIdx]: "Unsupported format. Select a valid PNG, JPG, JPEG, WEBP or GIF." }));
      return;
    }

    setUploadingParallaxSlot(slotIdx);
    setParallaxErrors(prev => ({ ...prev, [slotIdx]: "" }));

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const token = sessionStorage.getItem("admin_token") || "";

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
        if (response.ok && resData.success && resData.url) {
          const uploadedUrl = resData.url;
          
          const updated = { ...customParallaxImages, [slotIdx]: uploadedUrl };
          localStorage.setItem("custom_zoom_images", JSON.stringify(updated));

          await fetch("/api/settings/parallax", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({ customParallaxImages: updated })
          });

          fetchUploads();
          onProjectAdded();
        } else {
          setParallaxErrors(prev => ({ ...prev, [slotIdx]: resData.error || "Upload failed." }));
        }
      } catch (err) {
        setParallaxErrors(prev => ({ ...prev, [slotIdx]: "Network error during upload." }));
      } finally {
        setUploadingParallaxSlot(null);
      }
    };

    reader.onerror = () => {
      setParallaxErrors(prev => ({ ...prev, [slotIdx]: "Could not parse image file." }));
      setUploadingParallaxSlot(null);
    };

    reader.readAsDataURL(file);
  };

  const handleParallaxReset = async (slotIdx: number) => {
    const updated = { ...customParallaxImages };
    delete updated[slotIdx];
    localStorage.setItem("custom_zoom_images", JSON.stringify(updated));

    try {
      const token = sessionStorage.getItem("admin_token") || "";
      await fetch("/api/settings/parallax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ customParallaxImages: updated })
      });
    } catch (e) {
      console.error(e);
    }

    onProjectAdded();
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

  const handleRestoreProject = async (projectId: string) => {
    const token = sessionStorage.getItem("admin_token") || "";
    setDeleteError("");
    try {
      const response = await fetch("/api/projects/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ id: projectId })
      });
      if (response.ok) {
        onProjectAdded();
      } else {
        const resData = await response.json();
        setDeleteError(resData.error || "Could not restore this project.");
      }
    } catch (err) {
      setDeleteError("Network error restoring project.");
    }
  };

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

                    <div className="pt-2">
                      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-neutral-800/40 rounded-xl p-3.5 text-left">
                        <p className="font-mono text-[9px] uppercase tracking-widest font-black text-brand-blue dark:text-blue-400">Demo Access Hint</p>
                        <p className="font-sans text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Use the default administrative token <code className="font-mono font-bold text-brand-navy dark:text-white bg-slate-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">changeme</code> to authenticate this session.
                        </p>
                      </div>
                    </div>
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
                    <div className="flex gap-4 sm:gap-6 border-b border-slate-100 dark:border-neutral-900 overflow-x-auto pb-3 mb-6 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setActiveTab("dashboard")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === "dashboard"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("projects")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === "projects"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        Publisher
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("inquiries")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                          activeTab === "inquiries"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Inquiries Inbox
                        {inquiries.length > 0 && (
                          <span className="bg-brand-blue text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                            {inquiries.length}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("parallax")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === "parallax"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Parallax Layers
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("uploads")}
                        className={`font-sans text-xs font-extrabold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === "uploads"
                            ? "border-brand-blue text-brand-navy dark:text-zinc-100"
                            : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-brand-slate dark:hover:text-zinc-300"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Media Library
                        {uploadsList.length > 0 && (
                          <span className="bg-brand-blue text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                            {uploadsList.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {activeTab === "dashboard" ? (
                      <div className="space-y-8 animate-fadeIn">
                        {/* Summary Header card */}
                        <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <h3 className="font-display font-black text-xl text-brand-navy dark:text-zinc-100 tracking-tight flex items-center gap-2">
                              Creative Command Center <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                            </h3>
                            <p className="font-sans text-xs text-brand-slate dark:text-zinc-400">
                              Welcome back. This panel lets you manage published works, background layers, and contact briefs.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 px-3.5 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                              Cloud Database Active
                            </span>
                          </div>
                        </div>

                        {/* KPI Metrics Dashboard Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* KPI 1: Works */}
                          <div className="bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-neutral-800 p-5 rounded-2xl space-y-3 shadow-sm hover:border-brand-blue/50 dark:hover:border-blue-900/50 transition-all group">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">
                                Portfolio Showcase
                              </span>
                              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-brand-blue dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-sans font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                                {projects.length} Total
                              </h4>
                              <p className="font-sans text-[10px] text-brand-slate dark:text-zinc-400">
                                {customProjects.length} Custom / {projects.length - customProjects.length} Standard
                              </p>
                            </div>
                          </div>

                          {/* KPI 2: Contact Inquiries */}
                          <div className="bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-neutral-800 p-5 rounded-2xl space-y-3 shadow-sm hover:border-amber-500/50 dark:hover:border-amber-950/50 transition-all group">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">
                                Client Inbox
                              </span>
                              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <Mail className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-sans font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                                {inquiries.length} Briefs
                              </h4>
                              <p className="font-sans text-[10px] text-brand-slate dark:text-zinc-400">
                                {inquiries.length > 0 ? `${inquiries.length} active transmissions` : "No pending proposals"}
                              </p>
                            </div>
                          </div>

                          {/* KPI 3: Parallax Backdrops */}
                          <div className="bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-neutral-800 p-5 rounded-2xl space-y-3 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-950/50 transition-all group">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">
                                Zoom Parallax
                              </span>
                              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Layers className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-sans font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                                {Object.keys(customParallaxImages || {}).length} Custom
                              </h4>
                              <p className="font-sans text-[10px] text-brand-slate dark:text-zinc-400">
                                Active across 6 creative slots
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Shortcuts bar */}
                        <div className="space-y-2">
                          <span className="block font-mono text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                            Quick Operations & Pathways
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <button
                              type="button"
                              onClick={() => { setActiveTab("projects"); setFormStep(1); }}
                              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-[11px] font-bold uppercase tracking-widest p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                            >
                              <PlusCircle className="w-4 h-4" /> Publish Work
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("inquiries")}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-brand-navy dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                            >
                              <Mail className="w-4 h-4" /> Client Inbox ({inquiries.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("parallax")}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-brand-navy dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                            >
                              <Layers className="w-4 h-4" /> Backgrounds
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowOverviewPurgeConfirm(true);
                                setTimeout(() => {
                                  const el = document.getElementById("overview-purge-section");
                                  el?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[11px] font-bold uppercase tracking-widest p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-200/50 dark:border-rose-900/40 hover:scale-102 active:scale-98"
                            >
                              <Trash2 className="w-4 h-4" /> Purge Portfolio
                            </button>
                          </div>
                        </div>


                        {/* Two Column Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                          {/* Project Catalog Column */}
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-900 pb-2">
                              <h4 className="font-display font-black text-sm text-brand-navy dark:text-zinc-200 tracking-tight flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-brand-blue" /> Published Works Catalog
                              </h4>
                              <button
                                type="button"
                                onClick={() => setActiveTab("projects")}
                                className="text-[10px] font-bold uppercase tracking-wider text-brand-blue hover:underline cursor-pointer"
                              >
                                View All ({projects.length})
                              </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                              {projects.map((proj) => {
                                const isCustom = !PROJECTS.some((staticProj) => staticProj.id === proj.id);
                                return (
                                  <div
                                    key={proj.id}
                                    className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-150 dark:border-neutral-800/60 rounded-xl hover:border-slate-300 dark:hover:border-neutral-700 transition-all"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {proj.image ? (
                                        <img
                                          src={proj.image}
                                          alt={proj.title}
                                          className="w-10 h-7 object-cover rounded bg-slate-100 border border-slate-200/50 shrink-0"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="w-10 h-7 bg-slate-200 dark:bg-zinc-800 rounded shrink-0" />
                                      )}
                                      <div className="min-w-0">
                                        <h5 className="font-sans font-bold text-[11px] text-brand-navy dark:text-zinc-200 truncate leading-tight flex items-center gap-1">
                                          {proj.title}
                                          {isCustom ? (
                                            <span className="font-mono text-[7px] uppercase font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-transparent dark:border-blue-900/30 px-1 py-0.2 rounded shrink-0">
                                              Dynamic
                                            </span>
                                          ) : (
                                            <span className="font-mono text-[7px] uppercase font-bold text-slate-500 bg-slate-100 dark:text-zinc-400 dark:bg-zinc-800/80 px-1 py-0.2 rounded shrink-0">
                                              Default
                                            </span>
                                          )}
                                        </h5>
                                        <span className="font-mono text-[9px] text-brand-slate dark:text-zinc-500 block leading-none mt-0.5">
                                          {proj.category} • {proj.year}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {isCustom ? (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteProject(proj.id)}
                                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:bg-rose-950/20 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                          title="Delete Custom Project"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <span className="font-mono text-[8px] text-slate-400/85 p-1">Immutable</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Recent Briefs Column */}
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-900 pb-2">
                              <h4 className="font-display font-black text-sm text-brand-navy dark:text-zinc-200 tracking-tight flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-amber-500" /> Recent Contact Activity
                              </h4>
                              <button
                                type="button"
                                onClick={() => setActiveTab("inquiries")}
                                className="text-[10px] font-bold uppercase tracking-wider text-brand-blue hover:underline cursor-pointer"
                              >
                                Inbox ({inquiries.length})
                              </button>
                            </div>

                            {inquiries.length === 0 ? (
                              <div className="h-[180px] border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl flex flex-col justify-center items-center text-center p-4 bg-slate-50/50 dark:bg-zinc-900/10">
                                <Inbox className="w-6 h-6 text-slate-300 dark:text-zinc-700 animate-bounce" />
                                <h5 className="font-sans font-bold text-xs text-brand-navy dark:text-zinc-300 mt-2">
                                  No proposals yet
                                </h5>
                                <p className="font-sans text-[10px] text-brand-slate dark:text-zinc-500 mt-0.5 leading-normal max-w-[200px]">
                                  Your inbox will stream proposals from the contact form.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {inquiries.slice(0, 3).map((inq) => (
                                  <div
                                    key={inq.id}
                                    className="p-3 bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-150 dark:border-neutral-800/60 rounded-xl hover:border-slate-250 transition-all space-y-1.5 relative group"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="min-w-0">
                                        <h5 className="font-sans font-extrabold text-[11px] text-brand-navy dark:text-zinc-200 truncate leading-tight">
                                          {inq.name}
                                        </h5>
                                        <a
                                          href={`mailto:${inq.email}`}
                                          className="font-mono text-[9px] text-brand-blue hover:underline block truncate"
                                        >
                                          {inq.email}
                                        </a>
                                      </div>
                                      <span className="font-mono text-[8px] text-slate-400 shrink-0">
                                        {new Date(inq.timestamp).toLocaleDateString(undefined, {
                                          month: "short",
                                          day: "numeric"
                                        })}
                                      </span>
                                    </div>
                                    <p className="font-sans text-[10px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                                      {inq.message}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Database Maintenance and Purge Block */}
                        <div id="overview-purge-section" className="border-t border-slate-100 dark:border-neutral-900/60 pt-6 mt-4">
                          <div className="bg-slate-50 dark:bg-zinc-900/30 border border-slate-150 dark:border-neutral-800/80 p-5.5 rounded-2xl space-y-4">
                            <div className="space-y-1">
                              <h4 className="font-display font-black text-sm text-brand-navy dark:text-zinc-200 tracking-tight flex items-center gap-1.5">
                                <Trash2 className="w-4 h-4 text-rose-500" /> Database & Showcase Maintenance
                              </h4>
                              <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-400 leading-relaxed">
                                Purge all dynamic portfolios from Supabase and delete all uploaded files from the server's cache.
                              </p>
                            </div>

                            {purgeSuccess && (
                              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>All custom projects and uploaded images have been successfully purged!</span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {showOverviewPurgeConfirm ? (
                                <div className="w-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-xl space-y-3">
                                  <p className="font-sans text-[11px] font-semibold text-rose-800 dark:text-rose-400">
                                    Warning: This will permanently delete all uploaded projects from Supabase and delete all uploaded files in the uploads/ folder on the server. This action is irreversible.
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await handlePurgeAll();
                                        setShowOverviewPurgeConfirm(false);
                                      }}
                                      disabled={isPurging}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer"
                                    >
                                      {isPurging ? "Purging..." : "Yes, Purge Everything"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setShowOverviewPurgeConfirm(false)}
                                      className="bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setShowOverviewPurgeConfirm(true)}
                                  className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all cursor-pointer"
                                >
                                  Purge All Projects & Uploaded Images
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : activeTab === "projects" ? (
                      <>
                        <div className="border-b border-slate-100 dark:border-neutral-900 pb-5">
                          <h3 className="font-display font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-blue" /> Case Study Publisher
                          </h3>
                          <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 mt-1.5">
                            Newly added items will instantly align to the high-performance stacked layout.
                          </p>
                        </div>

                        {/* 2-Step wizard indicator */}
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-neutral-800 p-3 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${formStep === 1 ? 'bg-brand-blue text-white' : 'bg-slate-200 dark:bg-zinc-850 text-slate-600 dark:text-zinc-400'}`}>1</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${formStep === 1 ? 'text-brand-blue' : 'text-slate-400 dark:text-zinc-500'}`}>Parameters</span>
                          </div>
                          <div className="h-[1px] w-8 bg-slate-200 dark:bg-zinc-800" />
                          <div className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${formStep === 2 ? 'bg-brand-blue text-white' : 'bg-slate-200 dark:bg-zinc-850 text-slate-600 dark:text-zinc-400'}`}>2</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${formStep === 2 ? 'text-brand-blue' : 'text-slate-400 dark:text-zinc-500'}`}>Media Assets & Link</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                          {/* Left: The Form (Lg: col-span-7) */}
                          <div className="lg:col-span-7 space-y-6">
                            <form onSubmit={handlePublishProject} className="space-y-5">
                              {formStep === 1 ? (
                                <div className="space-y-5 animate-fadeIn">
                                  {/* Step 1 Fields */}
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

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                      Overview Monograph Case Description *
                                    </label>
                                    <textarea
                                      rows={3}
                                      required
                                      placeholder="Provide a minimal high-end overview description highlighting layout, aesthetic strategies, etc."
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-850 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue resize-none"
                                    />
                                  </div>

                                  {/* Specs */}
                                  <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center">
                                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                        Core Tech Specs & Specs Metrics (At least 1)
                                      </label>
                                      <button
                                        type="button"
                                        onClick={addDetailField}
                                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1 hover:text-brand-blue-hover cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Add Metric
                                      </button>
                                    </div>

                                    <div className="space-y-2">
                                      {detailInputs.map((val, dIdx) => (
                                        <div key={dIdx} className="flex gap-2 items-center">
                                          <input
                                            type="text"
                                            placeholder="e.g. Engineered vertical grids using mathematically aligned metrics"
                                            value={val}
                                            onChange={(e) => updateDetailField(dIdx, e.target.value)}
                                            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removeDetailField(dIdx)}
                                            disabled={detailInputs.length === 1}
                                            className="p-2.5 text-slate-400 dark:text-zinc-500 hover:text-rose-500 disabled:opacity-30 transition-colors bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-neutral-700 cursor-pointer"
                                            aria-label="Delete specification"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="pt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // Simple client checks before step 2
                                        if (!title || !description) {
                                          setUploadError("Please fill out Title and Description first.");
                                          return;
                                        }
                                        setUploadError("");
                                        setFormStep(2);
                                      }}
                                      className="w-full bg-brand-navy hover:bg-brand-blue text-white font-sans text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      Continue to Step 2 <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-5 animate-fadeIn">
                                  {/* Step 2 Fields: Image Choice & Link */}
                                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-200 dark:border-neutral-800/60">
                                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-navy dark:text-zinc-200 font-semibold">
                                      Project Hero Image Asset *
                                    </label>

                                    {/* File zone */}
                                    <div className="space-y-2">
                                      <div className="relative border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-zinc-900/50 hover:border-brand-blue transition-all duration-200 flex flex-col items-center justify-center text-center">
                                        <input
                                          type="file"
                                          accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                          onChange={handleFileChange}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          disabled={isUploadingImage}
                                        />
                                        {isUploadingImage ? (
                                          <div className="space-y-2 flex flex-col items-center">
                                            <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                            <span className="font-sans text-[10px] text-brand-blue font-bold uppercase tracking-widest">Uploading asset...</span>
                                          </div>
                                        ) : localFileUploaded && imageUrl ? (
                                          <div className="space-y-1 flex flex-col items-center">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            <span className="font-sans text-[10px] text-emerald-600 font-bold">Image loaded successfully!</span>
                                          </div>
                                        ) : (
                                          <div className="space-y-1.5 flex flex-col items-center text-slate-400 dark:text-zinc-500">
                                            <Upload className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload PNG / JPG File</span>
                                            <span className="text-[9px]">Click or drag asset files</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* URL Input */}
                                    <div className="relative flex py-1 items-center">
                                      <div className="flex-grow border-t border-slate-250 dark:border-neutral-800"></div>
                                      <span className="flex-shrink mx-3 text-[8px] font-mono text-slate-450 dark:text-zinc-500 uppercase tracking-widest font-black">OR PROVIDE DIRECT IMAGE URL</span>
                                      <div className="flex-grow border-t border-slate-250 dark:border-neutral-800"></div>
                                    </div>

                                    <input
                                      type="text"
                                      placeholder="https://images.unsplash.com/..."
                                      value={imageUrl.startsWith("data:") ? "" : imageUrl}
                                      onChange={(e) => {
                                        setImageUrl(e.target.value);
                                        setLocalFileUploaded(false);
                                      }}
                                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue font-mono"
                                    />

                                    {/* Presets */}
                                    {PRESET_IMAGES.filter((p) => !hiddenPresetUrls.includes(p.url)).length > 0 && (
                                      <div className="space-y-1.5">
                                        <span className="text-[9px] text-brand-slate dark:text-zinc-500 font-bold uppercase tracking-wider block">Or select curated stock presets:</span>
                                        <div className="grid grid-cols-4 gap-1.5">
                                          {PRESET_IMAGES.filter((p) => !hiddenPresetUrls.includes(p.url)).map((imgUrl, index) => (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() => {
                                                setImageUrl(imgUrl.url);
                                                setAltText(`Representing ${imgUrl.name}`);
                                                setLocalFileUploaded(false);
                                              }}
                                              className={`relative aspect-video overflow-hidden rounded border cursor-pointer transition-all ${imageUrl === imgUrl.url ? "border-brand-blue ring-1 ring-brand-blue" : "border-slate-200 dark:border-neutral-800 hover:border-brand-slate"}`}
                                            >
                                              <img src={imgUrl.url} alt={imgUrl.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                      Alternative Text (Accessibility)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Describe the cover context for screen readers..."
                                      value={altText}
                                      onChange={(e) => setAltText(e.target.value)}
                                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
                                      Project Site Link URL (Optional)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. https://apex.ruan.dev"
                                      value={projectLink}
                                      onChange={(e) => setProjectLink(e.target.value)}
                                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded outline-none focus:border-brand-blue font-mono"
                                    />
                                  </div>

                                  <AnimatePresence>
                                    {uploadError && (
                                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-rose-600 text-[11px] font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{uploadError}</span>
                                      </motion.div>
                                    )}
                                    {uploadSuccess && (
                                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-emerald-600 text-[11px] font-semibold bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                                        <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                                        <span>Published live successfully to your stacked portfolio deck!</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  <div className="flex gap-3 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => setFormStep(1)}
                                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-brand-navy dark:text-zinc-100 text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                                    >
                                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={isPublishing}
                                      className="flex-[2] bg-brand-navy hover:bg-brand-blue text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                                    >
                                      {isPublishing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <span className="flex items-center gap-1.5">
                                          Publish Study <Upload className="w-3.5 h-3.5" />
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </form>
                          </div>

                          {/* Right: Live Preview Panel (Lg: col-span-5) */}
                          <div className="lg:col-span-5 space-y-4">
                            <span className="block font-mono text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                              Real-Time Stack Preview
                            </span>
                            <div className="border border-slate-250 dark:border-neutral-850 rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900/20 p-4 shadow-inner">
                              {/* Standard Card mock layout mirroring the visual deck */}
                              <div className="bg-white dark:bg-[#0c0c0e] rounded-xl overflow-hidden border border-slate-150 dark:border-neutral-850 shadow-md">
                                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-zinc-900">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={altText || "Preview placeholder"}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                      <ImageIcon className="w-7 h-7 text-slate-300 dark:text-zinc-700 animate-pulse" />
                                      <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 mt-2 uppercase font-black">
                                        No cover uploaded yet
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded text-[8px] font-mono text-white tracking-widest uppercase">
                                    {year || "2026"}
                                  </div>
                                </div>
                                <div className="p-5 space-y-2">
                                  <span className="text-[9px] font-mono uppercase tracking-widest text-brand-blue block font-black">
                                    {category || "Creative Direction • Web Design"}
                                  </span>
                                  <h4 className="font-display font-black text-base text-[#1d1d1f] dark:text-zinc-100 tracking-tight leading-tight">
                                    {title || "Apex Digital Studio"}
                                  </h4>
                                  <p className="text-[11px] text-brand-slate dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                    {description || "Provide an elegant high-end overview monograph case description to render beautiful copy..."}
                                  </p>

                                  {/* List bullet points preview */}
                                  <div className="pt-2 border-t border-slate-100 dark:border-neutral-900 space-y-1">
                                    <span className="block font-mono text-[8px] text-slate-400 uppercase tracking-wider font-bold">Specs metrics preview:</span>
                                    <div className="space-y-1">
                                      {detailInputs.filter(d => d.trim() !== "").map((d, idx) => (
                                        <div key={idx} className="flex gap-1.5 items-start">
                                          <span className="text-brand-blue font-bold font-mono text-[10px] mt-0.5">•</span>
                                          <span className="font-sans text-[10px] text-slate-600 dark:text-zinc-400 line-clamp-1">{d}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* List of Custom & Default Projects for Single Management */}
                        <div className="border-t border-slate-200/60 pt-8 mt-12 space-y-8">
                          {/* DYNAMIC CUSTOM PROJECTS SECTION */}
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1d1d1f] dark:text-zinc-200">
                                Manage Dynamic Custom Projects ({customProjects.length})
                              </h4>
                              <p className="font-sans text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                                A list of your custom uploaded case works. Delete individual entries to remove them instantly.
                              </p>
                            </div>

                            {deleteError && (
                              <div className="flex items-start gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{deleteError}</span>
                              </div>
                            )}

                            {customProjects.length === 0 ? (
                              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/10">
                                <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold">No custom projects created yet</span>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {customProjects.map((proj) => {
                                  const isLocalOnly = !serverProjectIds.includes(proj.id);
                                  return (
                                    <div 
                                      key={proj.id}
                                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/30 border border-slate-200/80 dark:border-neutral-800/80 rounded-xl hover:border-slate-300 dark:hover:border-neutral-700 transition-all"
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
                                          <h5 className="font-sans font-semibold text-xs text-brand-navy dark:text-zinc-200 flex items-center gap-2 leading-tight">
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
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
                                        title="Delete project"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* DEFAULT CASE STUDIES SECTION */}
                          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-neutral-900">
                            <div className="space-y-1">
                              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1d1d1f] dark:text-zinc-200">
                                Default Built-in Case Studies ({PROJECTS.length})
                              </h4>
                              <p className="font-sans text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                                Hide or restore the original, premium curated showcase entries individually to fine-tune your portfolio visual composition.
                              </p>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {PROJECTS.map((proj) => {
                                const isVisible = projects.some(p => p.id === proj.id);
                                return (
                                  <div 
                                    key={proj.id}
                                    className={`flex items-center justify-between p-3 border rounded-xl transition-all ${isVisible ? "bg-slate-50 dark:bg-zinc-900/30 border-slate-200/80 dark:border-neutral-800/80" : "bg-slate-100/50 dark:bg-zinc-950/20 border-slate-250 dark:border-neutral-900/40 opacity-70"}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {proj.image && (
                                        <img 
                                          src={proj.image} 
                                          alt={proj.title} 
                                          className={`w-12 h-8 object-cover rounded bg-slate-100 border border-slate-200 ${!isVisible ? "grayscale brightness-75" : ""}`}
                                          referrerPolicy="no-referrer"
                                        />
                                      )}
                                      <div>
                                        <h5 className="font-sans font-semibold text-xs text-brand-navy dark:text-zinc-200 flex items-center gap-2 leading-tight">
                                          {proj.title}
                                          <span className="font-sans text-[8px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40 px-1.5 py-0.5 rounded-md">
                                            Built-In
                                          </span>
                                          {!isVisible && (
                                            <span className="font-sans text-[8px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 px-1.5 py-0.5 rounded-md">
                                              Hidden
                                            </span>
                                          )}
                                        </h5>
                                        <span className="font-mono text-[9px] text-slate-400">
                                          {proj.category} • {proj.year}
                                        </span>
                                      </div>
                                    </div>

                                    {isVisible ? (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProject(proj.id)}
                                        className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg transition-all cursor-pointer"
                                        title="Hide default project"
                                      >
                                        Hide Case
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRestoreProject(proj.id)}
                                        className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg transition-all cursor-pointer"
                                        title="Restore default project"
                                      >
                                        Restore Case
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

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
                    ) : activeTab === "parallax" ? (
                      // PARALLAX BACKGROUNDS LISTING VIEW
                      <div className="space-y-6">
                        <div className="border-b border-slate-100 dark:border-neutral-900 pb-5">
                          <h3 className="font-display font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                            Zoom Parallax Canvas Backgrounds.
                          </h3>
                          <p className="font-sans text-xs text-brand-slate mt-1.5">
                            Upload and manage custom backdrops for surrounding panels 1 through 6 in the main entrance parallax scroll space. (Panel 0 is the center "Scroll Down" interface and is not editable).
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                          {[1, 2, 3, 4, 5, 6].map((slotIdx) => {
                            const customUrl = customParallaxImages?.[slotIdx];
                            const error = parallaxErrors[slotIdx];
                            const isUploading = uploadingParallaxSlot === slotIdx;

                            // Friendly label based on visual positioning
                            const slotLabels: Record<number, string> = {
                              1: "Slot 1 — Top Left Panel (Small)",
                              2: "Slot 2 — Mid Left Panel (Vertical)",
                              3: "Slot 3 — Mid Right Panel (Large)",
                              4: "Slot 4 — Bottom Left Panel (Wide)",
                              5: "Slot 5 — Bottom Center Panel (Wide)",
                              6: "Slot 6 — Bottom Right Panel (Accent)"
                            };

                            return (
                              <div 
                                key={slotIdx}
                                className="border border-slate-200/80 dark:border-neutral-800/80 rounded-xl p-4 bg-slate-50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-4"
                              >
                                <div className="space-y-1.5">
                                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200">
                                    {slotLabels[slotIdx]}
                                  </h4>
                                  <p className="font-sans text-[10px] text-slate-400 dark:text-zinc-500">
                                    Determines backdrop artwork behind the portfolio container
                                  </p>
                                </div>

                                <div className="relative h-32 rounded-lg overflow-hidden bg-slate-200/60 dark:bg-zinc-800/60 border border-slate-300/30 dark:border-neutral-700/30 flex items-center justify-center group">
                                  {customUrl ? (
                                    <img 
                                      src={customUrl} 
                                      alt={`Slot ${slotIdx}`} 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="text-center p-3 space-y-1">
                                      <span className="font-mono text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">
                                        Default Asset Active
                                      </span>
                                      <span className="font-sans text-[10px] text-slate-400/80 block">
                                        Showing standard curated stock backdrop
                                      </span>
                                    </div>
                                  )}

                                  {isUploading && (
                                    <div className="absolute inset-0 bg-white/85 dark:bg-black/85 backdrop-blur-xs flex flex-col justify-center items-center gap-2">
                                      <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                      <span className="font-sans text-[10px] font-semibold text-brand-blue">Saving Asset...</span>
                                    </div>
                                  )}
                                </div>

                                {error && (
                                  <p className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2 rounded border border-rose-100 dark:border-rose-900/30">
                                    {error}
                                  </p>
                                )}

                                <div className="flex gap-2">
                                  <input 
                                    type="file" 
                                    ref={(el) => { fileInputRefs.current[slotIdx] = el; }}
                                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                                    className="hidden" 
                                    onChange={(e) => handleParallaxFileChange(slotIdx, e)}
                                    disabled={isUploading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[slotIdx]?.click()}
                                    disabled={isUploading}
                                    className="flex-1 bg-brand-navy hover:bg-brand-blue text-white text-center font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <Upload className="w-3 h-3" />
                                    {customUrl ? "Replace Artwork" : "Upload Image"}
                                  </button>

                                  {customUrl && (
                                    <button
                                      type="button"
                                      onClick={() => handleParallaxReset(slotIdx)}
                                      disabled={isUploading}
                                      className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-sans text-[10px] font-bold uppercase tracking-wider"
                                      title="Restore fallback thumbnail"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : activeTab === "uploads" ? (
                      // MEDIA LIBRARY / UPLOADS VIEW
                      <div className="space-y-6">
                        <div className="border-b border-slate-100 dark:border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h3 className="font-display font-black text-2xl text-brand-navy dark:text-zinc-100 tracking-tight flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-brand-blue" /> Media Library & Assets
                            </h3>
                            <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 mt-1.5">
                              Manage all uploaded files, images, and visual assets in one cohesive grid.
                            </p>
                          </div>
                          {hiddenPresetUrls.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setHiddenPresetUrls([]);
                                localStorage.removeItem("hidden_preset_urls");
                              }}
                              className="self-start sm:self-auto bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-mono text-brand-navy dark:text-zinc-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Restore Deleted Presets ({hiddenPresetUrls.length})
                            </button>
                          )}
                        </div>

                        {uploadsError && (
                          <div className="flex items-start gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{uploadsError}</span>
                          </div>
                        )}

                        {/* UNIFIED IMAGES GRID */}
                        <div className="space-y-4">
                          {isUploadsLoading ? (
                            <div className="py-12 text-center space-y-3">
                              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
                              <p className="font-sans text-xs text-slate-400">Loading custom uploads...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                              {[
                                ...PRESET_IMAGES.filter((img) => !hiddenPresetUrls.includes(img.url)).map((img, idx) => ({
                                  id: `preset-${idx}`,
                                  filename: img.name,
                                  url: img.url,
                                  size: 154221,
                                  isPreset: true,
                                  rawUrl: img.url
                                })),
                                ...uploadsList.map((up) => ({
                                  id: up.id,
                                  filename: up.filename,
                                  url: up.url,
                                  size: up.size,
                                  isPreset: false,
                                  rawUrl: up.url
                                }))
                              ].map((item) => (
                                <div
                                  key={item.id}
                                  className="border border-slate-200/80 dark:border-neutral-800/80 rounded-xl p-3 bg-slate-50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3 group hover:border-slate-300 dark:hover:border-neutral-700 transition-all"
                                >
                                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-zinc-850 border border-slate-300/30 dark:border-neutral-700/30 flex items-center justify-center">
                                    <img 
                                      src={item.url} 
                                      alt={item.filename} 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    {item.isPreset ? (
                                      <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white tracking-wider uppercase">
                                        System Preset
                                      </div>
                                    ) : (
                                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white tracking-wider">
                                        {(item.size / 1024).toFixed(1)} KB
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <h4 className="font-sans font-bold text-[11px] text-brand-navy dark:text-zinc-200 truncate" title={item.filename}>
                                      {item.filename}
                                    </h4>
                                    <p className="font-mono text-[9px] text-slate-450 dark:text-zinc-500 truncate" title={item.url}>
                                      {item.url}
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    {confirmDeleteUploadId === item.id ? (
                                      <div className="flex gap-1.5 w-full">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (item.isPreset) {
                                              handleHidePresetUrl(item.rawUrl);
                                            } else {
                                              handleDeleteUpload(item.id);
                                            }
                                            setConfirmDeleteUploadId(null);
                                          }}
                                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-center font-sans text-[9px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setConfirmDeleteUploadId(null)}
                                          className="flex-1 bg-slate-200 dark:bg-zinc-800 text-[#1d1d1f] dark:text-zinc-300 text-center font-sans text-[9px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(item.url);
                                            setCopiedUploadId(item.id);
                                            setTimeout(() => setCopiedUploadId(null), 2000);
                                          }}
                                          className="flex-grow bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1d1d1f] dark:text-zinc-300 text-center font-sans text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                                        >
                                          {copiedUploadId === item.id ? "Copied!" : "Copy Path"}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setConfirmDeleteUploadId(item.id)}
                                          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                          title="Delete Asset"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
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
