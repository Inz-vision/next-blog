import Post from '../../../../lib/models/post.model';
import { connect } from '../../../../lib/mongodb/mongoose';
import { currentUser } from '@clerk/nextjs/server';

export const DELETE = async (req) => {  
  try { 
  const headers = req.headers; // No need to await
  const user = await currentUser({ headers });

  if (!user) {
    return new Response('Unauthorized: No user found', { status: 401 });
  }

  
    await connect();
    const data = await req.json();

    if (
      !user.publicMetadata?.isAdmin ||
      user.publicMetadata?.userMongoId !== data.userId
    ) {
      return new Response('Unauthorized', { status: 401 });
    }
    await Post.findByIdAndDelete(data.postId);
    return new Response('Post deleted', { status: 200 });
  } catch (error) {
    console.log('Error deleting post:', error);
    return new Response('Error deleting post', { status: 500 });
  }
};