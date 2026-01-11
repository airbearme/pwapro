
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // NOTE: 'unsafe-inline' and 'unsafe-eval' are required for libraries like Stripe and for Vercel Live previews.
  // A stricter CSP should be implemented as a long-term goal.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' data: https://fonts.googleapis.com;
    connect-src 'self' https://vercel.live https://api.stripe.com https://js.stripe.com https://fofmrqgcidfenbevayrg.supabase.co wss://fofmrqgcidfenbevayrg.supabase.co;
    frame-src 'self' https://js.stripe.com;
    object-src 'none';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    base-uri 'self';
    form-action 'self';
  `;

  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
