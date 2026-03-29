import { api } from "./axios";
import type { Session } from "../store/Sessionstore";

type CreateSessionBody = {
  title: string;
  duration: number;
  date: string;
  notes?: string;
  tags: string[];
  goalId?: string | null;
  skillId?: string | null;
};

export const sessionApi = {

  // GET /api/sessions
  getAll: async (params?: { search?: string; tags?: string[] }) => {
    const res = await api.get("/sessions", { params });
    // res.data = { success: true, data: { sessions: [], pagination: {} } }
    return res.data.data as { sessions: Session[]; pagination: any };
  },

  // POST /api/sessions
  create: async (body: CreateSessionBody) => {
    const res = await api.post("/sessions", body);
    // res.data = { success: true, data: { session: {...} } }
    return res.data.data.session as Session;
  },

  // PATCH /api/sessions/:id
  update: async (id: string, body: Partial<CreateSessionBody>) => {
    const res = await api.patch(`/sessions/${id}`, body);
    return res.data.data.session as Session;
  },

  // DELETE /api/sessions/:id
  delete: async (id: string) => {
    await api.delete(`/sessions/${id}`);
  },
};