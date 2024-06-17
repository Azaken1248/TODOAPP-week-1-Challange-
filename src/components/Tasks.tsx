import React, { useState, useEffect } from "react";
import { useDateContext } from "./DateContext";
import "../styles/Tasks.css";

interface TaskData {
  [key: string]: string[];
}

const initialTasksData: TaskData = {
  "2024-06-17": ["Complete frontend challenge", "Complete UI/UX challenge"],
  "2024-06-18": ["Do something", "Finish personal project"],
  "2024-06-19": ["Exam Prep"],
};

const Tasks: React.FC = () => {
  const { selectedDate } = useDateContext();
  const formattedDate = selectedDate.toISOString().split("T")[0];

  const [newTask, setNewTask] = useState<string>("");
  const [tasksData, setTasksData] = useState<TaskData>(initialTasksData);

  useEffect(() => {
    // Simulate fetching tasks data based on selectedDate
    // Here you can replace this with actual fetching logic if needed
    const fetchData = () => {
      // Check if tasksData already has tasks for the selected date
      if (!tasksData[formattedDate]) {
        // If tasks for the selected date do not exist, initialize them as an empty array
        setTasksData((prevTasksData) => ({
          ...prevTasksData,
          [formattedDate]: [],
        }));
      }
    };

    fetchData();
  }, [formattedDate, tasksData]); // Fetch data whenever formattedDate or tasksData changes

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      // Update tasksData state to include new task for selectedDate
      setTasksData((prevTasksData) => ({
        ...prevTasksData,
        [formattedDate]: [...(prevTasksData[formattedDate] || []), newTask],
      }));
      setNewTask(""); // Clear input field
    }
  };

  const handleRemoveTask = (date: string, index: number) => {
    const updatedTasks = [...tasksData[date]];
    updatedTasks.splice(index, 1);
    // Update tasksData state to remove task for selectedDate
    setTasksData({
      ...tasksData,
      [date]: updatedTasks,
    });
  };

  const tasks: string[] = tasksData[formattedDate] || [];
  const nextDayTasks: string[] =
    tasksData[getNextDayFormatted(selectedDate)] || [];

  return (
    <div className="tasks">
      <div className="header">
        <div className="day">{selectedDate.getDate()}</div>
        <div className="mm-yyyy">
          <div className="month">
            {selectedDate.toLocaleString("default", { month: "long" })}
          </div>
          <div className="year">{selectedDate.getFullYear()}</div>
        </div>
      </div>
      <div className="deadlines">
        <div className="titles">Today's Deadlines</div>
        <div className="deadlines-content">
          {tasks.length > 0 ? (
            tasks.map((task: string, index: number) => (
              <div className="task" key={index}>
                {task}
                <button
                  className="remove-task-button"
                  onClick={() => handleRemoveTask(formattedDate, index)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <div className="no-tasks">No tasks today</div>
          )}
        </div>
      </div>
      <div className="upcoming">
        <div className="titles">Upcoming Deadlines</div>
        <div className="upcoming-content">
          {nextDayTasks.length > 0 ? (
            nextDayTasks.map((task: string, index: number) => (
              <div className="task" key={index}>
                {task}
              </div>
            ))
          ) : (
            <div className="no-tasks">No tasks upcoming</div>
          )}
        </div>
      </div>
      {/* Add Task button and input */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>+</button>
      </div>
    </div>
  );
};

function getNextDayFormatted(date: Date): string {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.toISOString().split("T")[0];
}

export default Tasks;
