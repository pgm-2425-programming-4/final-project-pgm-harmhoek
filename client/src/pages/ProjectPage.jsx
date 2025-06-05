import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';
import { useTasks } from '../hooks/useTasks';

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

  // Project ophalen
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


  // Taken ophalen voor het project
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorObj,
  } = useTasks(projectDocumentId);

  if (projectLoading) return <p>Project laden...</p>;
  if (projectError) return <p>Fout bij laden project: {projectErrorObj.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{project?.title || 'Geen titel'}</h1>
      <p className="mt-4">Hier komt het taakbord voor project {project?.title}.</p>

      <section className="tasks">
        <h2 className="mt-8 mb-4 text-xl font-semibold">Taken</h2>

        {tasksLoading && <p>Taken laden...</p>}
        {tasksError && <p>Fout bij laden taken: {tasksErrorObj.message}</p>}

        {!tasksLoading && !tasksError && (
        Array.isArray(tasks) && tasks.length > 0
        ? (
        <ul>
            {tasks.map(task => (
            <li key={task.id} className="task-item">
                    {task.title || 'Geen titel'}
            </li>
        ))}
        </ul>
    )
    : <p>Geen taken gevonden voor dit project.</p>
)}

      </section>
    </div>
  );
};

export default ProjectPage;
