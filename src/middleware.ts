import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard') || 
                        req.nextUrl.pathname.startsWith('/transactions') ||
                        req.nextUrl.pathname.startsWith('/budgets') ||
                        req.nextUrl.pathname.startsWith('/goals') ||
                        req.nextUrl.pathname.startsWith('/analytics') ||
                        req.nextUrl.pathname.startsWith('/settings')
  
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|seed|$).*)"],
}
