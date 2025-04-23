const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/post/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 9,
          order: sortFromUrl,
          category: categoryFromUrl,
          searchTerm: searchTermFromUrl,
        }),
      });
  
      if (!res.ok) {
        console.error('Failed to fetch posts:', res.statusText);
        setLoading(false);
        return;
      }
  
      const data = await res.json();
      console.log('Fetched posts:', data); // Log the response for debugging
      setPosts(data.posts || []); // Ensure posts is always an array
      setShowMore(data.posts?.length === 9);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Reset posts to an empty array on error
    } finally {
      setLoading(false);
    }
  };