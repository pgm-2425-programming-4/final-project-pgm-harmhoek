// client/src/hooks/useProjects.js
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
  return data.data.map(project => ({
    id: project.documentId,
    title: project.title || 'Geen titel',
  }));
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
};
