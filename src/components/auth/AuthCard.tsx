import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  children: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
}

export function AuthCard({ children, title, description, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg shrink-0 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
