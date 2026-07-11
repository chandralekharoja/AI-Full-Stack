function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className="todo-task">
      <span
        className={task.completed ? "todo-task-completed" : ""}
      >
        {task.text}
      </span>

      <div>
        <button onClick={() => toggleTask(task.id)}>
          ✓
        </button>

        <button onClick={() => deleteTask(task.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="todo-task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

export default TaskList;