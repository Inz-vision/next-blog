'use client';

import { useEffect, useState } from 'react';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import { useSearchParams } from 'next/navigation';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import { fetchPosts } from '@/lib/actions/posts'; // Import fetchPosts

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadPosts = async () => {
      if (tab === 'posts') {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchPosts(0, 10, 'desc'); // Fetch posts
          setPosts(data.data.posts); // Set posts in state
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPosts();
  }, [tab]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === 'profile' && <DashProfile />}

      {/* Posts */}
      {tab === 'posts' && (
        <>
          {loading && <p>Loading posts...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && <DashPosts posts={posts} />}
        </>
      )}

      {/* Users */}
      {tab === 'users' && <DashUsers />}

      {/* Dashboard */}
      {tab === 'dash' && <DashboardComp />}
    </div>
  );
}