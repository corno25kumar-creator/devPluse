import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Clock, Code, Database, Zap } from "lucide-react";

export const AnimatedFeatureSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 30%"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div ref={containerRef} className="relative py-32 bg-[#0a0a0c] overflow-hidden border-t border-zinc-900/50" style={{ position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-24">
          <motion.h2 
            style={{ opacity }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            The flow state, <span className="text-[#5e43f3]">visualized.</span>
          </motion.h2>
          <motion.p 
            style={{ opacity }}
            className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Watch your productivity map across your entire tech stack as you build.
          </motion.p>
        </div>

        <div className="relative flex justify-center items-center min-h-[400px]">
          {/* Central Connecting SVG Line */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
            <svg 
              className="w-full h-full max-w-4xl" 
              viewBox="0 0 1000 400" 
              fill="none" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 50 200 C 200 50, 300 350, 500 200 C 700 50, 800 350, 950 200"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5e43f3" stopOpacity="0" />
                  <stop offset="0.2" stopColor="#5e43f3" />
                  <stop offset="0.8" stopColor="#8c78f5" />
                  <stop offset="1" stopColor="#8c78f5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Feature Nodes */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 px-4">
            {[
              { icon: Clock, title: "Deep Focus", desc: "Track uninterrupted time", delay: 0.2 },
              { icon: Code, title: "Code Metrics", desc: "Measure output quality", delay: 0.4 },
              { icon: Database, title: "Knowledge", desc: "Build your personal DB", delay: 0.6 },
              { icon: Zap, title: "Insights", desc: "Actionable flow data", delay: 0.8 }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center text-center p-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 hover:border-[#5e43f3]/50 transition-colors"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <div className="w-14 h-14 bg-[#5e43f3]/20 text-[#5e43f3] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
