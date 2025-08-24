import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Import your AuthContext hook

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // Destructure login function from context

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", {
        name,
        email,
        address,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      login(token);   // Update AuthContext with new token & user info

      setMessage("Signup successful!");
      navigate("/"); // Redirect normal users to home page after signup
    } catch (err) {
      setMessage("Signup failed: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" className="form-control mb-2" placeholder="Name"
          value={name} onChange={(e) => setName(e.target.value)} required
        />
        <input 
          type="email" className="form-control mb-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="text" className="form-control mb-2" placeholder="Address"
          value={address} onChange={(e) => setAddress(e.target.value)}
        />
        <input 
          type="password" className="form-control mb-2" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        <button className="btn btn-success">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
