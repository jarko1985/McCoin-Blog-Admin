export { auth as middleware } from "./auth"

// Ensure middleware runs on all pages (exclude static assets and APIs)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}