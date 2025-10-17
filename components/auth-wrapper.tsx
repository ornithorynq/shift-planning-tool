"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userRole = localStorage.getItem("userRole")
      
      if (authStatus === "true" && userRole) {
        setIsAuthenticated(true)
        // Redirect to appropriate dashboard based on role
        if (pathname === "/") {
          switch (userRole) {
            case "employee":
              router.push("/employee")
              break
            case "shift-manager":
              router.push("/shift-manager")
              break
            case "hr":
              router.push("/hr")
              break
            default:
              router.push("/employee") // Default fallback
          }
        }
      } else {
        setIsAuthenticated(false)
        // Only redirect to main page if not already on main page
        if (pathname !== "/") {
          router.push("/")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and on main page, show main page (login)
  if (!isAuthenticated && pathname === "/") {
    return <>{children}</>
  }

  // If not authenticated and not on login page, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, show the app
  return <>{children}</>
}
