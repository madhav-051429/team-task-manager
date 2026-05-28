import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, projectsAPI as api } from '../api/client';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import TaskModal from '../components/Tasks/TaskModal';
import ProjectForm from '../components/Projects/ProjectForm';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);

  const fetchProject = () => {
    setLoading(true);
    projectsAPI.getById(id)
      .then((res) => setProject(res.data.data.project))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 404 || err.response?.status === 403) {
          navigate('/projects');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(id);
      navigate('/projects');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div className="gradient-text" style={{ fontSize: '1rem', fontWeight: 600 }}>Loading project...</div>
      </div>
    );
  }

  if (!project) return null;

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t) => t.status === 'DONE').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Back to Projects
        </button>

        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                {project.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {completedTasks}/{totalTasks} tasks done
              </span>
              <div style={{ width: '120px' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-violet)' }}>
                {progress}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {isAdmin && (
              <>
                <button className="btn-primary" onClick={handleNewTask}>
                  + New Task
                </button>
                <button className="btn-secondary" onClick={() => setShowEditProject(true)}>
                  Edit
                </button>
                <button className="btn-danger" onClick={handleDeleteProject}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={project.tasks || []}
        onTaskClick={handleTaskClick}
      />

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          projectId={project.id}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSaved={fetchProject}
        />
      )}

      {/* Edit Project Modal */}
      {showEditProject && (
        <ProjectForm
          project={project}
          onClose={() => setShowEditProject(false)}
          onSaved={fetchProject}
        />
      )}
    </div>
  );
}
