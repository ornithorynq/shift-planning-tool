"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Users, LogOut, Bell, CheckCircle, AlertTriangle, Calendar, User, RefreshCw } from "lucide-react"
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
  const [isTakingShift, setIsTakingShift] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookedShift, setBookedShift] = useState<AvailableShift | null>(null)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  const handleTakeShift = async (shiftId: string) => {
    setIsTakingShift(shiftId)
    
    // Find the shift being booked
    const shiftToBook = availableShifts.find(shift => shift.id === shiftId)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Remove the shift from available shifts
    setAvailableShifts(prev => prev.filter(shift => shift.id !== shiftId))
    
    // Set success state
    setBookedShift(shiftToBook || null)
    setShowSuccess(true)
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setBookedShift(null)
    }, 5000)
    
    setIsTakingShift(null)
  }

  const [availableShifts, setAvailableShifts] = useState<AvailableShift[]>([
    {
      id: "1",
      date: "2025-01-15",
      shiftType: "Early Shift",
      qualification: "Q1",
      status: "available",
    },
    {
      id: "2",
      date: "2025-01-17",
      shiftType: "Late Shift",
      qualification: "Q2",
      status: "available",
    },
    {
      id: "3",
      date: "2025-01-20",
      shiftType: "Night Shift",
      qualification: "Q1",
      status: "available",
    },
    {
      id: "4",
      date: "2025-01-22",
      shiftType: "Early Shift",
      qualification: "Q3",
      status: "available",
    },
    {
      id: "5",
      date: "2025-01-25",
      shiftType: "Late Shift",
      qualification: "Q1",
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Shifts</h1>
                <p className="text-gray-600">Browse and book available shifts that match your qualifications</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-medium">Employee AA</div>
                <div className="text-sm text-gray-500">ID: 7345 | Group: A</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Notification */}
        {showSuccess && bookedShift && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-200 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-800 mb-1">
                  Shift Successfully Booked! 🎉
                </h2>
                <p className="text-green-700">
                  You've been assigned to <strong>{bookedShift.shiftType}</strong> on{' '}
                  <strong>{new Date(bookedShift.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long"
                  })}</strong>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  You'll receive a confirmation email shortly with shift details.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccess(false)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Notification Banner */}
        {availableShifts.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-200 rounded-lg">
                <Bell className="w-6 h-6 text-orange-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-orange-800 mb-1">
                  {availableShifts.length} Available Shift{availableShifts.length > 1 ? 's' : ''} Ready for You!
                </h2>
                <p className="text-orange-700">
                  These shifts match your qualifications and are available for immediate booking.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">{availableShifts.length}</div>
                <div className="text-sm text-orange-600">Open Now</div>
              </div>
            </div>
          </div>
        )}

        {/* No shifts available message */}
        {availableShifts.length === 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 mb-8">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">All Caught Up!</h2>
              <p className="text-green-700">No available shifts at the moment. Check back later for new opportunities!</p>
            </div>
          </div>
        )}

        {/* Available Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableShifts.map((shift) => (
            <Card key={shift.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-blue-600">Available Shift</div>
                    </div>
                    <div className="font-bold text-gray-900 text-lg mb-2">
                      {new Date(shift.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long"
                      })}
                    </div>
                    <div className="text-blue-700 font-semibold text-lg mb-4">{shift.shiftType}</div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Required: <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">{shift.qualification}</Badge></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Duration: 8 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Location: Main Plant</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Available Now</span>
                  </div>
                  <Button 
                    onClick={() => handleTakeShift(shift.id)}
                    disabled={isTakingShift === shift.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isTakingShift === shift.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Take Shift
                      </>
                    )}
                  </Button>
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

