import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySetCookie } from './lib/server-utils';
import { checkIfPathStartsWith } from './lib/utils';

// list of paths that require the user to be signed in
const signedInPaths = [
  '/account',
  '/checkout',
  '/logout',
  '/verify-email',
  '/admin',
  '/cart',
];
// list of paths that require the user to be signed out
const signedOutPaths = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  // get the access and refresh tokens from the cookies
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  // if the user is signed in and tries to access a signed out path, redirect to home page
  if (signedOutPaths.includes(request.nextUrl.pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  // if the user is signed in give them access to the page
  if (accessToken && refreshToken && accessToken.value !== '') {
    // if the user is signed but not verified and tries to access a page that requires verification, redirect to the verification page
    if (
      request.nextUrl.pathname !== '/verify-email' &&
      request.nextUrl.pathname !== '/logout' &&
      checkIfPathStartsWith(request.nextUrl.pathname, signedInPaths)
    ) {
      const response = await fetch(
        `${process.env.NX_API_URL}/auth/current-user`,
        {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
        }
      );
      if (!response.ok) {
        const response = NextResponse.next();
        response.cookies.set('refreshToken', '', {
          expires: new Date(),
          path: '/',
          domain: process.env.NX_DOMAIN,
          sameSite: 'strict',
        });
        response.cookies.set('accessToken', '', {
          expires: new Date(),
          path: '/',
          domain: process.env.NX_DOMAIN,
          sameSite: 'strict',
        });
        return response;
      }
      const { user } = await response.json();
      if (user.verificated === false) {
        return NextResponse.redirect(new URL('/verify-email', request.nextUrl));
      }
      // if the user is not an admin and tries to access the admin page, redirect to home page
      if (request.nextUrl.pathname.startsWith('/admin') && !user.isAdmin) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
      }
    }

    return NextResponse.next();
  } else if (!accessToken && refreshToken) {
    // if the user is signed in but the access token has expired, refresh the token
    try {
      const response = await fetch(
        `${process.env.NX_API_URL}/auth/refresh-token`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
        }
      );
      const cookies = response.headers.get('set-cookie');
      // if the tokens were refreshed, give the user access to the page
      if (cookies && response.ok) {
        const responseNext = NextResponse.next();
        responseNext.headers.set('set-cookie', cookies);
        applySetCookie(request, responseNext);
        return responseNext;
      } else {
        // if the tokens were not refreshed, redirect the user to the login page and clear the refresh token
        const response = NextResponse.next();
        response.cookies.set('refreshToken', '', {
          expires: new Date(),
          path: '/',
          domain: process.env.NX_DOMAIN,
          sameSite: 'strict',
        });
        return response;
      }
    } catch (error) {
      console.log('error', error);
    }
  } else {
    // if the user is not signed in, redirect them to the login page
    if (signedInPaths.includes(request.nextUrl.pathname))
      return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
