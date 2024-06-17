import "./App.css";

import Calendar from "./components/Calander";

function App() {
  return (
    <section className="main-page">
      <div className="task-div">tasks</div>
      <div className="calander-div">
        <Calendar />
      </div>
    </section>
  );
}

export default App;
