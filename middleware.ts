import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas protegidas (Admin Dashboard)
  const protectedPaths = ['/admin'];
  
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected) {
    // Verificar cookie de sesión
    const token = request.cookies.get('Authentication');

    if (!token) {
      // Redirigir al login público si no hay sesión
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
