import { api } from "./axios";
import type { Skill, SkillDetail, CreateSkillBody } from "../types/skills.types";

export const skillApi = {

  // GET /skills
  getAll: async (params?: { category?: string; tier?: string; search?: string }) => {
    const res = await api.get("/skills", { params });
    // res.data.data = { skills, counts, pagination }
    return res.data.data as {
      skills: Skill[];
      counts: { beginner: number; intermediate: number; advanced: number; expert: number };
      pagination: any;
    };
  },

  // POST /skills
  create: async (body: CreateSkillBody) => {
    const res = await api.post("/skills", body);
    // res.data.data.skill
    return res.data.data.skill as Skill;
  },

  // GET /skills/:id  (returns skill + linkedSessions)
  getById: async (id: string) => {
    const res = await api.get(`/skills/${id}`);
    // res.data.data = { skill, linkedSessions }
    return res.data.data as SkillDetail;
  },

  // PATCH /skills/:id
  update: async (id: string, body: Partial<CreateSkillBody>) => {
    const res = await api.patch(`/skills/${id}`, body);
    return res.data.data.skill as Skill;
  },

  // DELETE /skills/:id
  delete: async (id: string) => {
    await api.delete(`/skills/${id}`);
  },
};