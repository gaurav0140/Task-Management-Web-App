import React, { useState } from 'react';
import { ITask, statusEnum, useTaskContext } from './TaskContext';

// Define a union type for priority
type Priority = 'Low' | 'Medium' | 'High';

// interface Task {
//   id: number;
//   name: string;
//   description: string;
//   dueDate: string;
//   priority: Priority; // Use the union type here
//   status: 'In Progress' | 'Completed';
// }

const TaskModal: React.FC<{isOpen: boolean,  onClose: () => void }> = ({ onClose }) => {
  const { addTask } = useTaskContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Low'); // Specify the type here
  const [status, setStatus] = useState<statusEnum>(statusEnum.PENDING); // Default status

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: ITask = {
      id: Date.now(),
      name,
      description,
      dueDate,
      priority,
      status,
    };
    addTask(newTask);
    setName('');
    setDescription('');
    setDueDate('');
    setPriority('Low'); // Reset to default
    setStatus(statusEnum.PENDING); // Reset to default
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label htmlFor="task-name">Task Name:</label>
        <input
          id="task-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
        />
        <label htmlFor="task-description">Description:</label>
        <input
          id="task-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
        <label htmlFor="task-due-date">Due Date:</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label htmlFor="task-priority">Priority:</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)} // Cast to Priority
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <label htmlFor="task-status">Status:</label>
        <select
          id="task-status"
          value={status}
          onChange={(e) => {
            switch (e.target.value) {
              case statusEnum.COMPLETED:
                setStatus(statusEnum.COMPLETED)
              case statusEnum.PENDING:
                setStatus(statusEnum.PENDING)
              case statusEnum.IN_PROGRESS:
                setStatus(statusEnum.IN_PROGRESS)
              default:
                console.error('Invalid Status');
            }
          }}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Task</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskModal;