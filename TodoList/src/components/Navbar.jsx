import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          📝 Todo App
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link px-3" to="/">
            Home
          </Link>

          <Link className="nav-link px-3" to="/todos">
            Todo List
          </Link>

          <Link className="nav-link px-3" to="/contacts">
            Contacts
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;