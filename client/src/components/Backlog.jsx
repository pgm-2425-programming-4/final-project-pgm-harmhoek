
export default function Backlog({ tasks }) {
  return (
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
              <td>{title}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
