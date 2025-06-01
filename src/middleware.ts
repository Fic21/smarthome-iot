import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  // Cek apakah user sudah login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Lanjutkan ke halaman yang diminta
  return NextResponse.next();
}

export const config = {
  matcher: ['/dasboard/:path*'], // sesuaikan dengan folder kamu (bukan /dashboard)
};
