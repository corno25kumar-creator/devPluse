import { motion } from "motion/react";
import type { Variants } from "motion/react"; // Use 'import type' here
import { 
  Terminal, LayoutDashboard, Target, Code2, 
  Bell, Settings, LogOut, Clock, Plus,
  ChevronDown, Flame, Timer, Lightbulb, 
  Calendar as CalendarIcon, CheckCircle2, Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

// Mock Data
const sessionsData = [
  { name: 'Mon', sessions: 3 },
  { name: 'Tue', sessions: 5 },
  { name: 'Wed', sessions: 2 },
  { name: 'Thu', sessions: 6 },
  { name: 'Fri', sessions: 4 },
  { name: 'Sat', sessions: 1 },
  { name: 'Sun', sessions: 0 },
];

const goalStatusData = [
  { name: 'Completed', value: 12, color: '#10b981' },
  { name: 'In Progress', value: 5, color: '#6366f1' },
  { name: 'Blocked', value: 2, color: '#f43f5e' },
];

const skillTiers = [
  { name: 'React', level: 85, tier: 'Expert' },
  { name: 'TypeScript', level: 70, tier: 'Advanced' },
  { name: 'Node.js', level: 60, tier: 'Intermediate' },
  { name: 'Python', level: 40, tier: 'Novice' },
];

const heatmapData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 5));

const getHeatmapColor = (value: number) => {
  if (value === 0) return 'bg-slate-100';
  if (value === 1) return 'bg-indigo-200';
  if (value === 2) return 'bg-indigo-300';
  if (value === 3) return 'bg-indigo-400';
  return 'bg-indigo-500';
};

// Applied Variants type here
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Applied Variants type here
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Sidebar - Light Theme */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Terminal className="text-white h-5 w-5" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">DevTrack</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Overview</p>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
            <Clock className="h-5 w-5" />
            Sessions
          </a>
         <Link to="/goals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
            <Target className="h-5 w-5" />
            Goals
          </Link>
          <Link to="/skills" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
            <Code2 className="h-5 w-5" />
            Skills
          </Link>

          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8">Account</p>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
            <Settings className="h-5 w-5" />
            Settings
          </a>

          <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
        
        </nav>

        
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center md:hidden">
             <Terminal className="text-indigo-600 h-6 w-6" />
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <h1 className="text-lg font-semibold text-slate-800">Welcome back, Developer</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <CalendarIcon className="h-4 w-4" />
              Last 7 Days
              <ChevronDown className="h-3 w-3 ml-1" />
            </motion.button>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm" />
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-6"
          >
            
            {/* Daily Tip */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden group cursor-default">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
               <div className="flex items-start sm:items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm">
                    <Lightbulb className="h-6 w-6 text-indigo-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Daily Tip</h3>
                    <p className="text-indigo-100 text-sm sm:text-base">"The best time to plant a tree was 20 years ago. The second best time is when your code finally compiles."</p>
                  </div>
               </div>
            </motion.div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Streak Counter", value: "14 Days", sub: "Personal best: 21", icon: <Flame className="h-6 w-6 text-orange-500" />, color: "bg-orange-50 border-orange-100" },
                { label: "Total Hours Coded", value: "342h", sub: "+12h this week", icon: <Timer className="h-6 w-6 text-indigo-600" />, color: "bg-indigo-50 border-indigo-100" },
                { label: "Sessions (Week)", value: "21", sub: "Goal: 25 sessions", icon: <Activity className="h-6 w-6 text-emerald-600" />, color: "bg-emerald-50 border-emerald-100" },
                { label: "Goals Completed", value: "8", sub: "3 remaining", icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />, color: "bg-blue-50 border-blue-100" },
              ].map((stat, i) => (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  key={i} 
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                    <span className="text-slate-400 text-xs">{stat.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sessions per week bar chart */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-semibold text-slate-800">Sessions per week</h3>
                   <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View Report</button>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="sessions" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32}>
                         {sessionsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 || index === 3 ? '#4f46e5' : '#818cf8'} />
                          ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Goal status donut chart */}
              <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                 <h3 className="font-semibold text-slate-800 mb-2">Goal Status</h3>
                 <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={goalStatusData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {goalStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-3xl font-bold text-slate-800">19</span>
                       <span className="text-xs text-slate-500 font-medium uppercase">Total Goals</span>
                    </div>
                 </div>
                 <div className="flex justify-center gap-4 mt-2">
                    {goalStatusData.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        {item.name}
                      </div>
                    ))}
                 </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Activity heatmap */}
               <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-semibold text-slate-800">Activity Heatmap</h3>
                     <span className="text-xs text-slate-500 font-medium">Last 3 Months</span>
                  </div>
                  <div className="overflow-x-auto pb-2">
                    <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
                      {heatmapData.map((val, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(val)} cursor-pointer border border-black/5`}
                          title={`${val} sessions`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500">
                     <span>Less</span>
                     <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-200"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-300"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
                     </div>
                     <span>More</span>
                  </div>
               </motion.div>

               {/* Skill tier distribution */}
               <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-6">Skill Tier Distribution</h3>
                  <div className="space-y-5">
                     {skillTiers.map((skill, i) => (
                        <div key={i} className="group">
                           <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{skill.name}</span>
                              <span className="text-slate-500 text-xs">{skill.tier}</span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="bg-indigo-500 h-2 rounded-full"
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent sessions list */}
                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-semibold text-slate-800">Recent Sessions</h3>
                     <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                  </div>
                  <div className="space-y-3">
                     {[
                        { title: "Refactoring Auth Module", time: "2h 15m", date: "Today, 10:30 AM", tag: "Backend" },
                        { title: "Landing Page Redesign", time: "1h 45m", date: "Yesterday, 2:00 PM", tag: "Frontend" },
                        { title: "API Documentation", time: "45m", date: "Oct 12, 4:15 PM", tag: "Docs" },
                     ].map((session, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 4, backgroundColor: "rgb(248 250 252)" }}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 transition-colors cursor-pointer"
                        >
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                 <Terminal className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="font-medium text-slate-800 text-sm">{session.title}</p>
                                 <p className="text-xs text-slate-500">{session.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-semibold text-slate-700 text-sm">{session.time}</p>
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{session.tag}</span>
                           </div>
                        </motion.div>
                     ))}
                  </div>
                </motion.div>

                {/* Pinned goals widget */}
                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="font-semibold text-slate-800">Pinned Goals</h3>
                     <button className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                        <Plus className="h-5 w-5" />
                     </button>
                  </div>
                  <div className="space-y-4">
                     {[
                        { title: "Master React Native", progress: 65, daysLeft: 12, color: "bg-blue-500" },
                        { title: "Complete System Design Course", progress: 30, daysLeft: 24, color: "bg-emerald-500" },
                        { title: "Launch Side Project", progress: 85, daysLeft: 5, color: "bg-purple-500" },
                     ].map((goal, i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer group">
                           <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{goal.title}</h4>
                              <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                                {goal.daysLeft}d left
                              </span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${goal.progress}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-full rounded-full ${goal.color}`} 
                                 />
                              </div>
                              <span className="text-xs font-bold text-slate-700">{goal.progress}%</span>
                           </div>
                        </div>
                     ))}
                  </div>
                </motion.div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};