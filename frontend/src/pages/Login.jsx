import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
    } catch (err) {
      setMessage("Login failed");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" className="form-control mb-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
