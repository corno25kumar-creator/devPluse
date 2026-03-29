import { create } from "zustand";

export type Session = {
  _id: string;
  userId: string;
  title: string;
  duration: number;
  date: string;
  notes?: string;
  tags: string[];
  goalId: string | null;
  skillId: string | null;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type SessionStore = {
  sessions: Session[];
  pagination: Pagination | null;
  isLoading: boolean;
  setSessions: (sessions: Session[], pagination: Pagination) => void;
  addSession: (session: Session) => void;
  updateSession: (session: Session) => void;
  removeSession: (id: string) => void;
  setLoading: (val: boolean) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  pagination: null,
  isLoading: false,

  setSessions: (sessions, pagination) => set({ sessions, pagination }),

  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

  updateSession: (updated) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s._id === updated._id ? updated : s
      ),
    })),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s._id !== id),
    })),

  setLoading: (val) => set({ isLoading: val }),
}));