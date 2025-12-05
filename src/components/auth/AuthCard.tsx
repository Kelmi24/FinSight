import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import Link from "next/link"

interface AuthCardProps {
  children: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
}

export function AuthCard({ children, title, description, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB] px-4" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span>FinSight</span>
          </Link>
        </div>
        
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-gray-500">{description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {children}
          </CardContent>
          {footer && (
            <CardFooter className="flex justify-center text-sm text-gray-500 border-t border-gray-100 pt-6">
              {footer}
            </CardFooter>
          )}
        </Card>
        
        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} FinSight &middot; <Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link> &middot; <Link href="/terms" className="hover:text-primary-600">Terms of Service</Link>
        </p>
      </div>
    </div>
  )
}
