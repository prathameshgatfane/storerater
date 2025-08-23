import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">StoreRater</Link>
        <div>
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/stores">Stores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
