import { NextResponse, type NextRequest } from 'next/server';

// NOTE: Auth guard is handled client-side via Supabase client + React state.
// The server-side @supabase/ssr approach caused infinite redirect loops in
// Next.js 16 because the client-set auth cookie isn't accessible to the
// server proxy before hydration. Client pages guard themselves via the store.

export async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run proxy on routes that need it (keeps it fast)
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
