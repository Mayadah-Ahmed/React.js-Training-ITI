import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container py-5">
      <div className="row align-items-center min-vh-75">

        <div className="col-md-7">
          <h1 className="display-4 fw-bold mb-3">
            Welcome to Todo App
          </h1>

          <p className="lead text-secondary mb-4">
            Stay organized, manage your tasks, and get things done
            with our simple Todo Management App.
          </p>

          <div className="d-flex gap-3">
            <Link to="/todos" className="btn btn-primary btn-lg">
              View Todos
            </Link>

            <Link
              to="/contacts"
              className="btn btn-outline-dark btn-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="col-md-5 text-center mt-5 mt-md-0">
          <div className="display-1">✅</div>

          <h3 className="fw-bold mt-3">
            Stay Organized
          </h3>

          <p className="text-secondary">
            Add, edit, complete and delete your tasks easily.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;