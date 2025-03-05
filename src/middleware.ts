import { NextRequest, NextResponse } from 'next/server';
import compression from 'compression';

// Active la compression
const compress = compression();

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  compress(req as any, res as any, () => {}); // Conversion en type compatible
  return res;
}
