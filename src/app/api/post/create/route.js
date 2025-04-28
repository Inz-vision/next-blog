import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req) => {
  const user = await currentUser();
  console.log('Authenticated User:', user);
  try {
    console.log('Connecting to MongoDB...');
    await connect();
    console.log('Connected to MongoDB');

    let data;
    try {
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Missing or invalid Content-Type header');
        return new Response('Content-Type must be application/json', { status: 400 });
      }

      data = await req.json();
      console.log('Request Body:', data);
    } catch (error) {
      console.error('Invalid JSON input:', error);
      return new Response('Invalid JSON input', { status: 400 });
    }

    if (!user) {
      return new Response('Unauthorized: No user found', { status: 401 });
    }

    if (
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized: Invalid user permissions', { status: 401 });
    }

    if (!data.title || typeof data.title !== 'string') {
      return new Response('Invalid title', { status: 400 });
    }

    const slug = data.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    console.log('New Post:', newPost);
    console.log('Authenticated User:', user);

    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error creating post',
      }),
      { status: 500 }
    );
  }
};