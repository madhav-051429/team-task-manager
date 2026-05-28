const prisma = require('../config/db');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

const create = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, projectId, assigneeId } = req.body;

    if (!title || title.trim().length === 0) {
      throw new BadRequestError('Task title is required');
    }

    if (!projectId) {
      throw new BadRequestError('Project ID is required');
    }

    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Verify assignee exists if provided
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
      if (!assignee) {
        throw new NotFoundError('Assignee not found');
      }
    }

    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'TODO';

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: taskStatus,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!status || !validStatuses.includes(status)) {
      throw new BadRequestError(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    // Members can only update status of tasks assigned to them
    if (req.user.role === 'MEMBER' && existing.assigneeId !== req.user.id) {
      throw new ForbiddenError('You can only update tasks assigned to you');
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
    });

    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    // Validate status if provided
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (status && !validStatuses.includes(status)) {
      throw new BadRequestError(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    // Verify assignee if provided
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
      if (!assignee) {
        throw new NotFoundError('Assignee not found');
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
    });

    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, updateStatus, update, remove };
