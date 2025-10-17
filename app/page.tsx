"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      // Set authentication status
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", "employee")
      localStorage.setItem("username", username)
      
      // Redirect to employee dashboard
      router.push("/employee")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Employee Login
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-600">
              Welcome to the Service Portal
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID / Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AA7345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Stay logged in
                </Label>
              </div>
              
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              A service for cross-location planning
            </p>
          </div>
        </div>

        {/* Demo Role Toggle */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">Demo Access</h3>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300 font-medium py-3 px-4 rounded-md transition-colors duration-200"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "employee")
                localStorage.setItem("username", "AA7345")
                router.push("/employee")
              }}
            >
              Employee View
            </Button>
            <Button
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300 font-medium py-3 px-4 rounded-md transition-colors duration-200"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "shift-manager")
                localStorage.setItem("username", "SM001")
                router.push("/shift-manager")
              }}
            >
              Manager View
            </Button>
            <Button
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300 font-medium py-3 px-4 rounded-md transition-colors duration-200"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "hr")
                localStorage.setItem("username", "HR001")
                router.push("/hr")
              }}
            >
              HR View
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}