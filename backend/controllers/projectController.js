import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  const project = new Project({
    name,
    description,
    admin: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ admin: req.user._id }, { members: req.user._id }],
  })
    .populate('admin', 'name email')
    .populate('members', 'name email');

  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('admin', 'name email')
    .populate('members', 'name email');

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.admin.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this project');
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.admin.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this project');
    }

    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Remove a member from project
// @route   PUT /api/projects/:id/members/:userId
// @access  Private/Admin
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.admin.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to manage members');
    }

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeMember,
};
