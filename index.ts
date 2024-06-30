import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import type { ProctoringAlert, UserSession } from "./src/types";
import { analyzeSession } from "./src/analysis";
import cors from "cors";
const userSessions = new Map<string, UserSession>();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // replace with your frontend URL
    credentials: true,
  },
});
app.use(
  cors({
    origin: "*",
  })
);
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("A user connected");

  const userId = socket.id; // In a real app, you'd use a more persistent user ID
  userSessions.set(userId, {
    userId,
    startTime: Date.now(),
    endTime: 0,
    alerts: [],
    facePresentPercentage: 100,
    suspiciousActivityCount: 0,
  });

  socket.on("proctoring_alert", (alert: ProctoringAlert) => {
    const session = userSessions.get(userId);
    if (session) {
      session.alerts.push(alert);
      if (alert.type === "no_face") {
        session.facePresentPercentage -= 1; // Decrease by 1% each time no face is detected
        session.facePresentPercentage = Math.max(
          session.facePresentPercentage,
          0
        );
      }
      if (alert.type === "looking_away" || alert.type === "possible_photo") {
        session.suspiciousActivityCount++;
      }
    }
  });

  socket.on("test_completed", () => {
    const session = userSessions.get(userId);
    if (session) {
      session.endTime = Date.now();
      const analysis = analyzeSession(session);
      socket.emit("test_analysis", analysis);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// backend/src/server.ts
