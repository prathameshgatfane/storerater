import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">StoreRater</Link>
        <div className="navbar-nav">
          <NavLink className="nav-link" to="/">Home</NavLink>
          {user && <NavLink className="nav-link" to="/stores">Stores</NavLink>}
          {user?.role === "ADMIN" && (
            <>
              <NavLink className="nav-link" to="/dashboard">Admin Dashboard</NavLink>
              <NavLink className="nav-link" to="/admin/add-user">Add User</NavLink>
              <NavLink className="nav-link" to="/admin/users">Users List</NavLink>
              <NavLink className="nav-link" to="/admin/stores">Stores List</NavLink>
            </>
          )}
          {user?.role === "OWNER" && (
            <NavLink className="nav-link" to="/owner">Owner</NavLink>
          )}
        </div>
        <div className="navbar-nav ms-auto align-items-center">
          {!user ? (
            <>
              <NavLink className="nav-link" to="/login">Login</NavLink>
              <NavLink className="nav-link" to="/signup">Signup</NavLink>
            </>
          ) : (
            <>
              <span className="navbar-text me-3">
                {user.name} • {user.role}
              </span>
              <NavLink
                className="btn btn-sm btn-outline-warning me-2"
                to="/change-password"
              >
                Change Password
              </NavLink>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
