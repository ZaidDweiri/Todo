import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import Dashboard from "@/components/dashboard"

export default async function Home() {
  // Get the user's authentication status
  const { userId } = await auth()

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirect("/sign-in")
  }

  return <Dashboard />
}

