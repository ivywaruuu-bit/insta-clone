import React, { useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Post({ post, onUpdate }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState('');

  async function toggleLike() {
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      setLiked(!liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      alert('Error liking');
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    try {
      const res = await API.post(`/posts/${post._id}/comment`, { text: comment });
      onUpdate(res.data);
      setComment('');
    } catch (err) {
      alert('Error commenting');
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div>
          <Link to={`/u/${post.author.username}`} className="font-bold">{post.author.displayName || post.author.username}</Link>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      {post.imageUrl && <img src={`http://localhost:4000${post.imageUrl}`} alt="" className="w-full max-h-96 object-cover rounded" />}
      <p className="mt-2">{post.caption}</p>
      <div className="mt-2 flex items-center space-x-3">
        <button onClick={toggleLike} className="text-sm">{liked ? 'Unlike' : 'Like'} ({likesCount})</button>
      </div>
      <div className="mt-3">
        {post.comments?.slice(-3).map(c => (
          <div key={c._id} className="text-sm py-1 border-t">{c.text}</div>
        ))}
      </div>
      <form onSubmit={submitComment} className="mt-2 flex space-x-2">
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment" className="flex-1 input" />
        <button className="btn">Comment</button>
      </form>
    </div>
  );
}
