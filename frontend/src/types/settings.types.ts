export type PrivacySettings = {
  profileVisibility: "public" | "private";
  hideStats: boolean;
};

export type ExportData = {
  exportedAt: string;
  user: object;
  sessions: object[];
  goals: object[];
  skills: object[];
};