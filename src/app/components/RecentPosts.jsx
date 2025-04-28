'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';

export default function RecentPosts({ limit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Limit:', limit); // Debugging log

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/post/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limit, order: 'desc' }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  if (loading) {
    return <p>Loading recent posts...</p>;
  }

  if (posts.length === 0) {
    return <p className='flex items-center justify-center h-full text-center gap-2 p-3'>No recent posts found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}