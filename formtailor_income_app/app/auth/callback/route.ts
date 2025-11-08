import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Supabase helper handles session via cookies automatically on redirect.
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
