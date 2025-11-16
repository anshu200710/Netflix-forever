// backend/models/Video.js
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, min: 1, max: 3, required: true }, // 1,2,3
  fileUrl: { type: String, required: true }, // /uploads/filename.mp4 (or S3 URL later)
  thumbnailUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;
