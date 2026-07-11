import { useState } from "react";
import AddTask from "./components/addtask";
import SearchBar from "./components/searchbar";
import Filter from "./components/filter";
import TaskList from "./components/tasklist";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  function addTask(text) {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1>To-Do List</h1>

        <AddTask onAdd={addTask} />

        <SearchBar search={search} setSearch={setSearch} />

        <Filter filter={filter} setFilter={setFilter} />

        <TaskList
          tasks={filteredTasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />

        <div className="todo-count">
          <p>Total: {tasks.length}</p>
          <p>Completed: {tasks.filter((t) => t.completed).length}</p>
          <p>Active: {tasks.filter((t) => !t.completed).length}</p>
        </div>
      </div>
    </div>
  );
}

export default App;