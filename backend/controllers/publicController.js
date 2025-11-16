// backend/controllers/publicController.js
import Creator from "../models/Creator.js";
import Video from "../models/Video.js";

export const getCreatorPublicPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const creator = await Creator.findOne({ slug });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const videos = await Video.find({ creatorId: creator._id }).sort("order");
    res.json({ creator, videos });
  } catch (err) {
    next(err);
  }
};
