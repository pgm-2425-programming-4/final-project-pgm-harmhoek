import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const TASK_STATUSES = ['To do', 'In progress', 'Ready for review', 'Done'];

const fetchProjectByDocumentId = async (documentId) => {
  const res = await fetch(`${API_URL}/projects/${documentId}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch project');
  const data = await res.json();
  return data.data;
};

const ProjectPage = () => {
  const { documentId: projectDocumentId } = useParams();

  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErrorObj,
  } = useQuery({
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

  const visibleStatuses = filterStatus ? [filterStatus] : TASK_STATUSES;

  const groupedTasks = visibleStatuses.reduce((acc, status) => {
    acc[status] = tasks?.filter(
      (task) =>
        task.status_relation?.name === status
    ) || [];
    return acc;
  }, {});

  const openTaskModal = (task) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);

  if (projectLoading) return <p>Project laden...</p>;
  if (projectError) return <p>Fout bij laden project: {projectErrorObj.message}</p>;

  return (
  <div className="project-page">
    <h1 className="project-title">{project?.title || 'Geen titel'}</h1>
    <p className="project-description">Hier komt het taakbord voor project {project?.title}.</p>

    <section className="tasks-section">
      <h2 className="tasks-title">Taken</h2>

      <div className="filter-status">
        <label>Filter op status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Alle statussen</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link
            to={`/projects/${projectDocumentId}/backlog`}
            className="backlog-button"
        >
             Ga naar backlog
        </Link>
        </div>


      {tasksLoading && <p className="tasks-loading">Taken laden...</p>}
      {tasksError && <p className="tasks-error">Fout bij laden taken: {tasksErrorObj.message}</p>}

      {!tasksLoading && !tasksError && (
        <div className="status-columns">
          {visibleStatuses.map((status) => (
            <div key={status} className="task-group">
              <h3 className="task-group-title">{status}</h3>
              {groupedTasks[status].length === 0 ? (
                <p className="no-tasks">Geen taken in deze status.</p>
              ) : (
                <ul className="task-list">
                  {groupedTasks[status].map((task) => (
                    <li key={task.id} className="task-item">
                      <button
                        className="task-button"
                        onClick={() => openTaskModal(task)}
                      >
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

      {/* Modal */}
      {selectedTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedTask.attributes?.title}</h2>

            {/* Beschrijving tonen */}
            {Array.isArray(selectedTask.description) &&
            selectedTask.description.length > 0 ? (
              selectedTask.description.map((block, index) => (
                <p key={index}>
                  {block.children?.map((child, i) => (
                    <span key={i}>{child.text}</span>
                  ))}
                </p>
              ))
            ) : (
              <p className="modal-description">Geen beschrijving</p>
            )}

            <p className="modal-status">
              Status: {selectedTask.status_relation.name || 'Onbekend'}
            </p>
            <button className="modal-close" onClick={closeModal}>Sluiten</button>
          </div>
        </div>
      )}
    </section>
  </div>
);

};

export default ProjectPage;
