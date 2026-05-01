import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, assignedTo, project } = req.body;

  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    project,
    status: 'To Do',
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const query = { project: req.params.projectId };
  // If not admin, only show tasks assigned to the user
  if (project.admin.toString() !== req.user._id.toString()) {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query).populate('assignedTo', 'name email');
  res.json(tasks);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo, contribution } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if user is admin of the project or the assigned member
    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isAssigned = task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssigned) {
      res.status(401);
      throw new Error('Not authorized to update this task');
    }

    // Members can only update status and contribution
    if (!isAdmin && isAssigned) {
      task.status = status || task.status;
      task.contribution = contribution || task.contribution;
    } else {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.assignedTo = assignedTo || task.assignedTo;
      task.contribution = contribution || task.contribution;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this task');
    }

    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'Admin';

  // Find projects where user is admin or member
  const projects = await Project.find({
    $or: [{ admin: userId }, { members: userId }],
  });

  const projectIds = projects.map(p => p._id);

  // Filter tasks: admins see all tasks in their projects, members only see their assigned tasks
  const taskQuery = { project: { $in: projectIds } };
  if (!isAdmin) {
    taskQuery.assignedTo = userId;
  }

  const totalTasks = await Task.countDocuments(taskQuery);

  const tasksByStatus = await Task.aggregate([
    { $match: taskQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const overdueTasks = await Task.countDocuments({
    ...taskQuery,
    dueDate: { $lt: new Date() },
    status: { $ne: 'Done' }
  });

  const tasksPerUser = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.name': 1, count: 1 } }
  ]);

  res.json({
    totalTasks,
    tasksByStatus,
    overdueTasks,
    tasksPerUser
  });
});

export {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getDashboardStats,
};
