import { api } from "./axios";
import type { 
  ProfileResponse, 
  UpdateProfilePayload, 
  AvatarResponse 
} from "../types/api.types"; // Adjust path based on your folder structure

// ─── API ──────────────────────────────────────────────────────────────────────

export const profileAPI = {
  /** GET /profile/me - Fetch current user's full profile */
  getMe: () => 
    api.get<ProfileResponse>("/profile/me"),

  /** PATCH /profile/me - Update specific profile fields */
  updateMe: (data: UpdateProfilePayload) =>
    api.patch<ProfileResponse>("/profile/me", data),

  /** POST /profile/avatar — multipart/form-data upload */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    
    return api.post<AvatarResponse>("/profile/avatar", formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
    });
  },

  /** GET /profile/:username — Fetch a public profile by username */
  getPublicProfile: (username: string) =>
    api.get<ProfileResponse>(`/profile/${username}`),

  /** DELETE /profile/me - Permanent account deletion */
  deleteAccount: () => 
    api.delete("/profile/me"),
};