import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Backlog from './Backlog.jsx'
import Pagination from './Pagination.jsx'

export default function PaginatedBacklog() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5) // gebruiker kan dit aanpassen

  const fetchTasks = async () => {
    const res = await fetch(
      `http://localhost:1337/api/tasks?populate=status_relation&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    const data = await res.json()
    return data
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', page, pageSize],
    queryFn: fetchTasks
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Er ging iets mis.</p>

  return (
    <div>
      <Backlog tasks={data.data} />
      <Pagination
        page={page}
        pageCount={data.meta.pagination.pageCount}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  )
}
