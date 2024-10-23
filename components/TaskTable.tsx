import React, { useState } from 'react';
import { useTaskContext } from './TaskContext';

interface Task {
  id: number;
  name: string;
  priority: string;
  status: string;
  dueDate: string;
}

const TaskTable: React.FC = () => {
  const { tasks, deleteTask } = useTaskContext();
  const [search, setSearch] = useState('');

  const filteredTasks: Task[] = tasks.filter((task: Task) =>
    task.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search Tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredTasks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task: Task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.dueDate}</td>
                <td>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                  {/* Add Edit Functionality Here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TaskTable;