import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  syncProjectFromGitHub,
} from "../controllers/projectController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin-only routes
router.post("/", protect, isAdmin, createProject);
router.put("/:id", protect, isAdmin, updateProject);
router.delete("/:id", protect, isAdmin, deleteProject);
router.post("/sync/:owner/:repo", protect, isAdmin, syncProjectFromGitHub);

export default router;
