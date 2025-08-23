import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ADD THIS

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ADD THIS

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Signup successful!');
      // Wait briefly and then redirect
      setTimeout(() => {
        navigate('/stores'); // Change to "/login" if you want
      }, 1000);
    } catch (err) {
      setMessage('Signup failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Signup</h2>
      <input className="form-control mb-2" name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
      <input className="form-control mb-2" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input className="form-control mb-2" name="address" placeholder="Address" value={form.address} onChange={onChange} required />
      <input className="form-control mb-2" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
      <button className="btn btn-success w-100">Signup</button>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </form>
  );
}
