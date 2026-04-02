// src/pages/Profile.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal, LayoutDashboard, Target, Code2, Bell,
  Settings as SettingsIcon, LogOut, ChevronDown, User,
  Camera, Globe, Clock, Calendar, Activity, CheckCircle2,
  Trophy, Loader2, AlertCircle, X, Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useProfileStore } from "../store/useProfilestore";
import { useAuthStore } from "../store/useAuthStore";
import type { UpdateProfilePayload } from "../api/profile.api";

// ─── Timezone options ─────────────────────────────────────────────────────────
const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central European Time (CET)", value: "Europe/Paris" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
  { label: "Japan Standard Time (JST)", value: "Asia/Tokyo" },
  { label: "Australia Eastern (AEST)", value: "Australia/Sydney" },
];

// ─── Delete confirmation modal ────────────────────────────────────────────────
// Replace DeleteModal with this version that asks for username
const DeleteModal = ({
  username,
  onConfirm,
  onCancel,
  loading,
}: {
  username: string;
  onConfirm: (typedUsername: string) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const [input, setInput] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-xl">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Delete Account</h3>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          This will permanently delete everything.
          <strong className="text-red-600"> This cannot be undone.</strong>
        </p>
        <p className="text-sm text-slate-600 mb-2">
          Type <strong className="text-slate-800">{username}</strong> to confirm:
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          placeholder={username}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(input)}
            disabled={loading || input !== username}
            className="flex-1 px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Forever
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

export const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    profile, loading, saving, uploadingAvatar, deletingAccount,
    error, successMessage,
    loadProfile, updateProfile, uploadAvatar, deleteAccount, clearMessages,
  } = useProfileStore();

  const { logout } = useAuthStore();

  const [draft, setDraft] = useState<UpdateProfilePayload>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Sync draft when profile loads
  useEffect(() => {
    if (profile) {
      setDraft({
        name:           profile.name,
        bio:            profile.bio ?? "",
        currentRole:    profile.currentRole ?? "",
        githubUsername: profile.githubUsername ?? "",
        timezone:       profile.timezone,
      });
    }
  }, [profile?._id]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(clearMessages, 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(draft);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    await logout();
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden">

     

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 h-screen overflow-hidden">

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Toast Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                  <button onClick={clearMessages}><X className="h-4 w-4 text-red-400" /></button>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 flex-1">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Banner & Avatar */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
              <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12">
                {/* Avatar */}
                <div
                  className="relative group cursor-pointer flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingAvatar
                      ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                      : <Camera className="h-6 w-6 text-white" />}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="text-center sm:text-left flex-1 mb-2">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-7 bg-slate-100 rounded w-40 animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded w-28 animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-slate-800">{profile?.name ?? "—"}</h2>
                      <p className="text-slate-500">{profile?.currentRole ?? "No role set"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">@{profile?.username}</p>
                    </>
                  )}
                </div>

                {profile?.username && (
                  <Link
                    to={`/u/${profile.username}`}
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-indigo-100"
                  >
                    View Public Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Calendar className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</p>
                  <p className="text-xl font-bold text-slate-800">{joinedDate}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Streak</p>
                  <p className="text-xl font-bold text-slate-800">
                    {loading ? "—" : `${profile?.currentStreak ?? 0} days`}
                  </p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Trophy className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Longest Streak</p>
                  <p className="text-xl font-bold text-slate-800">
                    {loading ? "—" : `${profile?.longestStreak ?? 0} days`}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSave}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Edit Profile
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={draft.name ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Current Role</label>
                      <input
                        type="text"
                        value={draft.currentRole ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, currentRole: e.target.value }))}
                        placeholder="e.g. Full Stack Engineer"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-slate-400" /> GitHub Username
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
                          github.com/
                        </span>
                        <input
                          type="text"
                          value={draft.githubUsername ?? ""}
                          onChange={(e) => setDraft((d) => ({ ...d, githubUsername: e.target.value }))}
                          className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                      <textarea
                        rows={4}
                        value={draft.bio ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                        placeholder="Tell the world what you're building..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" /> Timezone
                      </label>
                      <select
                        value={draft.timezone ?? "UTC"}
                        onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 appearance-none cursor-pointer"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm border border-red-100"
                >
                  <Trash2 className="h-4 w-4" /> Delete Account
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => profile && setDraft({
                      name: profile.name,
                      bio: profile.bio ?? "",
                      currentRole: profile.currentRole ?? "",
                      githubUsername: profile.githubUsername ?? "",
                      timezone: profile.timezone,
                    })}
                    className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="px-6 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.form>

          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
            loading={deletingAccount}
          />
        )}
      </AnimatePresence>
    </div>
  );
};