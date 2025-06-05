import { useProjects } from '../hooks/useProjects';
import { Link } from 'react-router-dom';
import '../app.css'

const Layout = ({ children }) => {
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) return <p>Bezig met laden...</p>;
  if (isError) return <p>Fout bij laden: {error.message}</p>;



  return (
    <div className="container">
      <aside className="sidebar">
        <h2>Projecten</h2>
        {isLoading && <p>Laden...</p>}
        {isError && <p className="error">Fout: {error.message}</p>}
        <nav className="project-list">
          {projects?.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-link"
            >
              {project.title || 'Geen titel'}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        {children}
        <footer className="footer">
          <p>&copy; 2023 Project Dashboard</p>
        </footer>
      </main>
    </div>
  );
}

export default Layout;
