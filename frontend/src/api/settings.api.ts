import { api } from "./axios";
import type { PrivacySettings } from "../types/settings.types";

export const settingsApi = {

  // GET /settings/privacy
  getPrivacy: async () => {
    const res = await api.get("/settings/privacy");
    return res.data.data.privacySettings as PrivacySettings;
  },

  // PATCH /settings/privacy
  updatePrivacy: async (body: Partial<PrivacySettings>) => {
    const res = await api.patch("/settings/privacy", body);
    return res.data.data.privacySettings as PrivacySettings;
  },

  // GET /settings/export?format=json
  exportJson: async () => {
    const res = await api.get("/settings/export", {
      params: { format: "json" },
    });
    return res.data as ExportData;
  },

  // GET /settings/export?format=csv
  exportCsv: async () => {
    const res = await api.get("/settings/export", {
      params: { format: "csv" },
      responseType: "text",
    });
    return res.data as string;
  },
};