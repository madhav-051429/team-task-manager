# 🚀 TaskFlow — Team Task Manager

A full-stack web application for team collaboration with **Role-Based Access Control (RBAC)**, **Kanban boards**, and **real-time project tracking**. Built with Node.js, Express, PostgreSQL, Prisma, and React.

![Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?logo=tailwindcss)

---

## 📋 Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control (ADMIN / MEMBER)
- Protected routes on both frontend and backend

### Admin Capabilities
- Create, edit, and delete **projects**
- Create, assign, edit, and delete **tasks**
- View **all team tasks** and overall progress on dashboard
- Assign tasks to any team member

### Member Capabilities
- View **assigned projects** only
- View **assigned tasks** and update their status (TODO → IN_PROGRESS → DONE)
- Personal dashboard with overdue items

### Dashboard Analytics
- Total, To Do, In Progress, Completed, and Overdue task metrics
- Upcoming deadlines with relative date indicators
- Project overview with progress bars (Admin)

### Project Board
- **Kanban-style** board with 3 columns (To Do, In Progress, Done)
- Visual indicators for **overdue tasks** (red border + badge)
- Task cards with assignee avatars, due dates, and descriptions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js 5 |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Auth** | JWT + bcryptjs |
| **Frontend** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Deployment** | Railway |

---

## 📊 Database Schema

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│    User      │      │   Project    │      │    Task      │
├─────────────┤      ├──────────────┤      ├──────────────┤
│ id (UUID)   │──┐   │ id (UUID)    │──┐   │ id (UUID)    │
│ name        │  │   │ name         │  │   │ title        │
│ email (UQ)  │  ├──▶│ description  │  ├──▶│ description  │
│ password    │  │   │ ownerId (FK) │  │   │ status (Enum)│
│ role (Enum) │  │   │ createdAt    │  │   │ dueDate      │
│ createdAt   │  │   │ updatedAt    │  │   │ projectId(FK)│
│ updatedAt   │  │   └──────────────┘  │   │ assigneeId(FK│
└─────────────┘  │                     │   │ createdAt    │
                 └─────────────────────┘   │ updatedAt    │
                                           └──────────────┘

Cascading Deletes:
  - Delete User  → Deletes all owned Projects → Deletes all Tasks
  - Delete Project → Deletes all Tasks
  - Delete User (assignee) → Sets assigneeId to NULL
```

---

## 🔌 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (name, email, password, role) → JWT |
| POST | `/api/auth/login` | Login (email, password) → JWT |
| GET | `/api/auth/me` | Get current user (Protected) |
| GET | `/api/auth/users` | List all users (Protected) |

### Projects (Protected)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | All | Admin: all projects. Member: assigned projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | All | Project details with tasks |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project (cascades) |

### Tasks (Protected)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Admin | Create task with assignee |
| PUT | `/api/tasks/:id/status` | All | Update task status only |
| PUT | `/api/tasks/:id` | Admin | Full task update |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Aggregated metrics (filtered by role) |

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` / `development` |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- Docker & Docker Compose (for PostgreSQL)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your database credentials
```

### 4. Install Dependencies & Migrate

```bash
cd server && npm install
npx prisma migrate dev --name init
npx prisma db seed
cd ..
cd client && npm install
cd ..
```

### 5. Run Development Servers

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

Or with concurrently (install root deps first):
```bash
npm install
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@team.com | admin123 |
| Member | alice@team.com | member123 |
| Member | bob@team.com | member123 |



---

## 📁 Project Structure

```
team-task-manager/
├── server/                    # Express.js Backend
│   ├── prisma/                # Database schema & migrations
│   ├── src/
│   │   ├── config/            # DB client singleton
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & RBAC
│   │   ├── routes/            # Express routes
│   │   ├── utils/             # Error classes
│   │   └── index.js           # Server entry
│   └── package.json
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── api/               # Axios client
│   │   ├── components/        # UI components
│   │   ├── context/           # Auth context
│   │   ├── hooks/             # Custom hooks
│   │   └── pages/             # Page views
│   └── package.json
├── docker-compose.yml         # Local PostgreSQL
├── railway.json               # Railway config
├── Procfile                   # Process definition
└── README.md
```



---

## 📄 License

MIT
