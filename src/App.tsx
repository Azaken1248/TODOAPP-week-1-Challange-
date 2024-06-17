import "./App.css";
import Calendar from "./components/Calander";
import Tasks from "./components/Tasks";
import { DateProvider } from "./components/DateContext";
import { TaskProvider } from "./components/TaskContext"; // Import TaskProvider

function App() {
  return (
    <DateProvider>
      <TaskProvider>
        <section className="main-page">
          <div className="task-div">
            <Tasks />
          </div>
          <div className="calendar-div">
            <Calendar />
          </div>
        </section>
      </TaskProvider>
    </DateProvider>
  );
}

export default App;
