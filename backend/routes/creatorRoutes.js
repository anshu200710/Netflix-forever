// backend/routes/creatorRoutes.js
import express from "express";
import {
  createCreator,
  getCreatorById,
} from "../controllers/creatorController.js";

const router = express.Router();

// POST /api/creator/create
router.post("/create", createCreator);

// GET /api/creator/:id
router.get("/:id", getCreatorById);

export default router;
