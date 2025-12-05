import { auth } from "@/auth"

// Temporarily disabled for development - uncomment to enable auth
// export default auth((req) => {
//   // req.auth
// })

export default function middleware() {
  // Auth disabled for preview
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
