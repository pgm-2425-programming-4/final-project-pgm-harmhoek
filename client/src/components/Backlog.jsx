import { useState } from 'react';

export default function Backlog({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null);

  const openTaskModal = (task) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);

  return (
    <div className="backlog-table-container">
      <table>
        <thead>
          <tr>
            <th>Titel</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const title = task?.title ?? 'Geen titel';

            return (
              <tr key={task.id}>
                <td>
                  <button
                    className="task-button"
                    onClick={() => openTaskModal(task)}
                  >
                    {title}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
              Status: {selectedTask.status_relation?.name || 'Onbekend'}
            </p>

            <button className="modal-close" onClick={closeModal}>Sluiten</button>
          </div>
        </div>
      )}
    </div>
  );
}
