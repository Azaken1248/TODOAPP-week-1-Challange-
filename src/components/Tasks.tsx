import React, { useState } from "react";
import { useDateContext } from "./DateContext";
import { useTaskContext } from "./TaskContext";
import "../styles/Tasks.css";

const Tasks: React.FC = () => {
  const { selectedDate } = useDateContext();
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const { tasksData, addTask, removeTask } = useTaskContext();

  const [newTask, setNewTask] = useState<string>("");

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      addTask(selectedDate, newTask);
      setNewTask("");
    }
  };

  const handleRemoveTask = (index: number) => {
    removeTask(selectedDate, index);
  };

  const tasks: string[] = tasksData[formattedDate] || [];
  const nextDayFormatted = getNextDayFormatted(selectedDate);
  const nextDayTasks: string[] = tasksData[nextDayFormatted] || [];

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
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split("T")[0];
}

export default Tasks;
