export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  isVerified: boolean;
  provider: "local" | "google";
  bio: string | null;
  currentRole: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  githubUsername: string | null;
  timezone: string;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  notificationPrefs: {
    skill_levelup: boolean;
    goal_deadline: boolean;
    streak_broken: boolean;
  };
  privacySettings: {
    profileVisibility: "public" | "private";
    hideStats: boolean;
  };
  createdAt: string;
  updatedAt: string;
}