import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function EditStore() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get(`/admin/stores/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          address: res.data.address || ""
        });
      } catch (err) {
        setError("Failed to load store data");
      }
      setLoading(false);
    };
    fetchStore();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/admin/stores/${id}`, form);
      setMessage("Store updated successfully!");
      setTimeout(() => navigate("/admin/stores"), 1000);
    } catch (err) {
      alert("Failed to update store.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Edit Store</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Store Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter store name"
            required
            maxLength={100}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Store Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter store email"
            className="form-control"
            maxLength={120}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Store Address</label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter store address"
            className="form-control"
            maxLength={400}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
