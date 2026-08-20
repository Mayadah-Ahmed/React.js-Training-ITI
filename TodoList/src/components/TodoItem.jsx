function TodoItem({
  todo,
  toggleTodo,
  deleteTodo,
  editTodo,
  updateTodo,
  editingId,
  editTitle,
  setEditTitle,
}) {
  const isEditing = editingId === todo.id;

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">

        {isEditing ? (
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <button
              className="btn btn-success"
              onClick={() => updateTodo(todo.id)}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="card-title mb-2">
                {todo.title}
              </h5>

              <span
                className={`badge ${
                  todo.completed
                    ? "bg-success"
                    : "bg-secondary"
                }`}
              >
                {todo.completed
                  ? "Completed"
                  : "Not Completed"}
              </span>
            </div>

            <div className="d-flex gap-2">

              <button
                className={`btn ${
                  todo.completed
                    ? "btn-warning"
                    : "btn-success"
                }`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed ? "Undo" : "Done"}
              </button>

              <button
                className="btn btn-info"
                onClick={() =>
                  editTodo(todo.id, todo.title)
                }
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() =>
                  deleteTodo(todo.id)
                }
              >
                Delete
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TodoItem;