import "./App.css";
import Calendar from "./components/Calander";
import Tasks from "./components/Tasks";
import { DateProvider } from "./components/DateContext"; // Import DateProvider

function App() {
  return (
    <DateProvider>
      <section className="main-page">
        <div className="task-div">
          <Tasks />
        </div>
        <div className="calendar-div">
          <Calendar />
        </div>
      </section>
    </DateProvider>
  );
}

export default App;
