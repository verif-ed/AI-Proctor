// backend/src/analysis.ts
import type { UserSession } from "./types";

export interface TestAnalysis {
  totalDuration: number;
  facePresentPercentage: number;
  suspiciousActivityCount: number;
  lookingAwayCount: number;
  possiblePhotoDetections: number;
  overallRisk: "Low" | "Medium" | "High";
}

export function analyzeSession(session: UserSession): TestAnalysis {
  const totalDuration = session.endTime - session.startTime;
  const lookingAwayCount = session.alerts.filter(
    (a) => a.type === "looking_away"
  ).length;
  const possiblePhotoDetections = session.alerts.filter(
    (a) => a.type === "possible_photo"
  ).length;

  let overallRisk: "Low" | "Medium" | "High" = "Low";
  if (
    session.suspiciousActivityCount > 10 ||
    session.facePresentPercentage < 80
  ) {
    overallRisk = "High";
  } else if (
    session.suspiciousActivityCount > 5 ||
    session.facePresentPercentage < 90
  ) {
    overallRisk = "Medium";
  }

  return {
    totalDuration,
    facePresentPercentage: session.facePresentPercentage,
    suspiciousActivityCount: session.suspiciousActivityCount,
    lookingAwayCount,
    possiblePhotoDetections,
    overallRisk,
  };
}
