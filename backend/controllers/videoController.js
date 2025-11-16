// backend/controllers/videoController.js
import Video from "../models/Video.js";
import Creator from "../models/Creator.js";

export const uploadVideos = async (req, res, next) => {
  try {
    const { creatorId } = req.params;
    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one video file is required" });
    }

    const existingCount = await Video.countDocuments({ creatorId });
    if (existingCount + req.files.length > 3) {
      return res.status(400).json({
        message: "You can only have 3 videos per creator",
      });
    }

    const createdVideos = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const video = await Video.create({
        creatorId,
        title: file.originalname,
        order: existingCount + i + 1,
        fileUrl: `/uploads/${file.filename}`,
      });
      createdVideos.push(video);
    }

    res.status(201).json({ ok: true, videos: createdVideos });
  } catch (err) {
    next(err);
  }
};

export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    next(err);
  }
};
