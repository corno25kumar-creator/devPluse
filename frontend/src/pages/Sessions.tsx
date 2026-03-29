import { useState, useMemo, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target, Code2, Plus, Search, Filter, Clock, Play, Square,
  Edit2, Trash2, Tag as TagIcon, CheckCircle2, X, AlertCircle,
} from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useSessionStore } from "../store/Sessionstore";
import type { Session } from "../store/Sessionstore";
import { sessionApi } from "../api/sessions.api";

export const Sessions = () => {

  // ── Store ──────────────────────────────────────────────────
  const { sessions, setSessions, addSession, updateSession, removeSession, setLoading } =
    useSessionStore();

  // ── Page State ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagsFilter, setSelectedTagsFilter] = useState<string[]>([]);

  // ── Timer State ────────────────────────────────────────────
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  // useRef so handleStopTimer always reads latest value — no stale closure
  const timerSecondsRef = useRef(0);

  // ── Modal State ────────────────────────────────────────────
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  // ── Form Fields ────────────────────────────────────────────
  const [formData, setFormData] = useState({
    title: "",
    duration: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
    tags: [] as string[],
    goalId: "",
    skillId: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [formError, setFormError] = useState("");

  // ── Timer Effect ───────────────────────────────────────────
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => {
          const next = s + 1;
          timerSecondsRef.current = next; // keep ref in sync
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ── Fetch Sessions on Mount ────────────────────────────────
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await sessionApi.getAll();
        setSessions(data.sessions, data.pagination);
      } catch (err) {
        console.error("Sessions fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // ── Helpers ────────────────────────────────────────────────
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // prefillDuration param — used when called from timer stop
  const openLogModal = (session?: Session, prefillDuration?: number) => {
    setFormError("");
    setTagInput("");
    if (session) {
      setEditingSessionId(session._id);
      setFormData({
        title: session.title,
        duration: session.duration,
        date: session.date.split("T")[0],
        notes: session.notes || "",
        tags: session.tags || [],
        goalId: session.goalId || "",
        skillId: session.skillId || "",
      });
    } else {
      setEditingSessionId(null);
      setFormData({
        title: "",
        duration: prefillDuration ?? 0,
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
        tags: [],
        goalId: "",
        skillId: "",
      });
    }
    setIsLogModalOpen(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    // Read from ref — always latest, no stale closure problem
    const minutes = Math.max(1, Math.floor(timerSecondsRef.current / 60));
    openLogModal(undefined, minutes);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && formData.tags.length < 10 && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // ── Save Session ───────────────────────────────────────────
  const handleSaveSession = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) return setFormError("Title is required.");
    if (formData.title.length > 120) return setFormError("Title must be at most 120 characters.");
    if (formData.duration < 1 || formData.duration > 1440) return setFormError("Duration must be between 1 and 1440 minutes.");
    if (!formData.date) return setFormError("Date is required.");
    if (formData.notes.length > 2000) return setFormError("Notes must be at most 2000 characters.");
    if (formData.tags.length > 10) return setFormError("Maximum 10 tags allowed.");

    const body = {
      title: formData.title.trim(),
      duration: formData.duration,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes.trim(),
      tags: formData.tags,
      goalId: formData.goalId || null,
      skillId: formData.skillId || null,
    };

    try {
      if (editingSessionId) {
        const updated = await sessionApi.update(editingSessionId, body);
        updateSession(updated);
      } else {
        const created = await sessionApi.create(body);
        addSession(created);
        setTimerSeconds(0);
        timerSecondsRef.current = 0;
      }
      setIsLogModalOpen(false);
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  // ── Delete Session ─────────────────────────────────────────
  const deleteSession = async (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      try {
        await sessionApi.delete(id);
        removeSession(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // ── Derived State ──────────────────────────────────────────
  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    sessions.forEach((s) => s.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        const matchesSearch =
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.notes?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags =
          selectedTagsFilter.length === 0 ||
          selectedTagsFilter.every((tag) => s.tags.includes(tag));
        return matchesSearch && matchesTags;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, searchQuery, selectedTagsFilter]);

  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {};
    filteredSessions.forEach((session) => {
      const dateObj = parseISO(session.date);
      let groupKey = format(dateObj, "MMM d, yyyy");
      if (isToday(dateObj)) groupKey = "Today";
      else if (isYesterday(dateObj)) groupKey = "Yesterday";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(session);
    });
    return groups;
  }, [filteredSessions]);

  // ── JSX ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden">

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 h-screen overflow-hidden">

        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Session Timeline</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isTimerRunning) {
                  handleStopTimer();
                } else {
                  setIsTimerRunning(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                isTimerRunning
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isTimerRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isTimerRunning ? "Stop & Log" : "Start Timer"}
            </button>
            {/* <button
              onClick={() => openLogModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Log Session
            </button> */}
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            <div className="sticky top-0 z-10 space-y-4 pb-4 bg-slate-50/90 backdrop-blur-md">

              {/* Live Timer Banner */}
              {isTimerRunning && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 bg-red-400 rounded-full animate-pulse" />
                    <div>
                      <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Active Session</p>
                      <p className="text-2xl font-mono font-bold tracking-tight">{formatTime(timerSeconds)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleStopTimer}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Square className="h-4 w-4" /> Stop & Log
                  </button>
                </motion.div>
              )}

              {/* Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search sessions by title or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {allAvailableTags.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <Filter className="h-3.5 w-3.5" /> Filter by Tags:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {allAvailableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setSelectedTagsFilter((prev) =>
                              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            selectedTagsFilter.includes(tag)
                              ? "bg-indigo-100 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      {selectedTagsFilter.length > 0 && (
                        <button
                          onClick={() => setSelectedTagsFilter([])}
                          className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1.5 transition-colors underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sessions Timeline */}
            <div className="space-y-8">
              {Object.entries(groupedSessions).length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl">
                  <Search className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700 mb-1">No sessions found</p>
                  <p className="text-sm">Try adjusting your search or tag filters.</p>
                </div>
              ) : (
                Object.entries(groupedSessions).map(([dateLabel, dateSessions]) => (
                  <div key={dateLabel} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-bold text-slate-800 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                        {dateLabel}
                      </h3>
                      <div className="h-px bg-slate-200 flex-1" />
                      <p className="text-xs font-medium text-slate-500">
                        {dateSessions.reduce((acc, curr) => acc + curr.duration, 0)} mins total
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {dateSessions.map((session) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                            <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1 sm:w-24 shrink-0 text-center">
                              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className="text-lg font-bold text-slate-800 leading-none">{session.duration}</p>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">mins</p>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-slate-900 mb-1 pr-10">{session.title}</h4>
                              {session.notes && (
                                <p className="text-sm text-slate-600 mb-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                  {session.notes}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-auto">
                                {session.tags.map((tag) => (
                                  <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                                    <TagIcon className="h-3 w-3 opacity-50" /> {tag}
                                  </span>
                                ))}
                                {session.goalId && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                    <Target className="h-3 w-3 opacity-70" /> Goal: {session.goalId}
                                  </span>
                                )}
                                {session.skillId && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <Code2 className="h-3 w-3 opacity-70" /> Skill: {session.skillId}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="absolute top-4 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                              <button onClick={() => openLogModal(session)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit session">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteSession(session._id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete session">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Log / Edit Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {editingSessionId ? <Edit2 className="h-5 w-5 text-[#5e43f3]" /> : <Plus className="h-5 w-5 text-[#5e43f3]" />}
                  {editingSessionId ? "Edit Session" : "Log a Session"}
                </h2>
                <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {formError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" /> {formError}
                  </div>
                )}

                <form id="session-form" onSubmit={handleSaveSession} className="space-y-6">

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block text-[15px] font-semibold text-slate-800">Title <span className="text-red-500">*</span></label>
                      <span className="text-sm text-slate-400">{formData.title.length}/120</span>
                    </div>
                    <input type="text" maxLength={120} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="What did you work on? (e.g. Auth API Refactor)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors placeholder:text-slate-400 text-slate-800" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">Duration (minutes) <span className="text-red-500">*</span></label>
                      <input type="number" min={1} max={1440} value={formData.duration || ""} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} placeholder="60" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800" />
                      <p className="text-[13px] text-slate-500 mt-1.5">Min: 1, Max: 1440 (24h)</p>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">Date <span className="text-red-500">*</span></label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800 [color-scheme:light]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block text-[15px] font-semibold text-slate-800">Notes</label>
                      <span className="text-sm text-slate-400">{formData.notes.length}/2000</span>
                    </div>
                    <textarea rows={4} maxLength={2000} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Add detailed reflections, roadblocks, or implementation details..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors resize-none placeholder:text-slate-400 text-slate-800" />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block text-[15px] font-semibold text-slate-800">Tags</label>
                      <span className="text-sm text-slate-400">{formData.tags.length}/10 tags</span>
                    </div>
                    <div className="w-full bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#5e43f3] focus-within:border-transparent transition-colors p-2 flex flex-wrap gap-2 min-h-[50px]">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-indigo-100">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900 rounded-full p-0.5"><X className="h-3.5 w-3.5" /></button>
                        </span>
                      ))}
                      {formData.tags.length < 10 && (
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder={formData.tags.length === 0 ? "Type and press enter to add tags..." : "Add tag..."} className="flex-1 min-w-[200px] bg-transparent border-none focus:outline-none text-base px-2 py-1 placeholder:text-slate-400 text-slate-800" />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[15px] font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-slate-400" /> Link to Goal
                      </label>
                      <select value={formData.goalId} onChange={(e) => setFormData({ ...formData, goalId: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800">
                        <option value="">None</option>
                        {/* populated from goals store once Goals page is built */}
                      </select>
                    </div>
                    <div>
                      <label className="text-[15px] font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <Code2 className="h-4 w-4 text-slate-400" /> Link to Skill
                      </label>
                      <select value={formData.skillId} onChange={(e) => setFormData({ ...formData, skillId: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e43f3] focus:border-transparent transition-colors text-slate-800">
                        <option value="">None</option>
                        {/* populated from skills store once Skills page is built */}
                      </select>
                    </div>
                  </div>

                </form>
              </div>

              <div className="px-6 py-4 flex items-center justify-end gap-4 shrink-0 bg-white border-t border-slate-100">
                <button onClick={() => setIsLogModalOpen(false)} className="px-5 py-2.5 font-semibold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                <button type="submit" form="session-form" className="px-6 py-2.5 font-semibold text-white bg-[#5e43f3] hover:bg-[#4a35c4] rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Save Session
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
