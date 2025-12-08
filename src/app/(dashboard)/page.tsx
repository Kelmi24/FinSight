import { redirect } from "next/navigation"

/**
 * Root dashboard route - redirects to main dashboard
 * Removes unnecessary extra click for users
 */
export default function Home() {
  redirect("/dashboard")
}
