import { useQuery } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';

const fetchProjects = async () => {
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();

  // Verwerk de data zodat elk project een title heeft
  return data.data.map(project => ({
    id: project.documentId,
    title: project.title || 'Geen titel',
  }));
};

const HomePage = () => {
  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  if (isLoading) return <p>Loading projecten...</p>;
  if (isError) return <p>Fout bij laden: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Welkom bij het Project Dashboard</h1>
      <p className="mt-4">Kies een project in de zijbalk om aan de slag te gaan.</p>
    </div>
  );
};

export default HomePage;
