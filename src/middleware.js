import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log('Authenticated userId:', userId);

    // Log request details for debugging
    console.log('Request URL:', req.url);
    console.log('Request Headers:', Object.fromEntries(req.headers.entries())); // Log headers as an object

  // Redirect unauthenticated users to the sign-in page
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url); // Construct the sign-in URL
    return NextResponse.redirect(signInUrl); // Redirect to the sign-in page
  }

  return NextResponse.next(); // Allow the request to proceed
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};