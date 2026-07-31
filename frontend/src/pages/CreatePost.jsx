import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('caption', caption);
      if (file) form.append('image', file);
      await API.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' }});
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Create post</h2>
      <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Caption" className="input" />
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button className="btn">Post</button>
    </form>
  );
}
