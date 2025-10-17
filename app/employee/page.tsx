"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, ArrowLeft, Clock, MapPin, CheckCircle, RefreshCw, Users, TrendingUp, LogOut, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Shift = {
  id: string
  date: string
  startTime: string
  endTime: string
  role: string
  location: string
  status: "scheduled" | "confirmed" | "pending"
}

type TimeOffRequest = {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
}

type ShiftSwapRequest = {
  id: string
  shiftId: string
  requestedEmployee: string
  reason: string
  status: "pending" | "approved" | "rejected"
}

type ShiftHistory = {
  id: string
  date: string
  shiftType: string
  duration: number
  qualification: string
  status: "completed"
}

type AvailableShift = {
  id: string
  date: string
  shiftType: string
  qualification: string
  status: "available"
}

export default function EmployeePage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

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

  const [shifts] = useState<Shift[]>([
    {
      id: "1",
      date: "2025-10-01",
      startTime: "09:00",
      endTime: "17:00",
      role: "Cashier",
      location: "Store A",
      status: "confirmed",
    },
    {
      id: "2",
      date: "2025-10-05",
      startTime: "14:00",
      endTime: "22:00",
      role: "Sales Associate",
      location: "Store A",
      status: "scheduled",
    },
    {
      id: "3",
      date: "2025-10-10",
      startTime: "10:00",
      endTime: "18:00",
      role: "Customer Service",
      location: "Store B",
      status: "confirmed",
    },
    {
      id: "4",
      date: "2025-10-12",
      startTime: "14:00",
      endTime: "22:00",
      role: "Sales Associate",
      location: "Store A",
      status: "scheduled",
    },
    {
      id: "5",
      date: "2025-10-28",
      startTime: "09:00",
      endTime: "17:00",
      role: "Cashier",
      location: "Store A",
      status: "confirmed",
    },
    {
      id: "6",
      date: "2025-10-20",
      startTime: "09:00",
      endTime: "17:00",
      role: "Cashier",
      location: "Store A",
      status: "confirmed",
    },
    {
      id: "7",
      date: "2025-10-22",
      startTime: "14:00",
      endTime: "22:00",
      role: "Sales Associate",
      location: "Store A",
      status: "scheduled",
    },
    {
      id: "8",
      date: "2025-10-25",
      startTime: "10:00",
      endTime: "18:00",
      role: "Customer Service",
      location: "Store B",
      status: "pending",
    },
    // November 2024 data
    {
      id: "9",
      date: "2025-11-05",
      startTime: "09:00",
      endTime: "17:00",
      role: "Cashier",
      location: "Store A",
      status: "confirmed",
    },
    {
      id: "10",
      date: "2025-11-12",
      startTime: "14:00",
      endTime: "22:00",
      role: "Sales Associate",
      location: "Store A",
      status: "scheduled",
    },
    {
      id: "11",
      date: "2025-11-20",
      startTime: "10:00",
      endTime: "18:00",
      role: "Customer Service",
      location: "Store B",
      status: "confirmed",
    },
    // December 2025 data
    {
      id: "12",
      date: "2025-12-03",
      startTime: "09:00",
      endTime: "17:00",
      role: "Cashier",
      location: "Store A",
      status: "scheduled",
    },
    {
      id: "13",
      date: "2025-12-10",
      startTime: "14:00",
      endTime: "22:00",
      role: "Sales Associate",
      location: "Store A",
      status: "confirmed",
    },
    {
      id: "14",
      date: "2025-12-18",
      startTime: "10:00",
      endTime: "18:00",
      role: "Customer Service",
      location: "Store B",
      status: "pending",
    },
  ])

  const [timeOffRequests] = useState<TimeOffRequest[]>([
    {
      id: "1",
      startDate: "2025-10-21",
      endDate: "2025-10-23",
      reason: "Family vacation",
      status: "pending",
    },
    {
      id: "2",
      startDate: "2025-10-08",
      endDate: "2025-10-08",
      reason: "Personal appointment",
      status: "rejected",
    },
    {
      id: "3",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      reason: "Family event",
      status: "approved",
    },
    {
      id: "4",
      startDate: "2025-12-24",
      endDate: "2025-12-26",
      reason: "Holiday vacation",
      status: "pending",
    },
    {
      id: "5",
      startDate: "2025-12-30",
      endDate: "2025-12-30",
      reason: "New Year preparation",
      status: "rejected",
    },
  ])

  const [shiftSwapRequests] = useState<ShiftSwapRequest[]>([
    {
      id: "1",
      shiftId: "2",
      requestedEmployee: "Mike Chen",
      reason: "Doctor appointment",
      status: "pending",
    },
  ])

  const [shiftHistory] = useState<ShiftHistory[]>([
    {
      id: "1",
      date: "2025-10-01",
      shiftType: "Late Shift (Q3)",
      duration: 8.0,
      qualification: "Q3",
      status: "completed",
    },
    {
      id: "2",
      date: "2025-10-05",
      shiftType: "Night Shift (Q2)",
      duration: 8.0,
      qualification: "Q2",
      status: "completed",
    },
    {
      id: "3",
      date: "2025-10-10",
      shiftType: "Early Shift (Q1)",
      duration: 8.0,
      qualification: "Q1",
      status: "completed",
    },
    {
      id: "4",
      date: "2025-10-12",
      shiftType: "Late Shift (Q1)",
      duration: 8.0,
      qualification: "Q1",
      status: "completed",
    },
    {
      id: "5",
      date: "2025-10-28",
      shiftType: "Early Shift (Q1)",
      duration: 8.0,
      qualification: "Q1",
      status: "completed",
    },
  ])

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
  ])

  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false)
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("schedule-hours")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025

  const upcomingShifts = shifts.filter((shift) => new Date(shift.date) > new Date())

  const totalHoursWorked = shifts.reduce((acc, shift) => {
    const start = parseInt(shift.startTime.split(":")[0])
    const end = parseInt(shift.endTime.split(":")[0])
    return acc + (end - start)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule & Times</h1>
              <p className="text-gray-600">Welcome to your personal employee dashboard. Current status: October</p>
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

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab("schedule-hours")}
                className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                  activeTab === "schedule-hours" 
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Schedule & Hours
              </button>
              <button 
                onClick={() => setActiveTab("vacation-planning")}
                className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                  activeTab === "vacation-planning" 
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Vacation Planning
              </button>
              <button 
                onClick={() => setActiveTab("shift-history")}
                className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                  activeTab === "shift-history" 
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Shift History
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === "schedule-hours" && (
              <div className="p-6">
                {/* Current Working Hours Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Working Hours</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 border-l-4 border-l-blue-500">
                      <div className="text-blue-600 text-sm font-medium mb-2">Annual Shift Goal</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">187 / 219</div>
                      <div className="text-sm text-gray-500">32 shifts remaining</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 border-l-4 border-l-green-500">
                      <div className="text-green-600 text-sm font-medium mb-2">Hours Worked (This Month)</div>
                      <div className="text-3xl font-bold text-green-600 mb-1">128.0 hrs</div>
                      <div className="text-sm text-gray-500">Maximum: 160 hours per month</div>
                    </div>
                  </div>
                </div>

                {/* Your Next Assignment Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Next Assignment</h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="font-semibold text-gray-900 mb-2">Sunday, October 12, 2025</div>
                    <div className="text-gray-600 mb-1">Late Shift: 2:00 PM to 10:00 PM</div>
                    <div className="text-sm text-gray-500">Location: Store A | Qualification: Q1</div>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">My Schedule</h2>
                    <div className="flex gap-2">
                      <div className="flex border border-gray-200 rounded-md">
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-r-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "calendar" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("calendar")}
                          className="rounded-l-none"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar View */}
                {viewMode === "calendar" && (
                  <div className="mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigateMonth('prev')}
                            className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <span className="font-medium">{getMonthName(currentMonth)}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigateMonth('next')}
                            className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-100 border border-blue-500"></div>
                          <span>Shift Assignment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 border border-green-500"></div>
                          <span>Vacation (Approved)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-100 border border-dashed border-yellow-500"></div>
                          <span>Vacation (Requested)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-100 border border-dashed border-red-500"></div>
                          <span>Vacation (Rejected)</span>
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Days of week */}
                        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                          <div key={day} className={`text-center text-sm font-medium p-2 ${
                            day === "Sa" || day === "So" ? "text-red-600" : "text-gray-600"
                          }`}>
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells for days before the 1st of the month */}
                        {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                          <div key={`empty-start-${i}`} className="min-h-[80px] bg-gray-50 border border-gray-200 rounded p-1"></div>
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
                          const dayOfMonth = date.getDate()
                          const dayShifts = shifts.filter(shift => shift.date === date.toISOString().split('T')[0])
                          const dayVacations = timeOffRequests.filter(vacation => {
                            const startDate = new Date(vacation.startDate)
                            const endDate = new Date(vacation.endDate)
                            return date >= startDate && date <= endDate
                          })
                          
                          return (
                            <div 
                              key={i} 
                              className="min-h-[80px] border border-gray-200 rounded p-1 bg-white"
                            >
                              <div className="text-sm font-medium mb-1 text-gray-900">
                                {dayOfMonth}
                              </div>
                              <div className="space-y-1">
                                {dayShifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="text-xs p-1 rounded bg-blue-100 border border-blue-500 text-blue-800"
                                  >
                                    <div className="font-medium truncate">S...</div>
                                  </div>
                                ))}
                                {dayVacations.map((vacation) => {
                                  const getVacationStyle = (status: string) => {
                                    switch (status) {
                                      case 'approved':
                                        return 'bg-green-100 border border-green-500 text-green-800'
                                      case 'pending':
                                        return 'bg-yellow-100 border border-dashed border-yellow-500 text-yellow-800'
                                      case 'rejected':
                                        return 'bg-red-100 border border-dashed border-red-500 text-red-800'
                                      default:
                                        return 'bg-gray-100 border border-gray-500 text-gray-800'
                                    }
                                  }
                                  
                                  return (
                                    <div
                                      key={vacation.id}
                                      className={`text-xs p-1 rounded ${getVacationStyle(vacation.status)}`}
                                    >
                                      <div className="font-medium truncate">?...</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}

                        {/* Empty cells for days after the end of the month to fill the last row */}
                        {Array.from({ length: 7 - ((getFirstDayOfMonth(currentMonth) + getDaysInMonth(currentMonth)) % 7 || 7) }).map((_, i) => (
                          <div key={`empty-end-${i}`} className="min-h-[80px] bg-gray-50 border border-gray-200 rounded p-1"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Shifts Preview Section */}
                {viewMode === "list" && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Available Shifts</h2>
                      <Link href="/employee/available-shifts">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  <div className="space-y-3">
                    {availableShifts.slice(0, 2).map((shift) => (
                      <div key={shift.id} className="bg-white border border-gray-200 rounded-lg p-4 border-l-4 border-l-blue-500">
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
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                              Take Shift
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vacation Planning Tab Content */}
          {activeTab === "vacation-planning" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                {/* Vacation Overview */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Vacation Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 border-l-4 border-l-blue-500">
                      <div className="text-blue-600 text-sm font-medium mb-2">Available Vacation Days (Year)</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">14 / 30</div>
                      <div className="text-sm text-gray-500">Remaining Days: 16</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 border-l-4 border-l-gray-500">
                      <div className="text-gray-600 text-sm font-medium mb-2">Requested Days (Awaiting Approval)</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">6 Days</div>
                      <div className="text-sm text-gray-500">Review by HR / Shift Manager</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Vacation</Button>
                  </div>
                </div>

                {/* Your Requests */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Requests (Current Month)</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-10-21 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-10-22 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-10-23 - (1)</div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved (Free)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-gray-900">2025-10-08 - (1)</div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shift History Tab Content */}
          {activeTab === "shift-history" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Shift History</h2>
                <p className="text-sm text-gray-600 mb-6">Completed Shifts (Current Month)</p>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                      <div>Date</div>
                      <div>Shift</div>
                      <div>Duration (Hrs)</div>
                      <div>Status</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {shiftHistory.map((shift) => (
                      <div key={shift.id} className="px-4 py-3 hover:bg-gray-50">
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="font-medium text-gray-900">
                            {new Date(shift.date).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                          <div className="text-sm text-gray-600">{shift.shiftType}</div>
                          <div className="text-sm text-gray-600">{shift.duration}</div>
                          <div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}