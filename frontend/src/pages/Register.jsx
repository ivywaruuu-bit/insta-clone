import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      onRegister && onRegister(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Register</h2>
      <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} placeholder="username" required className="input" />
      <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="email" required className="input" />
      <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="password" type="password" required className="input" />
      <button className="btn">Register</button>
    </form>
  );
}
