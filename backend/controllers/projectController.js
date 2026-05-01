const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  members: Joi.array().items(Joi.number()).default([])
});

const createProject = async (req, res) => {
  const { error } = createProjectSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, description, members } = req.body;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id,
        members: {
          create: (members || []).map(userId => ({ userId }))
        }
      },
      include: {
        members: true
      }
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdById: req.user.id },
            { members: { some: { userId: req.user.id } } }
          ]
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
      });
    }
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, members, status } = req.body;

  try {
    // Delete existing members and recreate
    if (members) {
      await prisma.projectMember.deleteMany({ where: { projectId: parseInt(id) } });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    
    if (members) {
      updateData.members = {
        create: members.map(userId => ({ userId }))
      };
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { members: true }
    });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
