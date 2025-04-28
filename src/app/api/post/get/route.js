import mongoose from 'mongoose';
import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';

export const POST = async (req) => {
  try {
    console.log('Request Headers:', req.headers); // Log headers for debugging
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connect();   
    // Parse request body
    const data = await req.json();

    // Validate and sanitize input
    const startIndex = Number.isInteger(data.startIndex) && data.startIndex >= 0 ? data.startIndex : 0;
    const limit = Number.isInteger(data.limit) && data.limit > 0 ? data.limit : 9;
    const sortDirection = data.order === 'asc' ? 1 : data.order === 'desc' ? -1 : -1;

    // Build query filters    
    const filters = {
      ...(data.userId && { userId: data.userId }),
      ...(data.category && data.category !== 'uncategorized' && data.category.trim() && { category: data.category.trim() }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && mongoose.Types.ObjectId.isValid(data.postId) && { _id: new mongoose.Types.ObjectId(data.postId) }),
      ...(data.searchTerm && data.searchTerm.trim() && {
        $or: [
          { title: { $regex: data.searchTerm.trim(), $options: 'i' } },
          { content: { $regex: data.searchTerm.trim(), $options: 'i' } },
        ],
      }),
    };

    // Fetch posts
    const posts = await Post.find(filters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count total posts
    const totalPosts = await Post.countDocuments(filters);

    // Count posts from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    let lastMonthPosts = 0;
    if (data.includeLastMonthPosts) {
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
    }

    // Handle empty results
    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: { posts: [], totalPosts: 0, lastMonthPosts: 0 } }),
        { status: 200 }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, data: { posts, totalPosts, lastMonthPosts } }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting posts:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch posts',
      }),
      { status: 500 }
    );
  }
};