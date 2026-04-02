import { motion } from "motion/react";
import { Terminal } from "lucide-react";
import { Link } from "react-router";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#5e43f3] rounded-xl flex items-center justify-center">
              <Terminal className="text-white h-5 w-5" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DevTrack</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
