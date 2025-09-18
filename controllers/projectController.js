import Project from "../models/Project.js";
import axios from "axios";

// @desc Get all projects (with filters/search)
// @route GET /api/projects
// @access Public
export const getProjects = async (req, res) => {
  try {
    const { keyword, language, difficulty, topic } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = topic;

    const projects = await Project.find(query)
      .populate("topics", "name")
      .sort({ stars: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single project details
// @route GET /api/projects/:id
// @access Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("topics", "name");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new project (Admin only)
// @route POST /api/projects
// @access Private/Admin
export const createProject = async (req, res) => {
  try {
    const { name, description, repoUrl, language, difficulty, topics } = req.body;

    const newProject = new Project({
      name,
      description,
      repoUrl,
      language,
      difficulty,
      topics,
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update project (Admin only)
// @route PUT /api/projects/:id
// @access Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    const updated = await project.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete project (Admin only)
// @route DELETE /api/projects/:id
// @access Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Sync project from GitHub API (cache in DB)
// @route POST /api/projects/sync/:owner/:repo
// @access Private/Admin
export const syncProjectFromGitHub = async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const githubResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    const data = githubResponse.data;

    let project = await Project.findOne({ repoUrl: data.html_url });

    if (!project) {
      project = new Project({
        name: data.name,
        description: data.description,
        repoUrl: data.html_url,
        language: data.language,
        stars: data.stargazers_count,
        forks: data.forks_count,
        activityStatus: data.archived ? "inactive" : "active",
      });
    } else {
      project.stars = data.stargazers_count;
      project.forks = data.forks_count;
      project.activityStatus = data.archived ? "inactive" : "active";
    }

    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
