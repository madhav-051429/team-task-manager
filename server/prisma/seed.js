const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@team.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Created admin: ${admin.email}`);

  // Create Member users
  const memberPassword = await bcrypt.hash('member123', 12);
  const member1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@team.com',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@team.com',
      password: memberPassword,
      role: 'MEMBER',
    },
  });
  console.log(`✅ Created members: ${member1.email}, ${member2.email}`);

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'Build the minimum viable product for our mobile application.',
      ownerId: admin.id,
    },
  });
  console.log(`✅ Created projects: ${project1.name}, ${project2.name}`);

  // Create Tasks for Project 1
  const now = new Date();
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design homepage mockup',
        description: 'Create a modern homepage design with hero section, features grid, and testimonials.',
        status: 'DONE',
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        projectId: project1.id,
        assigneeId: member1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement responsive navigation',
        description: 'Build a responsive navbar with hamburger menu for mobile devices.',
        status: 'IN_PROGRESS',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        projectId: project1.id,
        assigneeId: member1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'TODO',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        projectId: project1.id,
        assigneeId: member2.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write unit tests for auth module',
        description: 'Achieve 80% test coverage for the authentication module.',
        status: 'TODO',
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue!)
        projectId: project1.id,
        assigneeId: member2.id,
      },
    }),
  ]);

  // Create Tasks for Project 2
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Set up React Native project',
        description: 'Initialize the React Native project with TypeScript template.',
        status: 'DONE',
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        projectId: project2.id,
        assigneeId: member1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Build login screen',
        description: 'Create a beautiful login screen with form validation.',
        status: 'IN_PROGRESS',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        projectId: project2.id,
        assigneeId: member2.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'API integration layer',
        description: 'Build the API client with interceptors and error handling.',
        status: 'TODO',
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        projectId: project2.id,
        assigneeId: member1.id,
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length + 3} tasks across 2 projects`);
  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@team.com / admin123');
  console.log('   Member: alice@team.com / member123');
  console.log('   Member: bob@team.com / member123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
