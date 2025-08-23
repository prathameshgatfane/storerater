import React, { useEffect, useState } from "react";
import axios from "axios";

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    };
    fetchStores();
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      <ul className="list-group">
        {stores.map((s) => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            {s.name} - {s.address}
            <span className="badge bg-primary">⭐ {s.avg_rating || "No ratings"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stores;
