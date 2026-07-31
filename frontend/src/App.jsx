import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import { setAuthToken } from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  useEffect(() => {
    setAuthToken(token);
    if (!token) navigate('/login');
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-white shadow p-4 flex justify-between">
        <Link to="/" className="font-bold">InstaClone</Link>
        <div className="space-x-4">
          <Link to="/">Feed</Link>
          <Link to="/create">Create</Link>
          <button onClick={logout} className="text-red-500">Logout</button>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/register" element={<Register onRegister={(t)=>{setToken(t)}}/>} />
          <Route path="/login" element={<Login onLogin={(t)=>{localStorage.setItem('token', t); setToken(t);}}/>} />
          <Route path="/u/:username" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
