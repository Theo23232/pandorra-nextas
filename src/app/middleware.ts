import compression from 'compression';
import { NextRequest, NextResponse } from 'next/server';

// Active la compression
const compress = compression()

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  compress(req as any, res as any, () => {}) // Conversion en type compatible
  return res
}
