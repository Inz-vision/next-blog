import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log('Authenticated userId:', userId);    

  // Redirect unauthenticated users to the sign-in page
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url); // Construct the sign-in URL
    return NextResponse.redirect(signInUrl); // Redirect to the sign-in page
  }

  return NextResponse.next(); // Allow the request to proceed
});

export const config = {
  matcher: [
    '/((?!_next|favicon.ico).*)', // Protect all routes except static files
  ],
};