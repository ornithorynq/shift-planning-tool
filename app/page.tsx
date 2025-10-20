"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Eye, EyeOff, User, Settings, BarChart3 } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Professional animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-6000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Professional Login Card */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          {/* Header */}
          <div className="text-center">
            {/* Professional Icon */}
            <div className="mx-auto flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl mb-6 shadow-modern hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Users className="h-10 w-10 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
                <Label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee ID / Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AA7345"
                  className="modern-input"
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="modern-input pr-10"
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
              
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Professional Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-modern gradient-primary text-white font-semibold py-4 px-6 flex items-center justify-center text-lg"
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

        {/* Professional Demo Role Toggle */}
        <div className="glass-effect border-white/30 p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Demo Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              className="btn-modern bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 font-semibold py-4 px-4 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "employee")
                localStorage.setItem("username", "AA7345")
                router.push("/employee")
              }}
            >
              <User className="w-5 h-5 mr-2" />
              Employee
            </Button>
            <Button
              className="btn-modern bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 font-semibold py-4 px-4 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "shift-manager")
                localStorage.setItem("username", "SM001")
                router.push("/shift-manager")
              }}
            >
              <Settings className="w-5 h-5 mr-2" />
              Manager
            </Button>
            <Button
              className="btn-modern bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 font-semibold py-4 px-4 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm"
              onClick={() => {
                localStorage.setItem("isAuthenticated", "true")
                localStorage.setItem("userRole", "hr")
                localStorage.setItem("username", "HR001")
                router.push("/hr")
              }}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              HR
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}