// backend/routes/videoRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  uploadVideos,
  getVideoById,
} from "../controllers/videoController.js";

const router = express.Router();

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// disk storage for now (you can switch to S3 later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/video/upload/:creatorId
router.post(
  "/upload/:creatorId",
  upload.array("videos", 3),
  uploadVideos
);

// GET /api/video/:id
router.get("/:id", getVideoById);

export default router;
