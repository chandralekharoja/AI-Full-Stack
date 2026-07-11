import { useState } from "react";

function AddTask({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim()) return;

    onAdd(text);

    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="todo-add-task">
      <input
        type="text"
        placeholder="Enter task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button>Add</button>
    </form>
  );
}

export default AddTask;