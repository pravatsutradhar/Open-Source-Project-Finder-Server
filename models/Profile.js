// Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    bio: { type: String },
    photoUrl: { type: String },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
