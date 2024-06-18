// TaskContext.tsx

import React, { createContext, useContext, useState } from "react";

interface TaskContextType {
  tasksData: TaskData;
  addTask: (date: Date, task: string) => void;
  removeTask: (date: Date, index: number) => void;
}

interface TaskData {
  [key: string]: string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasksData, setTasksData] = useState<TaskData>({
    "2024-06-17": ["Complete frontend Challange", "Complete UI/UX challange"],
    "2024-06-18": ["Do something", "Finish personal project"],
    "2024-06-19": ["Exam Prep"],
    "2024-06-20": ["Internship Project"],
  });

  const addTask = (date: Date, task: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    setTasksData((prevTasksData) => ({
      ...prevTasksData,
      [formattedDate]: [...(prevTasksData[formattedDate] || []), task],
    }));
  };

  const removeTask = (date: Date, index: number) => {
    const formattedDate = date.toISOString().split("T")[0];
    const updatedTasks = [...tasksData[formattedDate]];
    updatedTasks.splice(index, 1);
    setTasksData({
      ...tasksData,
      [formattedDate]: updatedTasks,
    });
  };

  const contextValue: TaskContextType = {
    tasksData,
    addTask,
    removeTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
