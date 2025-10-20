"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Users, LogOut, Bell, CheckCircle, AlertTriangle, Calendar, User, RefreshCw, Search, Filter, X, AlertCircle, Info } from "lucide-react"
import { useEmployee } from "@/components/employee-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AvailableShift = {
  id: string
  date: string
  shiftType: string
  qualification: string
  status: "available"
}

export default function AvailableShiftsPage() {
  const router = useRouter()
  
  // Use the employee context
  const contextData = useEmployee()


  // Use context data
  const availableShifts = contextData.availableShifts
  const takeShift = contextData.takeShift
  const [isTakingShift, setIsTakingShift] = useState<string | null>(null)
  
  // In-app notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    show: boolean
  }>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterQualification, setFilterQualification] = useState("all")
  const [filterShiftType, setFilterShiftType] = useState("all")

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  // Helper function to show notifications
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, type, title, message, show: true }])
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, show: false } : n))
      // Remove from array after animation
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 300)
    }, 5000)
  }


  const handleTakeShift = async (shiftId: string) => {
    setIsTakingShift(shiftId)
    
    // Find the shift being booked
    const shiftToBook = availableShifts.find(shift => shift.id === shiftId)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Use the context function to take the shift
    takeShift(shiftId)
    
    // Show success notification
    if (shiftToBook) {
      showNotification('success', 'Shift Booked Successfully!', 
        `You've been assigned to ${shiftToBook.shiftType} on ${new Date(shiftToBook.date).toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long"
        })}. You will receive a confirmation email shortly.`
      )
    }
    
    setIsTakingShift(null)
  }

  // Filter shifts based on search and filter criteria
  const filteredShifts = availableShifts.filter(shift => {
    const matchesSearch = shift.shiftType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.date.includes(searchTerm)
    
    const matchesQualification = filterQualification === "all" || shift.qualification === filterQualification
    const matchesShiftType = filterShiftType === "all" || shift.shiftType === filterShiftType
    
    return matchesSearch && matchesQualification && matchesShiftType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Professional animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-6000"></div>
      </div>
      
      <header className="glass-effect border-b border-white/30 shadow-modern-lg relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/employee">
                <Button variant="outline" size="sm" className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">Available Shifts</h1>
                  <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                    Employee Portal
                  </div>
                </div>
                <p className="text-gray-600 text-lg">Browse and book available shifts that match your qualifications</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-bold text-lg">Employee AA</div>
                <div className="text-sm text-gray-500">ID: 7345 | Group: A</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto section-padding">
        {/* Modern Search and Filter Controls */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Search & Filter</h2>
                <p className="text-gray-600 text-lg">Find shifts that match your preferences</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search shifts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-effect border-white/30 text-gray-700 placeholder-gray-400 pl-12 w-full sm:w-72 h-12 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <Select value={filterQualification} onValueChange={setFilterQualification}>
                    <SelectTrigger className="glass-effect border-white/30 text-gray-700 w-28 sm:w-36 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      <SelectValue placeholder="Q" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-white/30 rounded-xl shadow-modern-lg">
                      <SelectItem value="all">All Q</SelectItem>
                      <SelectItem value="Q1">Q1</SelectItem>
                      <SelectItem value="Q2">Q2</SelectItem>
                      <SelectItem value="Q3">Q3</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterShiftType} onValueChange={setFilterShiftType}>
                    <SelectTrigger className="glass-effect border-white/30 text-gray-700 w-36 sm:w-44 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-white/30 rounded-xl shadow-modern-lg">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Early Shift">Early Shift</SelectItem>
                      <SelectItem value="Late Shift">Late Shift</SelectItem>
                      <SelectItem value="Night Shift">Night Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* No shifts available message */}
        {filteredShifts.length === 0 && availableShifts.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-8 mb-8">
            <div className="text-center">
              <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Filter className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Matches Found</h2>
              <p className="text-yellow-700">Try adjusting your search or filter criteria to see more shifts.</p>
            </div>
          </div>
        )}
        
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
          {filteredShifts.map((shift) => {
            // Get shift times based on shift type
            const getShiftTimes = (shiftType: string) => {
              switch (shiftType) {
                case "Early Shift":
                  return { start: "06:00", end: "14:00" }
                case "Late Shift":
                  return { start: "14:00", end: "22:00" }
                case "Night Shift":
                  return { start: "22:00", end: "06:00" }
                default:
                  return { start: "08:00", end: "16:00" }
              }
            }
            
            const times = getShiftTimes(shift.shiftType)
            
            return (
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
                        <span>{times.start} - {times.end} ({times.start === "22:00" ? "8 hours (overnight)" : "8 hours"})</span>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
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
            )
          })}
        </div>

        {/* No shifts available message */}
        {availableShifts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No available shifts at the moment</div>
            <p className="text-gray-400">Check back later for new opportunities!</p>
          </div>
        )}
        </div>
      </main>

      {/* In-app Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`transform transition-all duration-500 ease-in-out ${
              notification.show 
                ? 'translate-x-0 opacity-100 scale-100' 
                : 'translate-x-full opacity-0 scale-95'
            }`}
          >
            <div className={`w-96 glass-effect rounded-2xl shadow-modern-lg border-white/30 pointer-events-auto overflow-hidden backdrop-blur-md ${
              notification.type === 'success' ? 'border-l-4 border-emerald-500' :
              notification.type === 'error' ? 'border-l-4 border-red-500' :
              notification.type === 'warning' ? 'border-l-4 border-amber-500' :
              'border-l-4 border-blue-500'
            }`}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' && (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                    )}
                    {notification.type === 'error' && (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                    {notification.type === 'warning' && (
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    )}
                    {notification.type === 'info' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="glass-effect rounded-full p-1 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, show: false } : n))
                        setTimeout(() => {
                          setNotifications(prev => prev.filter(n => n.id !== notification.id))
                        }, 300)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

