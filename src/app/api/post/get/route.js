import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';

export const POST = async (req) => {
  try {
    console.log('Request Headers:', req.headers); // Log headers for debugging
    
    // Connect to MongoDB
    await connect();

    // Parse request body
    const data = await req.json();

    // Validate and sanitize input
    const startIndex = Number.isInteger(parseInt(data.startIndex)) ? parseInt(data.startIndex) : 0;
    const limit = Number.isInteger(parseInt(data.limit)) ? parseInt(data.limit) : 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;

    // Build query filters
    const filters = {
      ...(data.userId && { userId: data.userId }),
      ...(data.category && { category: data.category }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
    };

    // Fetch posts
    const posts = await Post.find(filters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count total posts
    const totalPosts = await Post.countDocuments();

    // Count posts from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Handle empty results
    if (posts.length === 0) {
      return new Response(JSON.stringify({ message: 'No posts found', posts: [] }), {
        status: 200,
      });
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, data: { posts, totalPosts, lastMonthPosts } }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting posts:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch posts' }), {
      status: 500,
    });
  }
};