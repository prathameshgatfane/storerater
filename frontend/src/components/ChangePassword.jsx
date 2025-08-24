import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Your axios instance or fetch wrapper

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8-16 characters, and include 1 uppercase letter and 1 special character."
      );
      return;
    }
    setError("");
    try {
      await api.put("/auth/update-password", { password });
      setMessage("Password updated successfully! Please log in again.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Change Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirm" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="form-control"
            placeholder="Re-enter new password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Password
        </button>
      </form>
    </div>
  );
}
