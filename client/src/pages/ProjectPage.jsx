import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';

const TASK_STATUSES = [
  { name: 'To do', documentId: 'wg7k2psd2k3lierihygxyh5b' },
  { name: 'In progress', documentId: 'q94sdajqam51mzqbj0024r9g' },
  { name: 'Ready for review', documentId: 'w61hc9ws9tzc24a5uxz2q36z' },
  { name: 'Done', documentId: 'yl9dfe6n2icf4mzji7n1xxwg' },
];

const fetchProjectByDocumentId = async (documentId) => {
  const res = await fetch(`${API_URL}/projects?filters[documentId][$eq]=${documentId}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) throw new Error('Failed to fetch project');
  const data = await res.json();
  return data.data[0];
};

const ProjectPage = () => {
  const { documentId: projectDocumentId } = useParams();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: project } = useQuery({
    queryKey: ['project', projectDocumentId],
    queryFn: () => fetchProjectByDocumentId(projectDocumentId),
    enabled: !!projectDocumentId,
  });

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorObj,
  } = useTasks(projectDocumentId);

  const visibleStatuses = filterStatus
    ? TASK_STATUSES.filter((s) => s.name === filterStatus)
    : TASK_STATUSES;

  const groupedTasks = visibleStatuses.reduce((acc, status) => {
    acc[status.name] =
      tasks?.filter((task) => task.status_relation?.name === status.name) || [];
    return acc;
  }, {});

  const openTaskModal = (task) => setSelectedTask(task);
  const closeModal = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  return (
    <div className="project-page">
      <h1 className="project-title">{project?.title || 'Geen titel'}</h1>
      <p className="project-description">Welkom op het taakbord voor project {project?.title}.</p>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <section className="tasks-section">
        <h2 className="tasks-title">Taken</h2>

        <button onClick={() => setShowAddModal(true)} className="add-task-button">
          + Taak toevoegen
        </button>

        <div className="filter-status">
          <label>Filter op status: </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Alle statussen</option>
            {TASK_STATUSES.map((status) => (
              <option key={status.documentId} value={status.name}>{status.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to={`/projects/${projectDocumentId}/backlog`} className="backlog-button">
            Ga naar backlog
          </Link>
        </div>

        {tasksLoading && <p className="tasks-loading">Taken laden...</p>}
        {tasksError && <p className="tasks-error">Fout bij laden taken: {tasksErrorObj.message}</p>}

        {!tasksLoading && !tasksError && (
          <div className="status-columns">
            {visibleStatuses.map((status) => (
              <div key={status.name} className="task-group">
                <h3 className="task-group-title">{status.name}</h3>
                {groupedTasks[status.name].length === 0 ? (
                  <p className="no-tasks">Geen taken in deze status.</p>
                ) : (
                  <ul className="task-list">
                    {groupedTasks[status.name].map((task) => (
                      <li key={task.id} className="task-item">
                        <button className="task-button" onClick={() => openTaskModal(task)}>
                          {task.title || 'Geen titel'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTask && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">{isEditing ? 'Taak bewerken' : selectedTask.title}</h2>

              {isEditing ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const updatedTask = {
                      title: editTitle,
                      description: [
                        {
                          type: 'paragraph',
                          children: [{ type: 'text', text: editDescription }],
                        },
                      ],
                      status_relation: {
                        connect: [{ documentId: editStatus }],
                      },
                    };

                    const res = await fetch(`${API_URL}/tasks/${selectedTask.documentId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`,
                      },
                      body: JSON.stringify({ data: updatedTask }),
                    });

                    if (res.ok) {
                      alert('Taak succesvol bijgewerkt');
                      setIsEditing(false);
                      setSelectedTask(null);
                      queryClient.invalidateQueries(['tasks', projectDocumentId]);
                    } else {
                      const err = await res.text();
                      alert('Fout bij updaten taak: ' + err);
                    }
                  }}
                >
                  <label>
                    Titel:
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                  </label>
                  <label>
                    Beschrijving:
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  </label>
                  <label>
                    Status:
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} required>
                      <option value="">-- Kies een status --</option>
                      {TASK_STATUSES.map((s) => (
                        <option key={s.documentId} value={s.documentId}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit">Opslaan</button>
                  <button type="button" onClick={() => setIsEditing(false)}>Annuleer</button>
                </form>
              ) : (
                <>
                  {Array.isArray(selectedTask.description) && selectedTask.description.length > 0 ? (
                    selectedTask.description.map((block, index) => (
                      <p key={index}>
                        {block.children?.map((child, i) => <span key={i}>{child.text}</span>)}
                      </p>
                    ))
                  ) : (
                    <p className="modal-description">Geen beschrijving</p>
                  )}
                  <p className="modal-status">Status: {selectedTask.status_relation?.name || 'Onbekend'}</p>
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <button
                      className="modal-edit"
                      onClick={() => {
                        setIsEditing(true);
                        setEditTitle(selectedTask.title || '');
                        setEditDescription(
                          selectedTask.description?.[0]?.children?.[0]?.text || ''
                        );
                        setEditStatus(selectedTask.status_relation?.documentId || '');
                      }}
                    >✏️ Bewerken</button>
                    <button
                      className="modal-delete"
                      onClick={async () => {
                        const confirmDelete = confirm('Weet je zeker dat je deze taak wilt verwijderen?');
                        if (!confirmDelete) return;

                        const res = await fetch(`${API_URL}/tasks/${selectedTask.documentId}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${API_TOKEN}` },
                        });

                        if (res.ok) {
                          closeModal();
                          queryClient.invalidateQueries(['tasks', projectDocumentId]);
                        } else {
                          const err = await res.text();
                          alert('Fout bij verwijderen taak: ' + err);
                        }
                      }}
                    >🗑️ Verwijderen</button>
                  </div>
                </>
              )}
              <button className="modal-close" onClick={closeModal}>Sluiten</button>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Nieuwe taak toevoegen</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const newTask = {
                    title: newTitle,
                    description: [
                      {
                        type: 'paragraph',
                        children: [{ type: 'text', text: newDescription }],
                      },
                    ],
                    status_relation: {
                      connect: [{ documentId: newStatus }],
                    },
                    project: {
                      connect: [{ documentId: projectDocumentId }],
                    },
                  };

                  try {
                    const res = await fetch(`${API_URL}/tasks`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`,
                      },
                      body: JSON.stringify({ data: newTask }),
                    });

                    if (res.ok) {
                      setShowAddModal(false);
                      setNewTitle('');
                      setNewDescription('');
                      setNewStatus('');
                      queryClient.invalidateQueries(['tasks', projectDocumentId]);
                      setSuccessMessage('Taak succesvol toegevoegd!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    } else {
                      const err = await res.text();
                      alert('Fout bij aanmaken taak: ' + err);
                    }
                  } catch (err) {
                    alert('Netwerkfout: ' + err.message);
                  }
                }}
              >
                <label>
                  Titel:
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Beschrijving:
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </label>
                <label>
                  Status:
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="">-- Kies een status --</option>
                    {TASK_STATUSES.map((s) => (
                      <option key={s.documentId} value={s.documentId}>{s.name}</option>
                    ))}
                  </select>
                </label>
                <button type="submit">Aanmaken</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Annuleer</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectPage;
