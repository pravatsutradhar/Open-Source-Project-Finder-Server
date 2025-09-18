// Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    repoUrl: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    language: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    lastCommit: { type: Date },
    activityStatus: { type: String, enum: ["active", "inactive"], default: "active" },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
