import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await API.get(`/users/${username}`);
      setProfile(res.data);
    }
    load();
  }, [username]);

  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold">{profile.displayName || profile.username}</h2>
      <p>{profile.followers.length} followers · {profile.following.length} following</p>
      {/* Listing posts: you'd add an endpoint to fetch posts by user */}
    </div>
  );
}
