import React, { useState, useEffect } from "react";
import { useDateContext } from "./DateContext";
import { useTaskContext } from "./TaskContext";
import "../styles/Tasks.css";

const Tasks: React.FC = () => {
  const { selectedDate } = useDateContext();
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const { tasksData, addTask, removeTask } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [saved, setSaved] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("currentUser");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchTasks();
    }
  }, [username]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      addTask(selectedDate, newTask);
      setNewTask("");
    }
  };

  const handleRemoveTask = (index: number) => {
    removeTask(selectedDate, index);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/fetch-tasks/${username}`
      );
      if (response.ok) {
        const tasks: Record<string, string[]> = await response.json();
        Object.entries<string[]>(tasks).forEach(([date, tasksForDate]) => {
          tasksForDate.forEach((task) => {
            addTask(new Date(date), task);
          });
        });
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/save-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, tasksData }),
      });
      if (response.ok) {
        console.log("Tasks saved successfully");
        showSavedStatus(true);
      } else {
        console.error("Failed to save tasks");
        showSavedStatus(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showSavedStatus(false);
    }
  };

  const showSavedStatus = (status: boolean) => {
    setSaved(status);
    setTimeout(() => {
      setSaved(null);
    }, 5000); // Hide status message after 5 seconds
  };

  const goBack = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  const tasks: string[] = tasksData[formattedDate] || [];
  const nextDayFormatted = getNextDayFormatted(selectedDate);
  const nextDayTasks: string[] = tasksData[nextDayFormatted] || [];

  return (
    <div className="tasks">
      <div className="header">
        <div className="saved-status">
          {saved !== null &&
            (saved ? "Saved Successfully!!" : "Failed To Save!!")}
        </div>
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
                  onClick={() => handleRemoveTask(index)}
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
      <div className="controls">
        <div className="add-task">
          <input
            type="text"
            placeholder="Enter new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>+</button>
        </div>
        <div className="button-control">
          <button className="back-button" onClick={goBack}>
            🡨
          </button>
          <button className="save-button" onClick={saveTasks}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

function getNextDayFormatted(date: Date): string {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split("T")[0];
}

export default Tasks;
