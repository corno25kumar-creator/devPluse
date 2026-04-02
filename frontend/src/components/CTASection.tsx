import { motion } from "motion/react";

export const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0c] py-32 border-t border-zinc-900/50">
      <div className="absolute inset-0 bg-[#5e43f3]/5 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-8">
            Ready to reclaim your <span className="text-[#5e43f3]">focus?</span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-zinc-400 max-w-2xl mx-auto">
            Join thousands of developers who are already tracking their deep work, hitting milestones faster, and leveling up their tech stack.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-lg bg-black/60 backdrop-blur-xl border border-[#5e43f3]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#5e43f3]/10"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-zinc-500 font-mono ml-2">~/developer/flow-state</div>
              </div>
              {/* Terminal body */}
              <div className="p-6 text-left font-mono text-sm leading-relaxed text-zinc-300">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <span className="text-[#5e43f3]">$</span> echo "Built for developers by developers."
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-2 text-zinc-400"
                >
                  {`> A productivity tracker that actually understands context switching, deep work, and repo activity. Stop using generic task lists.`}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 2.0, duration: 0.4 }}
                  className="mt-6 flex items-center text-emerald-400"
                >
                  <span className="text-[#5e43f3] mr-2">$</span> ./start.sh
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-emerald-400 ml-1 inline-block"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
