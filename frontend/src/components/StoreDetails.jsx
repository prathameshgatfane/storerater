import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/admin/stores/${id}`)
      .then(res => setStore(res.data))
      .catch(() => setError("Failed to load store details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!store) return <p>Store not found.</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Store Details</h2>
      <p><strong>Name:</strong> {store.name}</p>
      <p><strong>Email:</strong> {store.email}</p>
      <p><strong>Address:</strong> {store.address}</p>
      {/* You can add code to show rating if desired */}
    </div>
  );
}
