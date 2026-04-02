import  { useRef } from "react";
import { motion } from "motion/react";
import { Terminal, Target, Code2, LineChart, Play, CheckCircle2 } from "lucide-react";

const DashboardMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full h-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-zinc-200/50 flex flex-col font-sans"
  >
    <div className="h-10 border-b border-zinc-100 flex items-center px-4 justify-between bg-zinc-50/80">
      <div className="flex gap-1.5 items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Dashboard</div>
    </div>
    <div className="p-5 flex-1 flex flex-col gap-4 bg-zinc-50/50">
      <div className="flex gap-4">
        <motion.div whileHover={{ y: -2 }} className="flex-1 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Time</div>
          <div className="text-2xl font-bold text-zinc-800">124h 30m</div>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="flex-1 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">Active Streak</div>
          <div className="text-2xl font-bold text-[#5e43f3]">12 Days</div>
        </motion.div>
      </div>
      <motion.div whileHover={{ y: -2 }} className="flex-1 bg-white rounded-xl border border-zinc-100 shadow-sm p-4 flex items-end justify-between px-6 transition-shadow hover:shadow-md">
        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
          <motion.div 
            key={i} 
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 0.8, delay: 0.3 + (i * 0.1), type: "spring" }}
            className="w-[12%] bg-[#5e43f3] rounded-t-md relative group cursor-pointer" 
            style={{ opacity: 0.8 + (i * 0.05) }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {h}h
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const SessionMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full h-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-zinc-200/50 flex flex-col font-sans"
  >
    <div className="h-10 border-b border-zinc-100 flex items-center px-4 justify-between bg-zinc-50/80">
      <div className="flex gap-1.5 items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
      </div>
      <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Log a Session</div>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-center items-center bg-zinc-50/50">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm w-full max-w-sm flex flex-col items-center gap-6 text-center transition-shadow hover:shadow-lg"
      >
        <div className="w-24 h-24 bg-[#5e43f3]/5 rounded-full flex items-center justify-center relative shadow-inner">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-[#5e43f3]/20 border-t-[#5e43f3] rounded-full" 
          />
          <Play className="w-10 h-10 text-[#5e43f3] ml-1" />
        </div>
        <div>
          <div className="text-4xl font-mono font-bold text-zinc-800 tracking-tighter mb-2">02:45:12</div>
          <div className="text-xs uppercase tracking-widest font-semibold text-zinc-400">Working on: Backend API</div>
        </div>
        <div className="w-full flex gap-3 mt-4">
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 text-[11px] uppercase tracking-wider font-bold transition-colors hover:bg-zinc-200">Pause</motion.button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1 py-3 rounded-xl bg-[#5e43f3] text-white text-[11px] uppercase tracking-wider font-bold shadow-lg shadow-[#5e43f3]/30 transition-colors hover:bg-[#4d35ce]">Complete</motion.button>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const GoalMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full h-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-zinc-200/50 flex flex-col font-sans"
  >
    <div className="h-10 border-b border-zinc-100 flex items-center px-4 justify-between bg-zinc-50/80">
      <div className="flex gap-1.5 items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
      </div>
      <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Goals</div>
    </div>
    <div className="p-5 flex-1 flex flex-col gap-4 bg-zinc-50/50 justify-center">
      {["Launch MVP", "Learn GraphQL", "Write Documentation"].map((goal, i) => (
        <motion.div 
          key={i} 
          whileHover={{ x: 5 }}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`p-1.5 rounded-full ${i === 0 ? 'bg-[#5e43f3]/10' : 'bg-zinc-100'}`}
              >
                <CheckCircle2 className={`w-4 h-4 ${i === 0 ? 'text-[#5e43f3]' : 'text-zinc-300'}`} />
              </motion.div>
              <span className={`text-[13px] uppercase tracking-wider font-bold ${i === 0 ? 'text-zinc-800' : 'text-zinc-500'}`}>{goal}</span>
            </div>
            <span className="text-[11px] font-bold text-[#5e43f3] bg-[#5e43f3]/10 py-1 px-2 rounded-full">{100 - (i * 30)}%</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${100 - (i * 30)}%` }}
              transition={{ duration: 1, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
              className="bg-[#5e43f3] h-full rounded-full" 
            />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const SkillMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full h-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-zinc-200/50 flex flex-col font-sans"
  >
    <div className="h-10 border-b border-zinc-100 flex items-center px-4 justify-between bg-zinc-50/80">
      <div className="flex gap-1.5 items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
      </div>
      <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Skills</div>
    </div>
    <div className="p-5 flex-1 flex flex-col gap-4 bg-zinc-50/50">
      <div className="grid grid-cols-2 gap-4 h-full">
        {[{ name: "React", level: 90 }, { name: "TypeScript", level: 85 }, { name: "Node.js", level: 70 }, { name: "MongoDB", level: 60 }].map((skill, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.05 }}
            className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-center items-center gap-4 transition-all hover:shadow-md cursor-pointer"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                <path
                  className="text-zinc-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  whileInView={{ strokeDasharray: `${skill.level}, 100` }}
                  transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                  className="text-[#5e43f3]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-zinc-800">{skill.level}</div>
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-600">{skill.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const features = [
  {
    title: "Insightful Dashboard",
    description: "Your complete workflow visualized. Spot trends, maintain streaks, and see exactly where your time goes across projects and tech stacks.",
    mockup: <DashboardMockup />,
    icon: <LineChart className="w-6 h-6 text-[#5e43f3]" />
  },
  {
    title: "Deep Work Sessions",
    description: "A distraction-free zone for logging your coding sessions. Track your active flow state and pause gracefully without losing context.",
    mockup: <SessionMockup />,
    icon: <Terminal className="w-6 h-6 text-[#5e43f3]" />
  },
  {
    title: "Actionable Goals",
    description: "Break complex epics into bite-sized milestones. See real-time progress bars update as you log sessions towards your active targets.",
    mockup: <GoalMockup />,
    icon: <Target className="w-6 h-6 text-[#5e43f3]" />
  },
  {
    title: "Skill Progression",
    description: "Quantify your expertise. Automatically build your skill tree based on the technologies you use during your tracked sessions.",
    mockup: <SkillMockup />,
    icon: <Code2 className="w-6 h-6 text-[#5e43f3]" />
  }
];

export const FeaturesBento = () => {
  return (
    <div className="w-full bg-[#0a0a0c] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-32">
          {features.map((feature, idx) => (
            <FeatureRow 
              key={idx} 
              feature={feature} 
              isReversed={idx % 2 !== 0} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ feature, isReversed }: { feature: any, isReversed: boolean }) => {
  const ref = useRef(null);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-12 lg:gap-24 items-center ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
    >
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#5e43f3]/10 border border-[#5e43f3]/20 mb-2">
          {feature.icon}
        </div>
        <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          {feature.title}
        </h3>
        <p className="text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          {feature.description}
        </p>
      </div>
      
      <div className="flex-1 w-full max-w-xl lg:max-w-none">
        <div className="relative aspect-square sm:aspect-4/3 rounded-3xl bg-linear-to-br from-[#5e43f3]/20 to-transparent p-1">
          <div className="absolute inset-0 bg-zinc-900/50 rounded-3xl backdrop-blur-3xl" />
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full h-full rounded-[23px] overflow-hidden"
          >
            {feature.mockup}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
