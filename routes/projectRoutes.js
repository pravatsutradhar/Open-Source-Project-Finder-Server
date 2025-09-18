import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  syncProjectFromGitHub,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin-only routes
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/sync/:owner/:repo", protect, syncProjectFromGitHub);

export default router;
