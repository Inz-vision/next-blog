// 'use client';

// import { Button, Select, TextInput } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import PostCard from '../components/PostCard';

// export default function Search() {
//   const [sidebarData, setSidebarData] = useState({
//     searchTerm: '',
//     sort: 'desc',
//     category: '',
//   });

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(searchParams);
//     const searchTermFromUrl = urlParams.get('searchTerm');
//     const sortFromUrl = urlParams.get('sort');
//     const categoryFromUrl = urlParams.get('category');

//     if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
//       setSidebarData((prev) => ({
//         ...prev,
//         searchTerm: searchTermFromUrl || '',
//         sort: sortFromUrl || 'desc',
//         category: categoryFromUrl || '',
//       }));
//     }

//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//         const res = await fetch(`${baseUrl}/api/post/get`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             limit: 9,
//             order: sidebarData.sort,
//             category: sidebarData.category,
//             searchTerm: sidebarData.searchTerm,    
//             startIndex: 0, // Start from the beginning for the initial fetch   
//           }),
//         });

//         if (!res.ok) {
//           throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
//         }

//         const data = await res.json();
//         console.log('API Response:', data); // Debugging log
//         setPosts(data.posts || []);
//         setShowMore(data.posts?.length === 9);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts(); // Call the fetchPosts function inside useEffect
//   }, [searchParams]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setSidebarData((prev) => ({
//       ...prev,
//       [id]: value || '',
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const urlParams = new URLSearchParams(searchParams);
//     urlParams.set('searchTerm', sidebarData.searchTerm || '');
//     urlParams.set('sort', sidebarData.sort || 'desc');
//     urlParams.set('category', sidebarData.category || '');
//     router.push(`/search?${urlParams.toString()}`);
//   };

//   const handleShowMore = async () => {
//     const numberOfPosts = posts.length;
//     const startIndex = numberOfPosts;

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//     const res = await fetch(`${baseUrl}/api/post/get`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         limit: 9,
//         order: sidebarData.sort,
//         category: sidebarData.category,
//         searchTerm: sidebarData.searchTerm,
//         startIndex,
//       }),
//     });

//     if (!res.ok) {
//       console.error('Failed to fetch more posts:', res.status, res.statusText);
//       return;
//     }

//     const data = await res.json();
//     console.log('Show More API Response:', data); // Debugging log
//     setPosts((prev) => [...prev, ...(data.posts || [])]);
//     setShowMore(data.posts?.length === 9);
//   };

//   return (
//     <div className="flex flex-col md:flex-row">
//       <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
//         <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
//           <div className="flex items-center gap-2">
//             <label className="whitespace-nowrap font-semibold">Search Term:</label>
//             <TextInput
//               placeholder="Search..."
//               id="searchTerm"
//               type="text"
//               value={sidebarData.searchTerm || ''}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="font-semibold">Sort:</label>
//             <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
//               <option value="desc">Latest</option>
//               <option value="asc">Oldest</option>
//             </Select>
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="font-semibold">Category:</label>
//             <Select onChange={handleChange} id="category" value={sidebarData.category}>
//               <option value="">All Categories</option>
//               <option value="reactjs">React.js</option>
//               <option value="nextjs">Next.js</option>
//               <option value="javascript">JavaScript</option>
//             </Select>
//           </div>
//           <Button type="submit" outline gradientDuoTone="purpleToPink">
//             Apply Filters
//           </Button>
//         </form>
//       </div>
//       <div className="w-full">
//         <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
//           Posts results:
//         </h1>
//         <div className="p-7 flex flex-wrap gap-4">
//           {!loading && posts.length === 0 && (
//             <p className="text-xl text-gray-500">No posts found.</p>
//           )}
//           {loading && <p className="text-xl text-gray-500">Loading...</p>}
//           {!loading &&
//             posts &&
//             posts.map((post) => <PostCard key={post._id} post={post} />)}
//           {showMore && (
//             <button
//               onClick={handleShowMore}
//               className="text-teal-500 text-lg hover:underline p-7 w-full"
//             >
//               Show More
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






'use client';

import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '../components/PostCard';
export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]); // Ensure posts is initialized as an array
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
       const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
       const res = await fetch(`${baseUrl}/api/post/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 9,
          order: sortFromUrl || 'desc',
          category: categoryFromUrl || 'uncategorized',
          searchTerm: searchTermFromUrl,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPosts(data?.data?.posts || []); // Ensure posts is always an array     
      setLoading(false);
      setShowMore(data?.data?.posts?.length === 9);
    };

    fetchPosts();
  }, [searchParams]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: value || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', sidebarData.searchTerm || '');
    urlParams.set('sort', sidebarData.sort || 'desc');
    urlParams.set('category', sidebarData.category || 'uncategorized');
    router.push(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
       const res = await fetch(`${baseUrl}/api/post/get`, {
        method: 'POST',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 9,
        order: sidebarData.sort,
        category: sidebarData.category,
        searchTerm: sidebarData.searchTerm,
        startIndex,
      }),
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    setPosts((prev) => [...prev, ...(data?.data?.posts || [])]);
    setShowMore(data?.data?.posts?.length === 9);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm || ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} id="category">
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&            
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}