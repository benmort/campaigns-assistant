import type { NextRequest, } from 'next/server'
import NextAuth from "next-auth";

import { authConfig } from '@/app/(auth)/auth.config';

const PUBLIC_FILE = /\.(.*)$/
const publicRoutes = ["/login", "/register"];
const auth = NextAuth(authConfig).auth;
 
//Function to call against all authorised routes
const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isLoggedIn && isPublicRoute) {
    // Redirect authorized users to homepage for public routes
    return Response.redirect(new URL("/", nextUrl));
  } else if (!isLoggedIn && !isPublicRoute) {
    // Redirect unauthorized users to login for non-public routes
    return Response.redirect(new URL("/login", nextUrl));
  } else {
    return;
  }
});

export async function middleware(req: NextRequest) {
  const isNextJsRoute = req.nextUrl.pathname.startsWith('/_next')
  const isApiRoute = req.nextUrl.pathname.includes('/api/')
  const isPublicFile = PUBLIC_FILE.test(req.nextUrl.pathname)

  if (isNextJsRoute || isApiRoute || isPublicFile) {
    return;
  } else {
    return (authMiddleware as any)(req); // Apply authentication logic for non-public pages
  }
}

export const config = {
  matcher: [
    '/',
    "/api/:path*",
    "/chat/:id",
    "/login",
    "/register",
    "/admin",
    "/admin/:path*",
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
