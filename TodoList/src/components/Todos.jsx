import { useState } from "react";
import TodoItem from "./TodoItem";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

 const [editingId, setEditingId] = useState(null);
 const [editTitle, setEditTitle] = useState("");
 //add todo
  const addTodo = () => {
    if (title.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      title: title,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle("");
  };
//toggle todo
const toggleTodo = (id) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  );
};
//delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  //update todo
  const editTodo = (id, title) => {
  setEditingId(id);
  setEditTitle(title);
};
const updateTodo = (id) => {
  if (editTitle.trim() === "") return;

  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, title: editTitle }
        : todo
    )
  );

  setEditingId(null);
  setEditTitle("");
};

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Todo List</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="btn btn-primary" onClick={addTodo}>
          Add
        </button>
      </div>

      <div>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            updateTodo={updateTodo}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />
        ))}
      </div>
    </div>
  );
}

export default Todos;