export type Skill = {
  _id: string;
  userId: string;
  name: string;
  category: string;
  level: number;
  tier: string;
  xp: number;
  xpToNextLevel: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SkillCounts = {
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
};

export type SkillPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type LinkedSession = {
  _id: string;
  title: string;
  duration: number;
  date: string;
  tags: string[];
};

export type SkillDetail = {
  skill: Skill;
  linkedSessions: LinkedSession[];
};

export type CreateSkillBody = {
  name: string;
  category: string;
  level: number;
  tier: string;
  notes?: string | null;
};