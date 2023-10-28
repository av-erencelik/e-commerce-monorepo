import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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
const signedOutPaths = ['/login', '/signup', '/login/forgot-password'];

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
      console.log('response', JSON.stringify(await response.json()));
      const cookies = response.headers.get('set-cookie');
      if (response.ok && cookies) {
        const splittedCookies = cookies.split(', ');
        const refreshToken = splittedCookies[0] + ', ' + splittedCookies[1];
        const accessToken = splittedCookies[2] + ', ' + splittedCookies[3];
        console.log('refreshToken', refreshToken);
        console.log('accessToken', accessToken);
        console.log('cookies', cookies);
        // if the tokens were refreshed, give the user access to the page
        const responseNext = NextResponse.next();
        responseNext.headers.append('set-cookie', refreshToken);
        responseNext.headers.append('set-cookie', accessToken);
        return responseNext;
      } else {
        // if the tokens were not refreshed, redirect the user to the login page and clear the refresh token
        const response = NextResponse.redirect(
          new URL('/login', request.nextUrl)
        );
        response.cookies.set('refreshToken', '', {
          path: '/',
          maxAge: 0,
          domain: process.env.NX_DOMAIN,
        });
        response.cookies.set('cart_session', '', {
          path: '/',
          maxAge: 0,
          domain: process.env.NX_DOMAIN,
        });
        return response;
      }
    } catch (error) {
      console.log('error', error);
    }
  } else {
    // if the user is not signed in, redirect them to the login page
    if (signedInPaths.includes(request.nextUrl.pathname)) {
      console.log('redirect to login');
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/login/forgot-password',
    '/login/reset-password/:path*',
    '/verify-email',
    '/admin',
    '/cart',
    '/checkout/:path*',
    '/account',
    '/logout',
    '/contact',
    '/about',
    '/breads',
    '/chocolates',
    '/product/:path*',
    '/admin/:path*',
  ],
};
