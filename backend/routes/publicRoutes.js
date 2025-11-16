// backend/routes/publicRoutes.js
import express from "express";
import { getCreatorPublicPage } from "../controllers/publicController.js";

const router = express.Router();

// GET /api/public/:slug
router.get("/:slug", getCreatorPublicPage);

export default router;
