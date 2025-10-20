"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, CheckCircle, X, List, Grid3X3, Search, AlertCircle, Info, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EmployeePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("schedule-hours")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)) // January 2025
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  // In-app notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    show: boolean
  }>>([])
  
  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  // Sample data
  const shifts = [
    {
      id: "1",
      date: "2025-01-15",
      startTime: "06:00",
      endTime: "14:00",
      role: "Early Shift",
      location: "Main Plant",
      status: "confirmed",
    },
    {
      id: "2",
      date: "2025-01-17",
      startTime: "14:00",
      endTime: "22:00",
      role: "Late Shift",
      location: "Main Plant",
      status: "scheduled",
    },
    {
      id: "3",
      date: "2025-01-19",
      startTime: "22:00",
      endTime: "06:00",
      role: "Night Shift",
      location: "Main Plant",
      status: "confirmed",
    },
  ]

  const availableShifts = [
    {
      id: "1",
      date: "2025-01-21",
      shiftType: "Early Shift",
      qualification: "Q1",
      status: "available",
    },
    {
      id: "2",
      date: "2025-01-23",
      shiftType: "Late Shift",
      qualification: "Q2",
      status: "available",
    },
  ]

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

  const takeShift = (shiftId: string) => {
    const shift = availableShifts.find(s => s.id === shiftId)
    if (shift) {
      showNotification('success', 'Shift Booked Successfully!', 
        `You've been assigned to ${shift.shiftType} on ${new Date(shift.date).toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long"
        })}. You will receive a confirmation email shortly.`)
    }
  }

  // Calendar helper functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Adjust for Monday start
  }

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return shifts.filter(shift => shift.date === dateStr)
  }

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Prevent scroll when switching to calendar view
  useEffect(() => {
    if (viewMode === "calendar") {
      // Prevent any scroll behavior
      window.scrollTo(0, window.scrollY)
    }
  }, [viewMode])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" style={{scrollBehavior: 'auto'}}>
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
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-gray-900">My Schedule & Times</h1>
                <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                  Employee Portal
                </div>
              </div>
              <p className="text-gray-600 text-lg">Welcome to your personal employee dashboard. Current status: January 2025</p>
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
          {/* Professional Tabs Navigation */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
            <div className="flex border-b border-white/30 overflow-x-auto">
              <button 
                onClick={() => setActiveTab("schedule-hours")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                  activeTab === "schedule-hours" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                <span className="hidden sm:inline">Schedule & Hours</span>
                <span className="sm:hidden">Schedule</span>
              </button>
              <button 
                onClick={() => setActiveTab("vacation-planning")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                  activeTab === "vacation-planning" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                <span className="hidden sm:inline">Vacation Planning</span>
                <span className="sm:hidden">Vacation</span>
              </button>
              <button 
                onClick={() => setActiveTab("shift-history")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                  activeTab === "shift-history" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                <span className="hidden sm:inline">Shift History</span>
                <span className="sm:hidden">History</span>
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === "profile" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                <span className="hidden sm:inline">My Profile</span>
                <span className="sm:hidden">Profile</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "schedule-hours" && (
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
              <div className="card-padding">
                {/* Current Working Hours Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Working Hours</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-effect rounded-xl border-l-4 border-l-blue-500 shadow-modern">
                      <div className="p-6">
                        <div className="text-blue-600 text-sm font-bold mb-3">Annual Shift Goal</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">187 / 219</div>
                        <div className="text-sm text-gray-600">32 shifts remaining</div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-l-4 border-l-emerald-500 shadow-modern">
                      <div className="p-6">
                        <div className="text-emerald-600 text-sm font-bold mb-3">Hours Worked (This Month)</div>
                        <div className="text-4xl font-bold text-emerald-600 mb-2">128.0 hrs</div>
                        <div className="text-sm text-gray-600">Maximum: 160 hours per month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Next Assignment Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Next Assignment</h2>
                  <div className="glass-effect rounded-xl shadow-modern bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <div className="p-6">
                      <div className="font-bold text-gray-900 mb-3 text-lg">Saturday, January 4, 2025</div>
                      <div className="text-gray-600 mb-2 text-lg">Late Shift: 2:00 PM to 10:00 PM</div>
                      <div className="text-sm text-gray-500 mb-6">Location: Main Plant | Qualification: Q2</div>
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="btn-modern bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                          onClick={() => setShowConfirmModal(true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Systematic
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="btn-modern border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 shadow-lg"
                          onClick={() => setShowRejectModal(true)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Schedule Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
                    <div className="flex gap-2">
                      <div className="flex border border-white/30 rounded-xl shadow-lg bg-white/50 backdrop-blur-sm">
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-r-none border-white/30 hover:border-white/50 transition-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "calendar" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("calendar")}
                          className="rounded-l-none border-white/30 hover:border-white/50 transition-none"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Content Container with stable positioning */}
                  <div className="relative">
                  
                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="space-y-3">
                      {shifts.map((shift) => (
                        <div key={shift.id} className="glass-effect rounded-xl p-7 border-l-4 border-l-blue-500 shadow-modern">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                {new Date(shift.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long"
                                })}
                              </div>
                              <div className="text-blue-600 text-sm mb-2">{shift.role}</div>
                              <div className="text-xs text-gray-500">
                                {shift.startTime} - {shift.endTime} | {shift.location}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-blue-600 mb-2">
                                {shift.status === "confirmed" ? "Confirmed" : "Scheduled"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Calendar View */}
                  {viewMode === "calendar" && (
                    <div className="glass-effect rounded-xl shadow-modern">

                      {/* Calendar Grid - Compact Version */}
                      <div className="grid grid-cols-7 gap-0.5">
                        {/* Days of week */}
                        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                          <div key={day} className={`text-center text-xs font-medium py-1 ${
                            day === "Sa" || day === "So" ? "text-red-600" : "text-gray-600"
                          }`}>
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells for days before the 1st of the month */}
                        {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                          <div key={`empty-start-${i}`} className="min-h-[50px] bg-gray-50 border border-gray-200 rounded-sm p-1"></div>
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
                          const dayOfMonth = date.getDate()
                          const dayShifts = getShiftsForDate(date)
                          
                          return (
                            <div 
                              key={i} 
                              className="min-h-[50px] border border-gray-200 rounded-sm p-1 bg-white hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedDate(date)}
                            >
                              <div className="text-xs font-medium mb-0.5 text-gray-900">
                                {dayOfMonth}
                              </div>
                              <div className="space-y-0.5">
                                {dayShifts.map((shift) => {
                                  const getShiftStyle = (status: string) => {
                                    switch (status) {
                                      case 'confirmed':
                                        return 'bg-blue-100 border border-blue-500 text-blue-800'
                                      case 'scheduled':
                                        return 'bg-yellow-100 border border-yellow-500 text-yellow-800'
                                      default:
                                        return 'bg-gray-100 border border-gray-500 text-gray-800'
                                    }
                                  }
                                  
                                  return (
                                    <div
                                      key={shift.id}
                                      className={`text-xs p-0.5 rounded text-center ${getShiftStyle(shift.status)}`}
                                      title={`${shift.role} - ${shift.startTime} to ${shift.endTime}`}
                                    >
                                      <div className="font-medium truncate text-xs">
                                        {shift.role}
                                      </div>
                                      <div className="text-xs opacity-75">
                                        {shift.startTime}-{shift.endTime}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}

                        {/* Empty cells for days after the end of the month to fill the last row */}
                        {Array.from({ length: 7 - ((getFirstDayOfMonth(currentMonth) + getDaysInMonth(currentMonth)) % 7 || 7) }).map((_, i) => (
                          <div key={`empty-end-${i}`} className="min-h-[50px] bg-gray-50 border border-gray-200 rounded-sm p-1"></div>
                        ))}
                      </div>
                      
                      {/* Month Navigation - Centered */}
                      <div className="flex items-center justify-center gap-4 py-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigateMonth('prev')}
                          className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <span className="font-medium text-lg px-4 py-2">{getMonthName(currentMonth)}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigateMonth('next')}
                          className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 shadow-lg"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  </div>
                </div>

                {/* Available Shifts Preview Section */}
                <div className="mb-8">
                  <div className="border-t-2 border-gray-300 my-8"></div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Available Shifts</h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search shifts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="modern-input pl-10 w-full sm:w-64"
                        />
                      </div>
                      <Link href="/employee/available-shifts">
                        <Button variant="outline" size="sm" className="btn-modern border-white/30 hover:bg-white/20 shadow-lg">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {availableShifts.map((shift) => (
                      <div key={shift.id} className="glass-effect rounded-xl p-6 border-l-4 border-l-blue-500 shadow-modern hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {new Date(shift.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long"
                              })}
                            </div>
                            <div className="text-blue-600 text-sm mb-2">{shift.shiftType}</div>
                            <div className="text-xs text-gray-500">
                              Required: <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">{shift.qualification}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-600 mb-2">Available</div>
                            <Button 
                              size="sm" 
                              className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs border-0 shadow-lg"
                              onClick={() => takeShift(shift.id)}
                            >
                              Take Shift
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vacation Planning Tab Content */}
          {activeTab === "vacation-planning" && (
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
              <div className="p-6">
                {/* Vacation Overview */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Vacation Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="glass-effect rounded-xl border-l-4 border-l-blue-500 shadow-modern">
                      <div className="p-6">
                        <div className="text-blue-600 text-sm font-bold mb-3">Available Vacation Days (Year)</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">14 / 30</div>
                        <div className="text-sm text-gray-600">Remaining Days: 16</div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-l-4 border-l-gray-500 shadow-modern">
                      <div className="p-6">
                        <div className="text-gray-600 text-sm font-bold mb-3">Requested Days (Awaiting Approval)</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">6 Days</div>
                        <div className="text-sm text-gray-600">Review by HR / Shift Manager</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      className="btn-modern border-blue-300 text-blue-600 hover:bg-blue-50 shadow-lg"
                      onClick={() => {
                        showNotification('info', 'Shift Swap Request', 
                          'Shift swap request form would open here. This feature allows you to request swapping shifts with another qualified employee.')
                      }}
                    >
                      Request Shift Swap
                    </Button>
                    <Button 
                      className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                      onClick={() => {
                        showNotification('info', 'Vacation Request', 
                          'Vacation request form would open here. You can select dates and specify the reason for your time off request.')
                      }}
                    >
                      Request Vacation
                    </Button>
                  </div>
                </div>

                {/* Your Requests */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Requests (Current Month)</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-01-14 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-01-15 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-01-16 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-01-08 - (1)</div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shift History Tab Content */}
          {activeTab === "shift-history" && (
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
              <div className="card-padding">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Shift History</h2>
                    <p className="text-gray-600 text-lg">Completed Shifts (Current Month)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-200 rounded-xl shadow-sm">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="status-success px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      5 Completed
                    </div>
                  </div>
                </div>
                
                <div className="glass-effect rounded-2xl border-white/20 overflow-hidden shadow-modern">
                  <div className="glass-effect bg-white/50 px-6 py-4 border-b border-white/30">
                    <div className="grid grid-cols-4 gap-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                      <div>Date</div>
                      <div>Shift</div>
                      <div>Duration (Hrs)</div>
                      <div>Status</div>
                    </div>
                  </div>
                  <div className="bg-white/30">
                    <div className="glass-effect rounded-xl border-white/30 p-6 m-4 shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="font-bold text-gray-900">12/28</div>
                        <div className="text-sm font-medium text-gray-700">Early Shift (Q1)</div>
                        <div className="text-sm font-medium text-gray-700">8.0</div>
                        <div>
                          <span className="status-success px-3 py-1 text-sm font-semibold rounded-full shadow-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-white/30 p-6 m-4 shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="font-bold text-gray-900">12/30</div>
                        <div className="text-sm font-medium text-gray-700">Late Shift (Q2)</div>
                        <div className="text-sm font-medium text-gray-700">8.0</div>
                        <div>
                          <span className="status-success px-3 py-1 text-sm font-semibold rounded-full shadow-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-white/30 p-6 m-4 shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="font-bold text-gray-900">01/01</div>
                        <div className="text-sm font-medium text-gray-700">Early Shift (Q1)</div>
                        <div className="text-sm font-medium text-gray-700">8.0</div>
                        <div>
                          <span className="status-success px-3 py-1 text-sm font-semibold rounded-full shadow-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-white/30 p-6 m-4 shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="font-bold text-gray-900">01/03</div>
                        <div className="text-sm font-medium text-gray-700">Late Shift (Q2)</div>
                        <div className="text-sm font-medium text-gray-700">8.0</div>
                        <div>
                          <span className="status-success px-3 py-1 text-sm font-semibold rounded-full shadow-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl border-white/30 p-6 m-4 shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="font-bold text-gray-900">01/05</div>
                        <div className="text-sm font-medium text-gray-700">Night Shift (Q3)</div>
                        <div className="text-sm font-medium text-gray-700">8.0</div>
                        <div>
                          <span className="status-success px-3 py-1 text-sm font-semibold rounded-full shadow-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
              <div className="card-padding">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
                    <p className="text-gray-600 text-lg">Personal and work information</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-200 rounded-xl shadow-sm">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      Employee Portal
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-200 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name</label>
                        <input value="Alex Anderson" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Employee ID</label>
                        <input value="7345" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
                        <input value="alex.anderson@company.com" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Phone</label>
                        <input value="+1 (555) 123-4567" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-200 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Work Information</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Department</label>
                        <input value="Production" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Position</label>
                        <input value="Shift Operator" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Group</label>
                        <input value="Group A" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Hire Date</label>
                        <input value="March 15, 2022" disabled className="modern-input w-full h-12 px-4 py-3 text-base border-white/30 bg-white/50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mt-8">
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-purple-200 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Qualifications & Certifications</h3>
                    </div>
                    <div className="space-y-4">
                      {/* Q1 - Basic */}
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-white/80 backdrop-blur-xl shadow-modern">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="status-info px-3 py-1 text-sm font-bold rounded-full shadow-sm">Q1</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm border border-blue-300">Basic</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">Basic Operations</h4>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600 text-right">Fundamental equipment operation and safety procedures</p>
                          </div>
                        </div>
                      </div>

                      {/* Q2 - Intermediate */}
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-white/80 backdrop-blur-xl shadow-modern">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="status-success px-3 py-1 text-sm font-bold rounded-full shadow-sm">Q2</span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm border border-green-300">Intermediate</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">Advanced Operations</h4>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600 text-right">Complex equipment operation and troubleshooting</p>
                          </div>
                        </div>
                      </div>

                      {/* Q3 - Advanced */}
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-white/80 backdrop-blur-xl shadow-modern">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-bold rounded-full shadow-sm border border-purple-300">Q3</span>
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm border border-purple-300">Advanced</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">Expert Operations</h4>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600 text-right">Master-level operations and training capabilities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-14 px-8"
                    style={{borderRadius: '9999px'}}
                    onClick={() => alert("Profile editing feature coming soon!")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
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
                  <div className="ml-4 w-0 flex-1 pt-1">
                    <p className="text-base font-bold text-gray-900">{notification.title}</p>
                    <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
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

      {/* Modern Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modern-lg w-full max-w-md border border-gray-200">
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Shift Assignment</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to confirm this shift assignment for Saturday, January 4, 2025?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 btn-modern bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                  onClick={() => {
                    setShowConfirmModal(false)
                    showNotification('success', 'Shift Confirmed!', 'You will receive a confirmation email shortly.')
                  }}
                >
                  Confirm Assignment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 btn-modern border-white/30 hover:bg-white/20 shadow-lg"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modern-lg w-full max-w-md border border-gray-200">
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reject Shift Assignment</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to reject this shift assignment? This action cannot be undone and your manager will be notified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 btn-modern bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                  onClick={() => {
                    setShowRejectModal(false)
                    showNotification('error', 'Shift Rejected', 'Your manager will be notified and may assign this shift to another employee.')
                  }}
                >
                  Reject Assignment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 btn-modern border-white/30 hover:bg-white/20 shadow-lg"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}