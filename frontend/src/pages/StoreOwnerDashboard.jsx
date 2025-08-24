import React, { useEffect, useState } from "react";
import api from "../api";

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [userRatings, setUserRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const res = await api.get("/stores/owner/dashboard");
        setStore(res.data.store);
        setAvgRating(res.data.avg_rating);
        setUserRatings(res.data.user_ratings);
        setError("");
      } catch {
        setError("Failed to load dashboard data");
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading Store Owner Dashboard...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Store Owner Dashboard</h2>
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p>
        Average Rating: <strong>{avgRating.toFixed(2)}</strong>
      </p>

      <h4>User Ratings</h4>
      {userRatings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <ul className="list-group">
          {userRatings.map(({ user_id, user_name, rating }) => (
            <li key={user_id} className="list-group-item">
              {user_name} rated: {rating} stars
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
