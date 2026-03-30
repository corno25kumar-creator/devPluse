import { create } from "zustand";
import type { Skill, SkillCounts, SkillPagination, LinkedSession } from "../types/skills.types";

type SkillStore = {
  skills: Skill[];
  counts: SkillCounts | null;
  pagination: SkillPagination | null;
  isLoading: boolean;

  // Selected skill ke linked sessions
  selectedSkill: Skill | null;
  linkedSessions: LinkedSession[];

  // Actions
  setSkills: (skills: Skill[], counts: SkillCounts, pagination: SkillPagination) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  setSelectedSkill: (skill: Skill | null) => void;
  setLinkedSessions: (sessions: LinkedSession[]) => void;
  setLoading: (val: boolean) => void;
};

export const useSkillStore = create<SkillStore>((set) => ({
  skills: [],
  counts: null,
  pagination: null,
  isLoading: false,
  selectedSkill: null,
  linkedSessions: [],

  setSkills: (skills, counts, pagination) =>
    set({ skills, counts, pagination }),

  addSkill: (skill) =>
    set((state) => ({ skills: [skill, ...state.skills] })),

  updateSkill: (updated) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s._id === updated._id ? updated : s
      ),
      // agar detail panel open hai aur same skill update hui toh woh bhi update ho
      selectedSkill:
        state.selectedSkill?._id === updated._id
          ? updated
          : state.selectedSkill,
    })),

  removeSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((s) => s._id !== id),
      selectedSkill:
        state.selectedSkill?._id === id ? null : state.selectedSkill,
    })),

  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  setLinkedSessions: (sessions) => set({ linkedSessions: sessions }),
  setLoading: (val) => set({ isLoading: val }),
}));