// Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    bio: { type: String },
    avatarUrl: { type: String },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

// Ensure proper unique index on `user`
profileSchema.index({ user: 1 }, { unique: true });

export default mongoose.model("Profile", profileSchema);
