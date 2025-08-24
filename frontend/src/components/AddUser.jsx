import React, { useState } from "react";
import api from "../api";

const roles = ["NORMAL_USER", "ADMIN", "STORE_OWNER"]; // match backend roles

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "NORMAL_USER",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Client-side validators
  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60)
      errs.name = "Name must be 20-60 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (form.address.length > 400)
      errs.address = "Address max 400 characters";
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password))
      errs.password = "Password must be 8-16 chars, include uppercase & special char";
    return errs;
  };

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await api.post("/admin/users", form);
      setMessage("User added successfully!");
      setForm({ name: "", email: "", address: "", password: "", role: "NORMAL_USER" });
      setErrors({});
    } catch (err) {
      setMessage("Failed to add user: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Add New User</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} className={`form-control ${errors.name ? "is-invalid" : ""}`} />
          <div className="invalid-feedback">{errors.name}</div>
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input name="email" value={form.email} onChange={onChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={onChange} className={`form-control ${errors.address ? "is-invalid" : ""}`} rows="3" />
          <div className="invalid-feedback">{errors.address}</div>
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className={`form-control ${errors.password ? "is-invalid" : ""}`} />
          <div className="invalid-feedback">{errors.password}</div>
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select name="role" value={form.role} onChange={onChange} className="form-select">
            {roles.map(r => (
              <option key={r} value={r}>
                {r.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
    </div>
  );
}
