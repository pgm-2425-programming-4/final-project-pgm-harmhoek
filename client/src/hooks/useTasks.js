import { useQuery } from '@tanstack/react-query';
import { API_URL, API_TOKEN } from '../constants/constants.js';

export const useTasks = (projectDocumentId) => {
  return useQuery({
    queryKey: ['tasks', projectDocumentId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/tasks?filters[project][documentId][$eq]=${projectDocumentId}&populate=status_relation`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data.data;
    },
    enabled: !!projectDocumentId,
  });
};
