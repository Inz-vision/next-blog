import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = ['/dashboard(.*)', '/admin(.*)']; // Define protected routes
const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    console.log('Authenticated userId:', userId);

    // Redirect unauthenticated users to the sign-in page
    if (!userId && isProtectedRoute(req)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url); // Add redirect URL
      return NextResponse.redirect(signInUrl); // Redirect to the sign-in page
    }

    return NextResponse.next(); // Allow the request to proceed
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.redirect('/sign-in'); // Redirect to sign-in on error
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};