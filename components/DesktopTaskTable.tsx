"use client";
import 'sweetalert2/dist/sweetalert2.min.css';

import React, { useState, useEffect } from 'react';
import tasksData from "../data/data.json"; // Ensure this path is correct
import { FaPen, FaTrash, FaSearch, FaSort, FaFilter } from 'react-icons/fa'; // Importing icons from react-icons
import Swal from 'sweetalert2';

type Priority = 'Low' | 'Medium' | 'High';

interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  priority: Priority;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // If no tasks in local storage, use initial data
      setTasks(tasksData.map(task => ({ ...task, priority: 'Low' as Priority })));
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const handlePriorityChange = (taskId: number, newPriority: Priority) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

 const handleEdit = async (taskId: number) => {
  // Find the task to edit
  const taskToEdit = tasks.find(task => task.id === taskId);
  
  if (!taskToEdit) return;

  // Show the SweetAlert dialog for editing the task
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: 'Edit Task',
    html: `
      <div style="text-align: left; display:block;">
        <div style="margin-bottom: 10px;">
          <label for="swal-input1" style="font-weight: bold;display:block;">Title:</label>
          <input style="clear: both;"id="swal-input1" class="swal2-input" placeholder="Title" value="${taskToEdit.name}">
        </div>
        
        <div style="margin-bottom: 10px;">
          <label for="swal-input2" style="font-weight: bold;">Description:</label>
          <input id="swal-input2" class="swal2-input" placeholder="Description" value="${taskToEdit.description}">
        </div>
        
        <div style="margin-bottom: 10px;">
          <label for="swal-input3" style="font-weight: bold;">Due Date:</label>
          <input style="display:block;" type="date" id="swal-input3" class="swal2-input" value="${taskToEdit.dueDate}">
        </div>
        
        <div style="margin-bottom: 10px;">
          <label for="swal-input4" style="font-weight: bold;">Status:</label>
          <select style="display:block;" id="swal-input4" class="swal2-input">
            <option value="In Progress" ${taskToEdit.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${taskToEdit.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Edit Task',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const title = (document.getElementById('swal-input1') as HTMLInputElement).value;
      const description = (document.getElementById('swal-input2') as HTMLInputElement).value;
      const dueDate = (document.getElementById('swal-input3') as HTMLInputElement).value;
      const status = (document.getElementById('swal-input4') as HTMLSelectElement).value;

      if (!title || !description || !dueDate) {
        Swal.showValidationMessage('Please enter all fields');
      }

      return { title, description, dueDate, status };
    }
  });

  // Check if the user confirmed the edit
  if (isConfirmed && formValues) {
    // Update the task in the state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...formValues } : task
      )
    );
    Swal.fire('Task updated!', '', 'success');
  }
};

  const handleDelete = async (taskId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      console.log(`Delete task with ID: ${taskId}`);
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
      Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = async () => {
    console.log("Add Task button clicked");
  
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Add Task',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Title">
        <input id="swal-input2" class="swal2-input" placeholder="Description">
        <input type="date" id="swal-input3" class="swal2-input">
      `,
      focusConfirm: false,
      showCancelButton: true, // Show the cancel button
      confirmButtonText: 'Add Task', // Text for the confirm button
      cancelButtonText: 'Cancel', // Text for the cancel button
      preConfirm: () => {
        const title = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const dueDate = (document.getElementById('swal-input3') as HTMLInputElement).value;
  
        if (!title || !description || !dueDate) {
          Swal.showValidationMessage('Please enter all fields');
        }
  
        return { title, description, dueDate };
      }
    });
  
    // Check if the user confirmed the addition of the task
    if (isConfirmed && formValues) {
      // Create a new task object with status set to 'In Progress'
      const newTask: Task = {
        id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1, // Generate a new ID
        name: formValues.title, // Use the title from the form
        description: formValues.description,
        dueDate: formValues.dueDate,
        status: 'In Progress', // Set status to 'In Progress'
        priority: 'Low' // Default priority
      };
  
      // Update the tasks state with the new task
      setTasks([...tasks, newTask]);
      Swal.fire('Task added!', '', 'success');
    }
  };

  const handleSort = () => {
    console.log("Sort button clicked");
    // Implement sort functionality here
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
    // Implement filter functionality here
  };

  return (
    <div className="flex flex-col items-center my-12 px-4">
      <div className="flex justify-between w-full mb-8">
        <h2 className="text-lg font-bold text-left max-w-[200px] w-full">Task</h2>
        <div className="relative w-full max-w-[200px]">
          <FaSearch className="absolute left-3 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 pl-10 w-full" // Added padding to the left for the icon
          />
        </div>
      </div>

      {/* Buttons for Add Task, Sort, and Filter */}
      <div className="flex justify-end gap-2 w-full mb-4 ">
        <button onClick={handleAddTask} className="bg-red-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
        <button onClick={handleSort} className="border border-gray-300 bg-white text-black px-4 py-2 rounded hover:bg-green-600 transition flex items-center">
          <FaSort className="mr-2" /> Sort
        </button>
        <button onClick={handleFilter} className="border border-gray-300 bg-white text-black px-4 py-2 rounded hover:bg-yellow-600 transition flex items-center">
          <FaFilter className="mr-2" /> Filter
        </button>
      </div>
      <table id="task-table" className="min-w-full border-collapse rounded-[8px] border-2 border-[#941B0F] mx-4">
        <thead>
          <tr className="bg-[#FFF9F8] border-2 border-[#941B0F] text-[#941B0F]">
            <th className="border border-light-red text-center p-2 bg[#FFF9F8]">SL.No</th>
            <th className="border border-light-red text-center p-2 bg[#FFF9F8]">Title</th>
            <th className="border border-gray-300 text-center p-2 bg[#FFF9F8]">Description</th>
            <th className="border border-gray-300 text-center p-2 bg[#FFF9F8]">Due Date</th>
            <th className="border border-gray-300 text-center p-2 bg[#FFF9F8]">Status</th>
            <th className="border border-gray-300 text-center p-2 bg[#FFF9F8]">Priority</th>
            <th className="border border-gray-300 text-center p-2 bg[#FFF9F8]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9F8]'}`}>
              <td className="border border-light-red text-center p-2">{index + 1}</td>
              <td className="border border-light-red text-center p-2">{task.name}</td>
              <td className="border border-gray-300 text-center p-2">{task.description}</td>
              <td className="border border-gray-300 text-center p-2">{task.dueDate}</td>
              <td className="border border-gray-300 text-center p-2">
                <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                  {task.status}
                </span>
              </td>
              <td className="border border-gray-300 text-center p-2">
                <select
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(task.id, e.target.value as Priority)}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </td>
              <td className="border border-gray-300 text-center p-2 flex justify-center items-center">
                <FaPen
                  className="cursor -pointer mx-2 hover:text-blue-500 transition-transform transform hover:scale-110"
                  onClick={() => handleEdit(task.id)}
                  title="Edit Task"
                />
                <FaTrash
                  className="cursor-pointer mx-2 hover:text-red-500 transition-transform transform hover:scale-110"
                  onClick={() => handleDelete(task.id)}
                  title="Delete Task"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .status {
          display: inline-block;
          padding: 0.5em 1em;
          border-radius: 10px; /* Adjusted border radius for a softer rectangular shape */
          color: white; /* Text color */
        }
        .completed {
          background-color: green; /* Green background for Completed */
        }
        .in-progress {
          background-color: yellow; /* Yellow background for In Progress */
          color: black; /* Black text for better contrast */
        }
        .bg-light-red {
          background-color: #ffcccb; /* Light red background */
        }
      `}</style>
    </div>
  );
};

export default TaskTable;