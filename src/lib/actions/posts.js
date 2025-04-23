export const fetchPosts = async (startIndex = 0, limit = 10, order = 'desc') => {
    try {
      const response = await fetch('/api/post/get', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startIndex, limit, order }),
      });
  
      // Check if the response is a redirect
      if (response.redirected) {
        throw new Error('Redirected to sign-in. Please log in.');
      }
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error; // Re-throw the error so the caller can handle it
    }
  };