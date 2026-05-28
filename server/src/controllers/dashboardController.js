const prisma = require('../config/db');

const getDashboard = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const userId = req.user.id;
    const now = new Date();

    // Base where clause: Admin sees all, Member sees own tasks
    const taskWhere = isAdmin ? {} : { assigneeId: userId };

    // Aggregate task counts
    const [totalTasks, todoTasks, inProgressTasks, completedTasks, overdueTasks] = await Promise.all([
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: 'TODO' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'DONE' } }),
      prisma.task.count({
        where: {
          ...taskWhere,
          status: { not: 'DONE' },
          dueDate: { lt: now },
        },
      }),
    ]);

    // Upcoming deadlines (next 5 non-done tasks with due dates, sorted by date)
    const upcomingDeadlines = await prisma.task.findMany({
      where: {
        ...taskWhere,
        status: { not: 'DONE' },
        dueDate: { not: null },
      },
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    // Recent tasks (last 5 updated)
    const recentTasks = await prisma.task.findMany({
      where: taskWhere,
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    // Project overview (for admin)
    let projectOverview = [];
    if (isAdmin) {
      const projects = await prisma.project.findMany({
        include: {
          _count: { select: { tasks: true } },
          tasks: { select: { status: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      projectOverview = projects.map((p) => ({
        id: p.id,
        name: p.name,
        totalTasks: p.tasks.length,
        completedTasks: p.tasks.filter((t) => t.status === 'DONE').length,
        progress: p.tasks.length > 0
          ? Math.round((p.tasks.filter((t) => t.status === 'DONE').length / p.tasks.length) * 100)
          : 0,
      }));
    }

    res.json({
      success: true,
      data: {
        metrics: {
          totalTasks,
          todoTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
        },
        upcomingDeadlines,
        recentTasks,
        projectOverview,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
