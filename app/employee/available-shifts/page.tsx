"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NotificationCenter } from "@/components/notification-center"

type AvailableShift = {
  id: string
  date: string
  shiftType: string
  qualification: string
  status: "available"
}

export default function AvailableShiftsPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  const [availableShifts] = useState<AvailableShift[]>([
    {
      id: "1",
      date: "2025-01-04",
      shiftType: "Early Shift",
      qualification: "Qualification 1",
      status: "available",
    },
    {
      id: "2",
      date: "2025-01-06",
      shiftType: "Late Shift",
      qualification: "Qualification 3",
      status: "available",
    },
    {
      id: "3",
      date: "2025-01-08",
      shiftType: "Night Shift",
      qualification: "Qualification 2",
      status: "available",
    },
    {
      id: "4",
      date: "2025-01-10",
      shiftType: "Early Shift",
      qualification: "Qualification 1",
      status: "available",
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/employee">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Notification</h1>
                <p className="text-gray-600">Available shifts for qualified employees: Sign up now!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-medium">Employee AA</div>
                <div className="text-sm text-gray-500">ID: 7345 | Group: A</div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationCenter />
                <Link href="/settings">
                  <Button variant="outline" size="sm">Settings</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Current Available Shifts:</h2>
          
          {/* Loading indicator */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-center text-gray-600">Loading available shifts...</div>
          </div>
        </div>

        {/* Available Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableShifts.map((shift) => (
            <Card key={shift.id} className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Date & Shift Type</div>
                    <div className="font-semibold text-gray-900 mb-2">
                      {new Date(shift.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long"
                      })}
                    </div>
                    <div className="text-blue-600 font-medium mb-4">{shift.shiftType}</div>
                    <div className="text-sm text-gray-600">
                      Required Qualification: <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full ml-1">{shift.qualification}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 mb-4">Status: Available</div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Take Shift
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No shifts available message */}
        {availableShifts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No available shifts at the moment</div>
            <p className="text-gray-400">Check back later for new opportunities!</p>
          </div>
        )}
      </main>
    </div>
  )
}

