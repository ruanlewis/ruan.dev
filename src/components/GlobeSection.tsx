import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Globe from "@/components/ui/globe";

function NetworkBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const density = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dotColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 102, 255, 0.08)";
      const maxDistance = 150;

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Dynamic alpha based on distance
            ctx.strokeStyle = isDark 
              ? `rgba(255, 255, 255, ${alpha * 0.12})`
              : `rgba(0, 102, 255, ${alpha * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function GlobeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);

  const [metrics, setMetrics] = useState({
    fontOSize: 64,
    targetX: 0,
    targetY: 0,
    initialX: 0,
    initialY: 0,
    containerWidth: 1000,
    containerHeight: 600,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Robustly monitor and detect the active light/dark mode class of the HTML element
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // Recalculate positions based on viewport and real DOM rendering
  const updateMetrics = () => {
    if (!containerRef.current || !measureRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const measureRect = measureRef.current.getBoundingClientRect();

    // fontOSize is measured directly from the natural "o" letter in the hidden reference heading
    const fontOSize = Math.max(measureRect.height, measureRect.width);

    // Exact top-left target coordinates of the "o" character relative to our sticky viewport container (shifted 5px left)
    const targetX = measureRect.left - containerRect.left - 5;
    const targetY = measureRect.top - containerRect.top;

    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Center coordinates for the large 250px globe at the start
    const initialX = (containerWidth - 250) / 2;
    const initialY = (containerHeight - 250) / 2;

    setMetrics({
      fontOSize,
      targetX,
      targetY,
      initialX,
      initialY,
      containerWidth,
      containerHeight,
    });
  };

  useEffect(() => {
    setIsMounted(true);
    // Let font loads or other layout shifts settle, then measure
    const timer = setTimeout(() => {
      updateMetrics();
    }, 150);

    // Dynamic adjustment when fonts have finished loading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateMetrics();
      });
    }

    window.addEventListener("resize", updateMetrics);
    return () => {
      window.removeEventListener("resize", updateMetrics);
      clearTimeout(timer);
    };
  }, []);

  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking across the 200vh section block
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll continuous interpolation utilizing single-parameter functions
  // to dynamically adapt to state updates (like window resize) on the fly.
  const globeX = useTransform(scrollYProgress, (progress) => {
    if (prefersReducedMotion) return metrics.targetX;
    // Clamp the progress to 1 so the globe stays pinned once docked
    const clampedProgress = Math.min(progress, 1);
    return clampedProgress * (metrics.targetX - metrics.initialX) + metrics.initialX;
  });

  const globeY = useTransform(scrollYProgress, (progress) => {
    if (prefersReducedMotion) return metrics.targetY;
    const clampedProgress = Math.min(progress, 1);
    return clampedProgress * (metrics.targetY - metrics.initialY) + metrics.initialY;
  });

  const globeSize = useTransform(scrollYProgress, (progress) => {
    if (prefersReducedMotion) return metrics.fontOSize;
    const clampedProgress = Math.min(progress, 1);
    return clampedProgress * (metrics.fontOSize - 250) + 250;
  });

  const placeholderSize = useTransform(scrollYProgress, (progress) => {
    if (prefersReducedMotion) return metrics.fontOSize;
    const clampedProgress = Math.min(progress, 1);
    return clampedProgress * (metrics.fontOSize - 250) + 250;
  });

  // Calculate scaling factor of the 250px globe element to fit the target font size
  const globeScale = useTransform(globeSize, (size) => size / 250);

  return (
    <div
      ref={sectionRef}
      className="relative h-[200vh] w-full bg-white dark:bg-[#08080a] text-zinc-900 dark:text-white transition-colors duration-500 overflow-visible select-none"
      id="collaboration"
    >
      {/* Dynamic interactive background node networking with low opacity */}
      <NetworkBackground isDark={isDark} />

      {/* Immersive background cosmos / global glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.03),transparent_55%)] dark:bg-[radial-gradient(circle_at_center,rgba(36,81,255,0.06),transparent_55%)] pointer-events-none transition-all duration-500" />

      {/* 100vh Sticky Canvas Viewport */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6"
      >
        {/* Helper reference corner lines (CAD Grid Style) */}
        <div className="absolute top-4 left-6 font-mono text-[9px] text-zinc-400 dark:text-zinc-600 tracking-wider hidden md:block">
          SECT // GLOBAL_COLLABORATION_DOCK
        </div>
        <div className="absolute bottom-4 right-6 font-mono text-[9px] text-zinc-400 dark:text-zinc-600 tracking-wider hidden md:block">
          DOCK_LOCK_RATIO // 100%
        </div>

        {/* 
          1. HIDDEN NATURAL HEADING FOR PRECISE LAYOUT MEASUREMENTS 
          We render the identical heading hidden in the background. It wraps and flows
          exactly like the visible heading, giving us 100% accurate viewport coordinates
          for the target "o" letter in "world" at any screen size or breakpoint.
        */}
        <div className="absolute inset-x-6 opacity-0 pointer-events-none select-none z-0 flex justify-center items-center">
          <h2
            className="font-sans font-bold tracking-tight text-center max-w-[90vw] md:max-w-[85vw] leading-[1.1]"
            style={{ fontSize: "clamp(22px, 4.4vw, 100px)" }}
          >
            Collaborating all over the{" "}
            <span className="whitespace-nowrap inline-flex items-baseline relative">
              w<span ref={measureRef} className="inline-block">o</span>rld.
            </span>
          </h2>
        </div>

        {/* 
          2. THE ACTIVE INTERACTIVE VISIBLE HEADING 
          The heading uses the dynamically-shrinking placeholder slot so that the letters 
          realign seamlessly without wrapping or jumping.
        */}
        <h2
          className="font-sans font-bold tracking-tight text-center max-w-[90vw] md:max-w-[85vw] leading-[1.1] z-10 text-brand-navy"
          style={{ fontSize: "clamp(22px, 4.4vw, 100px)" }}
        >
          Collaborating all over the{" "}
          <span className="whitespace-nowrap inline-flex items-baseline relative">
            w
            <motion.span
              ref={placeholderRef}
              className="inline-block relative align-middle self-center opacity-0 select-none pointer-events-none"
              style={{
                width: placeholderSize,
                height: placeholderSize,
              }}
            />
            rld.
          </span>
        </h2>

        {/* 
          3. SCROLL-DRIVEN GLOBE CONTAINER 
          Positioned absolutely over the sticky viewport, smoothly interpolating its
          coordinates and scale to dock exactly over the placeholder slot.
        */}
        {isMounted && (
          <motion.div
            className="absolute top-0 left-0 z-20"
            style={{
              x: globeX,
              y: globeY,
              width: 250,
              height: 250,
              transformOrigin: "top left",
              scale: globeScale,
            }}
          >
            <div className="w-full h-full relative">
              <Globe />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}