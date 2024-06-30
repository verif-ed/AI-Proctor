// backend/src/types.ts
export interface ProctoringAlert {
  type: "looking_away" | "no_face" | "possible_photo" | "suspicious_movement";
  timestamp: number;
}

export interface UserSession {
  userId: string;
  startTime: number;
  endTime: number;
  alerts: ProctoringAlert[];
  facePresentPercentage: number;
  suspiciousActivityCount: number;
}
