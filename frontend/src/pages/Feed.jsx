import React, { useEffect, useState } from 'react';
import API from '../api';
import Post from '../components/Post';
import io from 'socket.io-client';

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await API.get('/posts');
      if (mounted) setPosts(res.data);
    }
    load();

    // simple socket client; in real app register user room after login
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000');
    socket.on('connect', () => {
      // optionally register user (if you store userId after login)
      // socket.emit('registerUser', userId)
    });
    socket.on('notification', (data) => {
      console.log('notif', data);
      // could show toasts or refresh feed
    });

    return () => { mounted = false; socket.disconnect(); };
  }, []);

  return (
    <div className="space-y-4">
      {posts.map(p => <Post key={p._id} post={p} onUpdate={(newP)=>setPosts(prev=>prev.map(x=>x._id===newP._id?newP:x))} />)}
    </div>
  );
}
