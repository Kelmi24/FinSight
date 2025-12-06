import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // Protect dashboard routes
  const isOnDashboard = pathname.startsWith('/dashboard') || 
                        pathname.startsWith('/transactions') ||
                        pathname.startsWith('/budgets') ||
                        pathname.startsWith('/goals') ||
                        pathname.startsWith('/settings')
  
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register'
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }
})

export const config = {
  // Update matcher to INCLUDE login/register so we can redirect away from them
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|seed|$).*)"],
}
