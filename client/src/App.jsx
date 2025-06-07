import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import PaginatedBacklog from "./components/PaginatedBacklog";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:documentId" element={<ProjectPage />} />
          <Route path="/projects/:documentId/backlog" element={<PaginatedBacklog />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
