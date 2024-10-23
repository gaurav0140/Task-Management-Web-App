import React, { createContext, useContext, useState } from 'react';

export interface ITask {
    id: number;
    name: string;
    description: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: statusEnum;
}

export enum statusEnum {
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    PENDING = 'Pending',
}

interface TaskContextType {
    tasks: ITask[];
    addTask: (task: ITask) => void;
    editTask: (task: ITask) => void;
    deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<ITask[]>([]);

    const addTask = (task: ITask) => setTasks([...tasks, task]);
    const editTask = (updatedTask: ITask) => {
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    };
    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};