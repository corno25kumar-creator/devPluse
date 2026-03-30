import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
   Code2, Plus, Search, Filter,  Clock,
  Trophy, X, Edit2, Trash2, TrendingUp,  ChevronDown, AlertCircle, CheckCircle2
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as RechartsTooltip,
} from "recharts";
import { useSkillStore } from "../store/skillsStore";
import type { Skill } from "../types/skills.types";
import { skillApi } from "../api/skills.api";

// ── Constants ──────────────────────────────────────────────────
const SKILL_CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "Database", "Design", "Architecture"];
const SKILL_TIERS = ["All", "beginner", "intermediate", "advanced", "expert"];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "beginner": return "bg-slate-100 text-slate-600 border-slate-200";
    case "intermediate": return "bg-blue-50 text-blue-700 border-blue-200";
    case "advanced": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "expert": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Frontend": return "bg-pink-500";
    case "Backend": return "bg-emerald-500";
    case "DevOps": return "bg-orange-500";
    case "Database": return "bg-blue-500";
    case "Design": return "bg-purple-500";
    case "Architecture": return "bg-indigo-500";
    default: return "bg-slate-500";
  }
};

// ── Component ──────────────────────────────────────────────────
export const Skills = () => {

  // ── Store ──────────────────────────────────────────────────
  const {
    skills, counts, setSkills, addSkill, updateSkill, removeSkill,
    selectedSkill, linkedSessions, setSelectedSkill, setLinkedSessions,
    isLoading, setLoading,
  } = useSkillStore();

  // ── Filter State ───────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");

  // ── Modal State ────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 1,
    tier: "beginner",
    notes: "",
  });
  const [formError, setFormError] = useState("");

  // ── Fetch Skills on Mount ──────────────────────────────────
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await skillApi.getAll();
      setSkills(data.skills, data.counts, data.pagination);
    } catch (err) {
      console.error("Skills fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Open skill detail panel ────────────────────────────────
  const handleSelectSkill = async (skill: Skill) => {
    setSelectedSkill(skill);
    setLinkedSessions([]);
    try {
      const detail = await skillApi.getById(skill._id);
      setSelectedSkill(detail.skill);
      setLinkedSessions(detail.linkedSessions);
    } catch (err) {
      console.error("Skill detail fetch failed:", err);
    }
  };

  // ── Modal helpers ──────────────────────────────────────────
  const openCreateModal = () => {
    setEditingSkillId(null);
    setFormError("");
    setFormData({ name: "", category: "Frontend", level: 1, tier: "beginner", notes: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkillId(skill._id);
    setFormError("");
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      tier: skill.tier,
      notes: skill.notes || "",
    });
    setIsModalOpen(true);
  };

  // ── Save skill (create or update) ─────────────────────────
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) return setFormError("Name is required.");
    if (formData.level < 1 || formData.level > 100) return setFormError("Level must be between 1 and 100.");

    const body = {
      name: formData.name.trim(),
      category: formData.category,
      level: formData.level,
      tier: formData.tier,
      notes: formData.notes.trim() || null,
    };

    try {
      if (editingSkillId) {
        const updated = await skillApi.update(editingSkillId, body);
        updateSkill(updated);
      } else {
        const created = await skillApi.create(body);
        addSkill(created);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  // ── Delete skill ───────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (confirm("Delete this skill?")) {
      try {
        await skillApi.delete(id);
        removeSkill(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // ── Client-side filter (search + category + tier) ─────────
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    const matchesTier = selectedTier === "All" || skill.tier === selectedTier;
    return matchesSearch && matchesCategory && matchesTier;
  });

  // ── Radar chart data from real skills ─────────────────────
  // Group by category, average level per category
  const radarData = SKILL_CATEGORIES.filter((c) => c !== "All").map((cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    const avg = catSkills.length
      ? Math.round(catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length)
      : 0;
    return { subject: cat, A: avg, fullMark: 20 };
  });

  // ── Total XP ───────────────────────────────────────────────
  const totalXp = skills.reduce((sum, s) => sum + s.xp, 0);
  const totalLevel = skills.reduce((sum, s) => sum + s.level, 0);

  // ── Animation variants ─────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden">

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative h-screen">

        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Skill Tree</h1>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-1 flex flex-col items-center justify-center min-h-[300px]"
              >
                <h3 className="font-semibold text-slate-800 self-start w-full mb-2">Skill Radar</h3>
                <div className="w-full flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                      <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.5} />
                      <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* XP Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 border border-indigo-400 rounded-xl p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="h-8 w-8 text-indigo-200" />
                      <span className="bg-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-indigo-400/50">
                        {skills.length} Skills Tracked
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">{totalXp} XP</h2>
                    <p className="text-indigo-100 text-sm">Total Experience Earned</p>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-xs mb-1.5 font-medium text-indigo-100">
                      <span>Combined Level</span>
                      <span>Lvl {totalLevel}</span>
                    </div>
                    <div className="w-full bg-indigo-900/30 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>

                {/* Tier Counts + Top Skills */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Tier Breakdown</h3>
                    {counts ? (
                      <div className="space-y-2">
                        {Object.entries(counts).map(([tier, count]) => (
                          <div key={tier} className="flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border capitalize ${getTierColor(tier)}`}>{tier}</span>
                            <span className="text-sm font-bold text-slate-700">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">Loading...</p>
                    )}
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add New Skill
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-slate-600"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-slate-600"
                  >
                    {SKILL_TIERS.map((tier) => (
                      <option key={tier} value={tier}>{tier === "All" ? "All Tiers" : tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-12 text-slate-400 font-medium">Loading skills...</div>
            )}

            {/* Skill Grid */}
            {!isLoading && (
              <motion.div
                variants={containerVariants} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              >
                {filteredSkills.map((skill) => {
                  const progress = skill.xpToNextLevel > 0
                    ? Math.min((skill.xp / skill.xpToNextLevel) * 100, 100)
                    : 0;
                  return (
                    <motion.div
                      key={skill._id}
                      variants={itemVariants}
                      onClick={() => handleSelectSkill(skill)}
                      whileHover={{ y: -4 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${getCategoryColor(skill.category)}`} />

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{skill.name}</h4>
                          <span className="text-xs text-slate-500 font-medium">{skill.category}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getTierColor(skill.tier)}`}>
                          {skill.tier}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">Level</span>
                            <span className="text-2xl font-bold text-slate-700">{skill.level}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-medium block">XP</span>
                            <span className="text-sm font-bold text-indigo-600">{skill.xp}</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                            <span>{skill.xp} XP</span>
                            <span>{skill.xpToNextLevel} XP</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              viewport={{ once: true }}
                              className={`h-full rounded-full ${getCategoryColor(skill.category)}`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredSkills.length === 0 && !isLoading && (
                  <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
                    <Code2 className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-600">No skills found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </main>

      {/* ── Skill Detail Panel ─────────────────────────────── */}
      <AnimatePresence>
        {selectedSkill && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 w-max px-2 py-0.5 rounded-md border ${getTierColor(selectedSkill.tier)}`}>
                    {selectedSkill.tier}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedSkill.name}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedSkill.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedSkill(null); openEditModal(selectedSkill); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSkill._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Stats Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${getCategoryColor(selectedSkill.category)}`}>
                        <Code2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">{selectedSkill.category}</p>
                        <p className="text-lg font-bold text-slate-800">Level {selectedSkill.level}</p>
                      </div>
                    </div>
                    <div className="text-center bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                      <p className="text-lg font-bold text-indigo-600">{selectedSkill.xp}</p>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">XP Earned</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-slate-600">Progress to Level {selectedSkill.level + 1}</span>
                      <span className="text-indigo-600">
                        {selectedSkill.xpToNextLevel > 0
                          ? `${Math.round((selectedSkill.xp / selectedSkill.xpToNextLevel) * 100)}%`
                          : "Max"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((selectedSkill.xp / selectedSkill.xpToNextLevel) * 100, 100)}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${getCategoryColor(selectedSkill.category)}`}
                      />
                    </div>
                    <p className="text-right text-xs text-slate-500 mt-2 font-medium">
                      {selectedSkill.xp} / {selectedSkill.xpToNextLevel} XP
                    </p>
                  </div>

                  {selectedSkill.notes && (
                    <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-sm text-slate-700">{selectedSkill.notes}</p>
                    </div>
                  )}
                </div>

                {/* Linked Sessions */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Linked Sessions ({linkedSessions.length})
                  </h3>

                  {linkedSessions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No sessions linked yet</p>
                      <p className="text-xs mt-1">Log a session and link it to this skill to earn XP</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {linkedSessions.map((session) => (
                        <div key={session._id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-slate-800">{session.title}</span>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                              +{session.duration} XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{session.duration} mins</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {session.tags.map((tag) => (
                              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add / Edit Modal ───────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {editingSkillId ? <Edit2 className="h-5 w-5 text-[#5e43f3]" /> : <Plus className="h-5 w-5 text-[#5e43f3]" />}
                  {editingSkillId ? "Edit Skill" : "Add New Skill"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {formError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" /> {formError}
                  </div>
                )}

                <form id="skill-form" onSubmit={handleSave} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">
                      Skill Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. React, Node.js, Docker"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors placeholder:text-slate-400 text-slate-800"
                    />
                  </div>

                  {/* Category + Tier */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800"
                      >
                        {SKILL_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">Tier</label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800"
                      >
                        {SKILL_TIERS.filter((t) => t !== "All").map((tier) => (
                          <option key={tier} value={tier}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">
                      Starting Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800"
                    />
                    <p className="text-[13px] text-slate-500 mt-1.5">Min: 1, Max: 100</p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">Notes</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Optional notes about this skill..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors resize-none placeholder:text-slate-400 text-slate-800"
                    />
                  </div>

                </form>
              </div>

              <div className="px-6 py-4 flex items-center justify-end gap-4 shrink-0 bg-white border-t border-slate-100">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-semibold text-slate-600 hover:text-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" form="skill-form" className="px-6 py-2.5 font-semibold text-white bg-[#5e43f3] hover:bg-[#4a35c4] rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> {editingSkillId ? "Save Changes" : "Add Skill"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};