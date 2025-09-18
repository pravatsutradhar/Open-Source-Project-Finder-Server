// Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    repoId: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    language: { type: String },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    lastCommit: { type: Date },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    health: {
      healthScore: { type: Number, min: 0, max: 100 },
      activity: { type: String, enum: ["active", "moderate", "inactive"] },
    },
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
