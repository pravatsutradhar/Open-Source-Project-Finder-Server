import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addBookmark,
  removeBookmark,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/bookmarks/:projectId", protect, addBookmark);
router.delete("/bookmarks/:projectId", protect, removeBookmark);

export default router;
