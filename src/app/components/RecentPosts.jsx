import PostCard from './PostCard';
export default async function RecentPosts({limit}) {
  let posts = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Use absolute URL
    const result = await fetch(`${baseUrl}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ limit: limit, order: 'desc' }),
      cache: 'no-store',
    });
    const data = await result.json();
    posts = data.posts;
  } catch (error) {
    console.log('Error getting post:', error);
  }
  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-xl mt-5'>Recent articles</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}