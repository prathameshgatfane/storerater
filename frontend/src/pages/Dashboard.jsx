import React, { useState, useEffect } from "react";
import api from "../api";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        setErrorStats("Failed to load dashboard stats");
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post("/stores", { name, email, address });
      setMessage("Store added successfully!");
      setName("");
      setEmail("");
      setAddress("");
    } catch (err) {
      setMessage("Failed to add store: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="container mt-3">
      <h1>Admin Dashboard</h1>

      {/* Show stats */}
      <div className="row mb-4">
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : errorStats ? (
          <p className="text-danger">{errorStats}</p>
        ) : (
          <>
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Users</h5>
                  <p className="display-4">{stats.users}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Stores</h5>
                  <p className="display-4">{stats.stores}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Ratings</h5>
                  <p className="display-4">{stats.ratings}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Store Form */}
      <div className="col-md-8 offset-md-2">
        <h2>Add Store</h2>
        <form onSubmit={handleAddStore}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Store Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Store Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Store Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button className="btn btn-primary">Add Store</button>
        </form>
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}
