import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };

  // const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem("user")) || null
  // );

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">💰 Expense Tracker</h1>

      <div className="flex items-center gap-6">
        {user && <span>Hi, {user.username}</span>}

        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/expenses" className="hover:underline">
          Expenses
        </Link>

        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
