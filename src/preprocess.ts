import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const extractFrames = (videoPath: string, outputDir: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", () => {
        console.log("Frames extracted");
        resolve(true);
      })
      .on("error", (err) => {
        console.error("Error extracting frames", err);
        reject(err);
      })
      .saveToFile(path.join(outputDir, "frame-%03d.jpg"));
  });
};

const processVideos = async () => {
  const videoDir = path.join(__dirname, "../videos");
  const outputDir = path.join(__dirname, "../frames");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = fs.readdirSync(videoDir);
  for (const file of files) {
    const videoPath = path.join(videoDir, file);
    await extractFrames(videoPath, outputDir);
  }
};

processVideos();
