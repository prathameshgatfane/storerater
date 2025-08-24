import React, { useState } from "react";
import api from "../api";

export default function RateStore({ storeId, refreshStores, userRating = 0 }) {
  const [rating, setRating] = useState(userRating);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ratings", { store_id: storeId, rating });
      refreshStores(); // Refresh list to show updated ratings
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  return (
    <form className="d-flex align-items-center" onSubmit={handleSubmit}>
      <select className="form-select me-2" style={{ width: 70 }} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button type="submit" className="btn btn-sm btn-success">
        Rate
      </button>
    </form>
  );
}
