import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminStoresTable() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", sort: "name", dir: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/stores?${params}`);
      setStores(response.data);
    } catch (err) {
      setError("Failed to load stores");
    }
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, [filters]);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = id => { navigate(`/admin/stores/${id}/edit`); };
  const handleView = id => { navigate(`/admin/stores/${id}`); };
  const handleDelete = async id => {
    if (!window.confirm("Delete this store?")) return;
    try {
      await api.delete(`/admin/stores/${id}`);
      setStores(stores.filter(s => s.id !== id));
    } catch {
      alert("Failed to delete store");
    }
  };

  return (
    <div>
      <h2>Stores</h2>
      <div className="filters mb-3">
        <input type="text" name="name" placeholder="Search by name" value={filters.name} onChange={handleChange} />
        <input type="text" name="email" placeholder="Search by email" value={filters.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Search by address" value={filters.address} onChange={handleChange} />
      </div>
      {loading ? <p>Loading...</p> : error ? <p className="text-danger">{error}</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Total Ratings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr><td colSpan="5">No stores found</td></tr>
            ) : (
              stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.rating}</td>
                  <td>{store.rating_count}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1" onClick={() => handleView(store.id)}>View</button>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(store.id)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(store.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
