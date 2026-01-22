import { NextResponse } from 'next/server';

// Middleware deshabilitado - la protección de rutas se hace desde el cliente
// porque usamos Zustand con localStorage que no es accesible desde el servidor

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
