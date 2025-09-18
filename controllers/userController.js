import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";

// @desc Get logged-in user's profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate("skills")
      .populate("bookmarks");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update profile (bio, avatar, skills)
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  const { bio, avatarUrl, skills } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    if (bio) profile.bio = bio;
    if (avatarUrl) profile.avatarUrl = avatarUrl;

    if (skills && Array.isArray(skills)) {
      const skillDocs = await Skill.find({ name: { $in: skills } });
      const existingSkillNames = skillDocs.map((s) => s.name);

      const newSkills = skills.filter((s) => !existingSkillNames.includes(s));
      const newSkillDocs = await Skill.insertMany(
        newSkills.map((name) => ({ name })),
        { ordered: false }
      );

      profile.skills = [...skillDocs, ...newSkillDocs].map((s) => s._id);
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add project to bookmarks
// @route POST /api/users/bookmarks/:projectId
// @access Private
export const addBookmark = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id, bookmarks: [] });
    }

    if (!profile.bookmarks.includes(projectId)) {
      profile.bookmarks.push(projectId);
      await profile.save();
    }

    res.json({ message: "Project bookmarked", bookmarks: profile.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove project from bookmarks
// @route DELETE /api/users/bookmarks/:projectId
// @access Private
export const removeBookmark = async (req, res) => {
  try {
    const { projectId } = req.params;

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.bookmarks = profile.bookmarks.filter(
      (id) => id.toString() !== projectId
    );
    await profile.save();

    res.json({ message: "Project removed from bookmarks", bookmarks: profile.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
