import "./App.css";
import Calendar from "./components/Calander";
import Tasks from "./components/Tasks";
import Popup from "./components/Popup";
import { useState, useEffect } from "react";
import { DateProvider } from "./components/DateContext";
import { TaskProvider } from "./components/TaskContext";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const saveUserToServer = async (user: string) => {
    try {
      const response = await fetch("http://localhost:3000/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUser: user }),
      });

      if (response.ok) {
        console.log(`User file created for ${user}`);
      } else {
        console.error("Failed to create user file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTasks(username);
    }
  }, [username]);

  const fetchTasks = async (user: string) => {
    try {
      const response = await fetch(`http://localhost:3000/fetch-tasks/${user}`);
      if (response.ok) {
        const tasks = await response.json();
        // Assuming you have a setTasksData function in your TaskContext to update tasks
        // setTasksData(tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DateProvider>
      <TaskProvider>
        {username === "" ? (
          <Popup
            setUsername={(name) => {
              setUsername(name); // Update username state
              localStorage.setItem("currentUser", name); // Save username to localStorage
              saveUserToServer(name); // Save user to server
            }}
          />
        ) : (
          <section className="main-page">
            <div className="task-div">
              <Tasks />
            </div>
            <div className="calendar-div">
              <Calendar />
            </div>
          </section>
        )}
      </TaskProvider>
    </DateProvider>
  );
}

export default App;
