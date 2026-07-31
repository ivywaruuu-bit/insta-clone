import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      onLogin && onLogin(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input value={form.emailOrUsername} onChange={e=>setForm({...form, emailOrUsername:e.target.value})} placeholder="email or username" required className="input" />
      <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="password" type="password" required className="input" />
      <button className="btn">Login</button>
    </form>
  );
}
