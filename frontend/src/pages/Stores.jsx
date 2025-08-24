import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance with token interceptor
import RateStore from "../components/RateStore"; // Rating form component

export default function Stores() {
  const [stores, setStores] = useState([]);

  // Fetch stores from backendAPI
  const fetchStores = async () => {
    try {
      const { data } = await api.get("/stores");
      setStores(data);
    } catch {
      setStores([]);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      <ul className="list-group">
        {stores.length === 0 && <li className="list-group-item">No stores found.</li>}
        {stores.map((store) => (
          <li key={store.id || store._id} className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row">
            <div>
              <strong>{store.name}</strong>
              <br />
              <small>{store.address}</small>
            </div>
            <div>
              <span className="badge bg-primary me-3">⭐ {store.avg_rating ?? "No ratings"}</span>
              <RateStore storeId={store.id || store._id} refreshStores={fetchStores} userRating={store.my_rating} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
