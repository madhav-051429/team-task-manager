const prisma = require('../config/db');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

const getAll = async (req, res, next) => {
  try {
    let projects;

    if (req.user.role === 'ADMIN') {
      // Admin sees all projects
      projects = await prisma.project.findMany({
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
          tasks: {
            select: { status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Member sees only projects they have tasks in
      projects = await prisma.project.findMany({
        where: {
          tasks: {
            some: { assigneeId: req.user.id },
          },
        },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
          tasks: {
            select: { status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Add computed fields
    const enriched = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'DONE').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const { tasks, _count, ...rest } = p;
      return { ...rest, totalTasks, completedTasks, progress };
    });

    res.json({ success: true, data: { projects: enriched } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Members can only view projects they have tasks in
    if (req.user.role === 'MEMBER') {
      const hasTasks = project.tasks.some((t) => t.assigneeId === req.user.id);
      if (!hasTasks) {
        throw new ForbiddenError('You do not have access to this project');
      }
    }

    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      throw new BadRequestError('Project name is required');
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: req.user.id,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    await prisma.project.delete({ where: { id } });

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
