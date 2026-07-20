import { motion } from "framer-motion";
import { Project } from "../types";
import { ArrowUpRight, Camera } from "lucide-react";

interface ScrollerItem {
  id: string;
  src: string;
  title: string;
  category: string;
  project: Project | null;
}

interface ImageScrollerProps {
  projects: Project[];
  customParallaxImages?: Record<number, string>;
  onProjectClick: (project: Project) => void;
}

export default function ImageScroller({ projects, customParallaxImages, onProjectClick }: ImageScrollerProps) {
  // Extract all beautiful images we have
  const items: ScrollerItem[] = [];

  // Add actual projects
  projects.forEach((proj) => {
    items.push({
      id: `project-${proj.id}`,
      src: proj.image,
      title: proj.title,
      category: proj.category,
      project: proj,
    });
  });

  // Add custom uploaded backgrounds as items
  if (customParallaxImages) {
    Object.entries(customParallaxImages).forEach(([key, url]) => {
      if (url && !items.some(item => item.src === url)) {
        items.push({
          id: `custom-bg-${key}`,
          src: url,
          title: `Custom Landscape Backdrop ${key}`,
          category: "Visual Asset",
          project: null,
        });
      }
    });
  }

  // Curated fallback beautiful stock images to ensure high density
  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
      title: "Corporate Monolithic Structure",
      category: "Architectural Design",
    },
    {
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
      title: "Metropolitan Crossing",
      category: "Urban Planning",
    },
    {
      src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
      title: "Chromatic Gradient Wave",
      category: "Creative Direction",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
      title: "Alpine Ridge Vista",
      category: "Photography",
    },
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
      title: "Curvilinear Spatial Forms",
      category: "Identity Systems",
    },
    {
      src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
      title: "Tidal Surge Kinetic",
      category: "Art Direction",
    }
  ];

  defaultImages.forEach((img, idx) => {
    if (items.length < 12 && !items.some(item => item.src === img.src)) {
      items.push({
        id: `default-${idx}`,
        src: img.src,
        title: img.title,
        category: img.category,
        project: null,
      });
    }
  });

  // Split into two rows/tracks for contrasting motion direction
  const halfLength = Math.ceil(items.length / 2);
  const row1Items = items.slice(0, halfLength);
  const row2Items = items.slice(halfLength);

  // Duplicate the arrays to allow for infinite looping
  const track1 = [...row1Items, ...row1Items, ...row1Items];
  const track2 = [...row2Items, ...row2Items, ...row2Items];

  const handleCardClick = (item: ScrollerItem) => {
    if (item.project) {
      onProjectClick(item.project);
    } else {
      // If it doesn't have a direct project, find a fallback or open the first project to demonstrate the detail panel
      if (projects.length > 0) {
        onProjectClick({
          ...projects[0],
          title: item.title,
          image: item.src,
          category: item.category,
          description: `This is a curated visual asset styled in our interactive portfolio scroller. Designed to showcase modern layouts and continuous responsive dynamic frames.`,
        });
      }
    }
  };

  return (
    <div className="w-full space-y-8 py-10 overflow-hidden select-none relative">
      {/* Track 1: Moving Left */}
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Soft edge fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-[#08080a] dark:via-[#08080a]/40 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/40 to-transparent dark:from-[#08080a] dark:via-[#08080a]/40 dark:to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, "-33.333%"] }}
          transition={{
            ease: "linear",
            duration: 38,
            repeat: Infinity,
          }}
          className="flex gap-6 w-max flex-nowrap"
          style={{ willChange: "transform" }}
        >
          {track1.map((item, idx) => (
            <div
              key={`${item.id}-t1-${idx}`}
              onClick={() => handleCardClick(item)}
              className="relative aspect-[16/10] w-[260px] sm:w-[360px] md:w-[440px] rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl border border-neutral-250/20 dark:border-neutral-800/40 bg-zinc-100 dark:bg-[#121214] transition-all duration-500 pointer-events-auto"
            >
              {/* Image with subtle modern hover zoom and high-quality rendering */}
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              
              {/* Premium overlay with gradient card details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6" />
              
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col justify-end text-white">
                <span className="font-sans text-[9px] uppercase font-bold tracking-widest text-[#0066ff]">
                  {item.category}
                </span>
                <h3 className="font-sans font-black text-sm sm:text-base md:text-lg tracking-tight mt-1 leading-snug drop-shadow-sm flex items-center gap-2">
                  {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0 text-[#0066ff]" />
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Track 2: Moving Right */}
      <div className="relative w-full flex items-center overflow-hidden pb-4">
        {/* Soft edge fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-[#08080a] dark:via-[#08080a]/40 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/40 to-transparent dark:from-[#08080a] dark:via-[#08080a]/40 dark:to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["-33.333%", 0] }}
          transition={{
            ease: "linear",
            duration: 42,
            repeat: Infinity,
          }}
          className="flex gap-6 w-max flex-nowrap"
          style={{ willChange: "transform" }}
        >
          {track2.map((item, idx) => (
            <div
              key={`${item.id}-t2-${idx}`}
              onClick={() => handleCardClick(item)}
              className="relative aspect-[16/10] w-[260px] sm:w-[360px] md:w-[440px] rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl border border-neutral-250/20 dark:border-neutral-800/40 bg-zinc-100 dark:bg-[#121214] transition-all duration-500 pointer-events-auto"
            >
              {/* Image with subtle modern hover zoom */}
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              
              {/* Premium overlay with gradient card details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6" />
              
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col justify-end text-white">
                <span className="font-sans text-[9px] uppercase font-bold tracking-widest text-[#0066ff]">
                  {item.category}
                </span>
                <h3 className="font-sans font-black text-sm sm:text-base md:text-lg tracking-tight mt-1 leading-snug drop-shadow-sm flex items-center gap-2">
                  {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0 text-[#0066ff]" />
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Helpful Interactive Legend/Sub-hint */}
      <div className="text-center w-full max-w-7xl mx-auto px-6 mt-4">
        <p className="font-sans text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-brand-blue" />
          Click any design study or dynamic backdrop frame to inspect detail logs
        </p>
      </div>
    </div>
  );
}
