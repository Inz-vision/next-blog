// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
// import { clerkClient } from '@clerk/nextjs/server';

// export async function POST(req) {
//   const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

//   if (!WEBHOOK_SECRET) {
//     throw new Error(
//       'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
//     );
//   }

//   // Get the headers
//   const headerPayload = await headers();
//   console.log('Headers:', headerPayload);
//   const svix_id = headerPayload.get('svix-id');
//   const svix_timestamp = headerPayload.get('svix-timestamp');
//   const svix_signature = headerPayload.get('svix-signature');

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     console.error('Missing svix headers:', {
//       svix_id,
//       svix_timestamp,
//       svix_signature,
//     });
//     return new Response('Error occurred -- no svix headers', {
//       status: 400,
//     });
//   }

//   // Get the body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt;

//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     });
//     console.log('Webhook verified successfully');
//   } catch (err) {
//     console.error('Error verifying webhook:', err);
//     return new Response('Error occurred', {
//       status: 400,
//     });
//   }

//   const { id } = evt?.data;
//   const eventType = evt?.type;
//   console.log(`Webhook with ID ${id} and type ${eventType}`);
//   console.log('Webhook body:', body);

//   if (eventType === 'user.created' || eventType === 'user.updated') {
//     const { id, first_name, last_name, image_url, email_addresses, username } =
//       evt?.data;

//     try {
//       console.log('Creating or updating user in database...');
//       const user = await createOrUpdateUser(
//         id,
//         first_name,
//         last_name,
//         image_url,
//         email_addresses,
//         username
//       );
//       console.log('User created/updated in database:', user);

//       console.log('Updating Clerk public metadata...');
//       await clerkClient.users.updateUserMetadata(id, {
//         publicMetadata: {
//           userMongoId: user._id,
//           isAdmin: user.isAdmin,
//         },
//       });
//       console.log('updateUserMetadata executed successfully:', {
//         userMongoId: user._id,
//         isAdmin: user.isAdmin,
//       });
//     } catch (error) {
//       console.error('Error creating or updating user:', error);
//       return new Response('Error occurred', {
//         status: 400,
//       });
//     }
//   }

//   if (eventType === 'user.deleted') {
//     const { id } = evt?.data;
//     try {
//       console.log('Deleting user from database...');
//       await deleteUser(id);
//       console.log('User deleted successfully');
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       return new Response('Error occurred', {
//         status: 400,
//       });
//     }
//   }

//   return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
// }


import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error(
    'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
  );
}

// Validate the GET request
export async function GET(req) {
  try {
    const headerPayload = headers();
    console.log('GET Request Headers:', headerPayload);

    // Example validation: Check for a specific header
    const customHeader = headerPayload.get('x-custom-header');
    if (!customHeader || customHeader !== 'expected-value') {
      console.error('Invalid or missing custom header');
      return new Response('Invalid request', { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'GET request validated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error validating GET request:', error);
    return new Response('Error occurred', { status: 500 });
  }
}

// Handle the POST request
export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  console.log('Headers:', headerPayload);
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers:', {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
    console.log('Webhook verified successfully');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;
  console.log(`Webhook with ID ${id} and type ${eventType}`);
  console.log('Webhook body:', body);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, image_url, email_addresses, username } =
      evt?.data;

    try {
      console.log('Creating or updating user in database...');
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );
      console.log('User created/updated in database:', user);

      console.log('Updating Clerk public metadata...');
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userMongoId: user._id,
          isAdmin: user.isAdmin,
        },
      });
      console.log('updateUserMetadata executed successfully:', {
        userMongoId: user._id,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error('Error creating or updating user:', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt?.data;
    try {
      console.log('Deleting user from database...');
      await deleteUser(id);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }
  }

  return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
}