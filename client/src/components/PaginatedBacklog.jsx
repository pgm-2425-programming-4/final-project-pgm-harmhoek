import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Backlog from './Backlog.jsx';
import Pagination from './Pagination.jsx';
import { API_TOKEN, API_URL } from '../constants/constants.js';
import { useParams } from 'react-router-dom';

export default function PaginatedBacklog() {
  const { documentId } = useParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // default 10 items per pagina

  const BACKLOG_STATUS_DOCUMENT_ID = 'jtk029d37i2ul5axvewjjhuy';

  const fetchTasks = async () => {
    const url = `${API_URL}/tasks?filters[project][documentId][$eq]=${documentId}&filters[status_relation][documentId][$eq]=${BACKLOG_STATUS_DOCUMENT_ID}&populate=status_relation&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    console.log('Fetching backlog with URL:', url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Response error:', errorText);
      throw new Error('Failed to fetch backlog tasks');
    }

    const data = await res.json();
    console.log('Fetched backlog tasks:', data.data);
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['backlog-tasks', documentId, page, pageSize],
    queryFn: fetchTasks,
    enabled: !!documentId,
  });


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

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErrorObj,
  } = useQuery({
    queryKey: ['project', documentId],
    queryFn: () => fetchProjectByDocumentId(documentId),
    enabled: !!documentId,
  });

  // ✅ Deze return mag pas NA alle hooks
  if (isLoading) return <p>Loading backlog...</p>;
  if (isError) return <p>Er ging iets mis bij laden van de backlog.</p>;

  return (
    <div className="backlog-page">
      {projectLoading ? (
        <p>Project laden...</p>           
      ) : projectError ? (
        <p>Fout bij laden project: {projectErrorObj.message}</p>
      ) : (
        <h1>Backlog voor project {project.title || 'Onbekend project'}</h1>
      )}

      <Backlog tasks={data.data} />

      <Pagination
        page={page}
        pageCount={data.meta.pagination.pageCount}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
}
