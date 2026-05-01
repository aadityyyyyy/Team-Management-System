const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  projectId: Joi.number().required(),
  assignees: Joi.array().items(Joi.number()).max(2).default([]),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  dueDate: Joi.date().allow(null)
});

const createTask = async (req, res) => {
  const { error } = createTaskSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, description, projectId, assignees, status, dueDate } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignees: {
          connect: assignees.map(id => ({ id }))
        }
      },
      include: {
        assignees: { select: { id: true, name: true, department: true } }
      }
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await prisma.task.findMany({
        include: { project: true, assignees: { select: { id: true, name: true, department: true } } }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assignees: { some: { id: req.user.id } } },
            { project: { members: { some: { userId: req.user.id } } } }
          ]
        },
        include: { project: true, assignees: { select: { id: true, name: true, department: true } } }
      });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignees, status, dueDate } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Members can only update status
    if (req.user.role !== 'admin') {
      if (title || description || assignees || dueDate) {
        return res.status(403).json({ error: 'Members can only update task status' });
      }
      
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { status },
        include: { assignees: { select: { id: true, name: true, department: true } } }
      });
      return res.json(updatedTask);
    }

    // Admins can update anything
    const updateData = {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined
    };

    if (assignees) {
      updateData.assignees = {
        set: assignees.map(id => ({ id }))
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { assignees: { select: { id: true, name: true, department: true } } }
    });

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
