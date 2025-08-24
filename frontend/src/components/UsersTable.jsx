import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ q: "", email: "", address: "", role: "", sort: "name", dir: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <div className="filters mb-3">
        <input type="text" name="q" placeholder="Search by name" value={filters.q} onChange={handleChange} />
        <input type="text" name="email" placeholder="Search by email" value={filters.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Search by address" value={filters.address} onChange={handleChange} />
        <select name="role" value={filters.role} onChange={handleChange}>
          <option value="">All Roles</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role.replace("_", " ")}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1" onClick={() => navigate(`/admin/users/${user.id}`)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(user.id)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
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
