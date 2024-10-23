import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Examlist from "./components/Examlist";
import Exam from "./components/Exam";
import CreateExam from "./components/CreateExam";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token"); // Clear token on logout
  };

  return (
    <Router>
      <div className="App">
        <nav>
          {token ? (
            <>
              <button
                onClick={handleLogout}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Logout
              </button>
              <br />
              {token && (
                <>
                  <Link
                    to="/create-exam"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Create Exam
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>{" "}
              |{" "}
              <Link
                to="/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setToken={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" /> : <Register />}
          />

          {token ? (
            <>
              <Route path="/dashboard" element={<Dashboard token={token} />} />

              <Route path="/examlist" element={<Examlist token={token} />} />

              <Route path="/exam/:examId" element={<Exam token={token} />} />

              <Route
                path="/create-exam"
                element={<CreateExam token={token} />}
              />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
