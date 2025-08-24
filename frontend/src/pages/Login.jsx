import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      const token = data.token;
      login(token);  // stores token & decodes user info in AuthContext

      const decoded = jwtDecode(token);
      const { role } = decoded;

      // Redirect by role
      if (role === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else if (role === "OWNER") {
        navigate("/owner", { replace: true });
      } else {
        navigate("/", { replace: true }); // normal user to home
      }

      setMessage("Login successful!");
    } catch (err) {
      setMessage("Login failed: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary">Login</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default Login;
