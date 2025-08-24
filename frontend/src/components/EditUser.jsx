import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setForm({ ...res.data, password: "" }); // password left blank for admin update
      } catch (err) {
        setError("Failed to load user data");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${id}`, form);
      setMessage("User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Edit User</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
            minLength={20}
            maxLength={60}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-control"
            maxLength={400}
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="form-select">
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
        <div className="mb-3">
          <label>New Password (leave blank to keep current)</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            minLength={8}
            maxLength={16}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
