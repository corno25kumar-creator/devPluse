import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Code2, Terminal, Database, Layers } from "lucide-react";
import { Link } from "react-router";
import createGlobe from "cobe";

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.15,
      dark: 1,
      diffuse: 2.5,
      mapSamples: 25000,
      mapBrightness: 8,
      baseColor: [0.05, 0.2, 0.6], // Deep ocean blue
      markerColor: [0.2, 0.8, 0.3], // Vibrant green markers
      glowColor: [1, 0.85, 0.5], // Sunlight glow
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.0060], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.07 },
        { location: [35.6895, 139.6917], size: 0.09 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      }
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1';
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 800, aspectRatio: 1, margin: 'auto', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 2s ease',
        }}
      />
    </div>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });
  const mouseXReverse = useSpring(x, { stiffness: 100, damping: 20, bounce: 0 });
  const mouseYReverse = useSpring(y, { stiffness: 100, damping: 20, bounce: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center, divided by a factor to control intensity
    x.set((event.clientX - centerX) / 40);
    y.set((event.clientY - centerY) / 40);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#0a0a0c] pt-40 pb-30 min-h-screen flex items-center justify-center perspective-1000"
      style={{ perspective: "1000px" }}
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#5e43f315_0%,transparent_60%)]" />

      {/* Rotating Globe in the background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-200 -z-10 pointer-events-none mix-blend-screen opacity-60">
        <motion.div
           style={{
             x: useTransform(mouseXReverse, (val) => -val * 2),
             y: useTransform(mouseYReverse, (val) => -val * 2),
           }}
           className="w-full h-full"
        >
          <Globe />
        </motion.div>
      </div>

      {/* Floating Elements that react to mouse */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ x: useTransform(mouseX, (v) => v * 3), y: useTransform(mouseY, (v) => v * 3) }}
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center"
        >
          <Code2 className="text-[#5e43f3] w-6 h-6" />
        </motion.div>
        
        <motion.div 
          style={{ x: useTransform(mouseX, (v) => -v * 2), y: useTransform(mouseY, (v) => -v * 2) }}
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#5e43f3]/10 backdrop-blur-md rounded-2xl border border-[#5e43f3]/20 flex items-center justify-center"
        >
          <Terminal className="text-white w-8 h-8" />
        </motion.div>

        <motion.div 
          style={{ x: useTransform(mouseX, (v) => v * 4), y: useTransform(mouseY, (v) => -v * 4) }}
          className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center"
        >
          <Database className="text-emerald-400 w-5 h-5" />
        </motion.div>
        
        <motion.div 
          style={{ x: useTransform(mouseX, (v) => -v * 5), y: useTransform(mouseY, (v) => v * 5) }}
          className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center"
        >
          <Layers className="text-amber-400 w-7 h-7" />
        </motion.div>
      </div>

      {/* Foreground Content */}
      <motion.div 
        style={{
          rotateX: useTransform(mouseY, (v) => -v * 0.5),
          rotateY: useTransform(mouseX, (v) => v * 0.5),
          z: 50,
          transformStyle: "preserve-3d"
        }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10"
      >
        <div className="overflow-visible mb-6 relative" style={{ perspective: "1000px" }}>
          <motion.h1
            initial={{ y: 100, opacity: 0, translateZ: 100 }}
            animate={{ y: 0, opacity: 1, translateZ: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-6xl font-extrabold tracking-tighter text-white sm:text-8xl leading-tight drop-shadow-2xl"
          >
            Master your flow. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5e43f3] to-[#8c78f5]">Own your work.</span>
          </motion.h1>
        </div>

        <div className="overflow-visible relative" style={{ perspective: "1000px" }}>
          <motion.p
            initial={{ y: 50, opacity: 0, translateZ: 80 }}
            animate={{ y: 0, opacity: 1, translateZ: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-xl text-zinc-300 drop-shadow-md"
          >
            A high-performance productivity suite exclusively for developers. Log sessions, break down goals, and measure your skills in a distraction-free environment.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, translateZ: 120 }}
          animate={{ opacity: 1, scale: 1, translateZ: 60 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-4 relative"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="group inline-flex h-14 items-center justify-center rounded-xl bg-[#5e43f3] px-8 text-base font-semibold text-white shadow-[0_0_40px_-10px_#5e43f3] transition-all hover:bg-[#4d35ce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e43f3] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Start Tracking Now
              <motion.div
                className="ml-2 inline-flex"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl pointer-events-none" aria-hidden="true">
        <div className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#5e43f3] to-[#2b1e70] opacity-10" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
};
