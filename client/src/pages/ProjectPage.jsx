import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';

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
  const { documentId } = useParams();

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', documentId],
    queryFn: () => fetchProjectByDocumentId(documentId),
    enabled: !!documentId,
  });

  if (isLoading) return <p>Loading project...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{project.title || 'Geen titel'}</h1>
      <p className="mt-4">Hier komt het taakbord voor project {project.title}.</p>
      {/* Voeg meer projectdetails toe als gewenst */}
    </div>
  );
};

export default ProjectPage;


