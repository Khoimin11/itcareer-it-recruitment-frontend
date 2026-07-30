import { NextResponse } from "next/server";

// The auth cookie is set by the Render backend domain, so the Vercel-hosted
// frontend cannot reliably inspect it in middleware on production.
export function middleware() {
  return NextResponse.next();
}
