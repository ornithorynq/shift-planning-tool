"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  FileText,
  CalendarDays
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type TimeOffRequest = {
  id: string
  employeeId: string
  employeeName: string
  employeeGroup: string | null
  type: "vacation" | "sick" | "personal"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
}

export default function VacationManagementPage() {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const goBack = () => {
    router.push("/shift-manager")
  }

  // Mock data for time-off requests with consistent employee data
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([
    // January 2025 - All dates within January 2025
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Employee AA",
      employeeGroup: "A",
      type: "vacation",
      startDate: "2025-01-15",
      endDate: "2025-01-22",
      days: 7,
      reason: "Family vacation to Spain",
      status: "approved",
      submittedDate: "2025-01-10",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-11"
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Employee AB",
      employeeGroup: "B",
      type: "sick",
      startDate: "2025-01-10",
      endDate: "2025-01-12",
      days: 3,
      reason: "Flu symptoms",
      status: "approved",
      submittedDate: "2025-01-09",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-09"
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Employee AC",
      employeeGroup: "A",
      type: "personal",
      startDate: "2025-01-25",
      endDate: "2025-01-27",
      days: 3,
      reason: "Wedding planning",
      status: "pending",
      submittedDate: "2025-01-15"
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Employee AD",
      employeeGroup: "C",
      type: "sick",
      startDate: "2025-01-20",
      endDate: "2025-01-21",
      days: 2,
      reason: "Cold symptoms",
      status: "rejected",
      submittedDate: "2025-01-19",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-19",
    },
    {
      id: "5",
      employeeId: "EMP005",
      employeeName: "Employee AE",
      employeeGroup: "B",
      type: "vacation",
      startDate: "2025-01-28",
      endDate: "2025-01-31",
      days: 4,
      reason: "Valentine's Day getaway",
      status: "approved",
      submittedDate: "2025-01-20",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-21"
    },
    {
      id: "6",
      employeeId: "EMP006",
      employeeName: "Employee AF",
      employeeGroup: "A",
      type: "personal",
      startDate: "2025-01-18",
      endDate: "2025-01-18",
      days: 1,
      reason: "Doctor appointment",
      status: "pending",
      submittedDate: "2025-01-15"
    },
    {
      id: "7",
      employeeId: "EMP007",
      employeeName: "Employee AG",
      employeeGroup: "C",
      type: "vacation",
      startDate: "2025-01-30",
      endDate: "2025-01-31",
      days: 2,
      reason: "Spring break vacation",
      status: "approved",
      submittedDate: "2025-01-25",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-26"
    },
    {
      id: "8",
      employeeId: "EMP008",
      employeeName: "Employee AH",
      employeeGroup: "B",
      type: "sick",
      startDate: "2025-01-14",
      endDate: "2025-01-16",
      days: 3,
      reason: "Allergy symptoms",
      status: "approved",
      submittedDate: "2025-01-13",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-13"
    },
    {
      id: "9",
      employeeId: "EMP009",
      employeeName: "Employee AI",
      employeeGroup: "A",
      type: "vacation",
      startDate: "2025-01-23",
      endDate: "2025-01-24",
      days: 2,
      reason: "Easter holiday",
      status: "pending",
      submittedDate: "2025-01-20"
    },
    {
      id: "10",
      employeeId: "EMP010",
      employeeName: "Employee AJ",
      employeeGroup: "C",
      type: "personal",
      startDate: "2025-01-17",
      endDate: "2025-01-17",
      days: 1,
      reason: "Moving day",
      status: "rejected",
      submittedDate: "2025-01-16",
      approvedBy: "Shift Manager",
      approvedDate: "2025-01-16"
    }
  ])

  const [activeTab, setActiveTab] = useState<"requests" | "calendar">("requests")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "week">("month")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)) // January 2025

  const handleApproveRequest = (requestId: string) => {
    setTimeOffRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "approved" as const,
              approvedBy: "Shift Manager",
              approvedDate: new Date().toISOString().split('T')[0]
            }
          : req
      )
    )
  }

  const handleRejectRequest = (requestId: string) => {
    setTimeOffRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "rejected" as const,
              approvedBy: "Shift Manager",
              approvedDate: new Date().toISOString().split('T')[0]
            }
          : req
      )
    )
  }

  const filteredRequests = timeOffRequests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const pendingRequests = timeOffRequests.filter(req => req.status === "pending")
  const approvedRequests = timeOffRequests.filter(req => req.status === "approved")
  const rejectedRequests = timeOffRequests.filter(req => req.status === "rejected")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved": return "bg-green-100 text-green-800 border-green-200"
      case "rejected": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vacation": return "bg-blue-100 text-blue-800 border-blue-200"
      case "sick": return "bg-red-100 text-red-800 border-red-200"
      case "personal": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calendar helper functions
  const getVacationEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return timeOffRequests.filter(req => 
      dateStr >= req.startDate && 
      dateStr <= req.endDate
    )
  }

  const getCalendarModifiers = () => {
    const modifiers: any = {}
    
    timeOffRequests.forEach(req => {
      if (req.status === "approved") {
        const startDate = new Date(req.startDate)
        const endDate = new Date(req.endDate)
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split('T')[0]
          if (!modifiers[dateKey]) {
            modifiers[dateKey] = []
          }
          modifiers[dateKey].push(req)
        }
      }
    })
    
    return modifiers
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
              <Button variant="outline" size="sm" onClick={goBack} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">Vacations & Sick Leaves</h1>
                  <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                    Manager Portal
                  </div>
                </div>
                <p className="text-gray-600 text-lg">Manage employee time-off requests and vacation planning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-bold text-lg">Shift Manager</div>
                <div className="text-sm text-gray-500">ID: SM001 | Level: Manager</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Header */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Time-Off Management Overview</h2>
                <p className="text-lg text-gray-600">Monitor and manage employee vacation and sick leave requests</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Pending Requests</div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Approved This Month</div>
                  <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Total Requests</div>
                  <div className="text-2xl font-bold text-blue-600">{timeOffRequests.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="flex border-b border-white/30 overflow-x-auto">
            <button 
              onClick={() => setActiveTab("requests")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                activeTab === "requests" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Requests
            </button>
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative ${
                activeTab === "calendar" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Time-Off Requests</h3>
                    <p className="text-gray-600 text-lg">Review and manage employee time-off requests</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      {filteredRequests.length} Requests
                    </div>
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <Label htmlFor="search" className="text-lg font-bold text-gray-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    Search Requests
                  </Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by employee name, ID, or reason..."
                    className="modern-input h-14 px-4 py-3 text-base border-white/30 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="filter-status" className="text-lg font-bold text-gray-700 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    Status Filter
                  </Label>
                  <Select value={filterStatus} onValueChange={(value: "all" | "pending" | "approved" | "rejected") => {
                    setFilterStatus(value)
                  }}>
                    <SelectTrigger className="modern-input h-14 px-4 py-3 text-base border-white/30 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending ({pendingRequests.length})</SelectItem>
                      <SelectItem value="approved">Approved ({approvedRequests.length})</SelectItem>
                      <SelectItem value="rejected">Rejected ({rejectedRequests.length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-xl font-bold text-gray-900">{request.employeeName}</h4>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                              {request.employeeId}
                            </div>
                            <div className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${getTypeColor(request.type)}`}>
                              {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                            </div>
                            <div className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-600 mb-4">
                          <span className="font-semibold">Reason:</span> {request.reason}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Period:</span><br />
                            {request.startDate} to {request.endDate}
                          </div>
                          <div>
                            <span className="font-semibold">Days:</span><br />
                            {request.days}
                          </div>
                          <div>
                            <span className="font-semibold">Group:</span><br />
                            {request.employeeGroup || "Unassigned"}
                          </div>
                          <div>
                            <span className="font-semibold">Submitted:</span><br />
                            {request.submittedDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {request.status === "pending" && (
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleApproveRequest(request.id)}
                              className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                              style={{borderRadius: '9999px'}}
                            >
                              <UserCheck className="w-5 h-5 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleRejectRequest(request.id)}
                              className="btn-modern border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 shadow-lg px-6 py-3"
                              style={{borderRadius: '9999px'}}
                            >
                              <UserX className="w-5 h-5 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {request.status === "approved" && (
                          <div className="flex items-center gap-3 text-green-600 bg-green-50 rounded-xl p-4">
                            <CheckCircle className="w-6 h-6" />
                            <div>
                              <div className="font-semibold">Approved</div>
                              <div className="text-sm">by {request.approvedBy}</div>
                            </div>
                          </div>
                        )}
                        
                        {request.status === "rejected" && (
                          <div className="flex items-center gap-3 text-red-600 bg-red-50 rounded-xl p-4">
                            <XCircle className="w-6 h-6" />
                            <div>
                              <div className="font-semibold">Rejected</div>
                              <div className="text-sm">by {request.approvedBy}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h4>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Vacation Calendar</h3>
                  <p className="text-gray-600 text-lg">Visual overview of all time-off requests and vacations</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-3 bg-green-200 rounded-xl shadow-sm">
                      <CalendarDays className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="status-success px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      {approvedRequests.length} Approved
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900">Calendar View</h4>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                      className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <div className="px-4 py-2 bg-white/50 rounded-xl shadow-sm">
                      <span className="font-semibold text-gray-900">{getMonthName(currentMonth)}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                      className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 border-2 border-green-500 rounded-lg shadow-sm"></div>
                    <span className="font-semibold text-gray-800">Vacation (Approved)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-yellow-100 border-2 border-dashed border-yellow-500 rounded-lg shadow-sm"></div>
                    <span className="font-semibold text-gray-800">Vacation (Requested)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-100 border-2 border-dashed border-red-500 rounded-lg shadow-sm"></div>
                    <span className="font-semibold text-gray-800">Vacation (Rejected)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-100 border-2 border-blue-500 rounded-lg shadow-sm"></div>
                    <span className="font-semibold text-gray-800">Sick Leave</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-100 border-2 border-purple-500 rounded-lg shadow-sm"></div>
                    <span className="font-semibold text-gray-800">Personal</span>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Days of week */}
                  {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                    <div key={day} className={`text-center text-sm font-bold p-3 bg-white/50 rounded-lg shadow-sm ${
                      day === "Sa" || day === "So" ? "text-red-600" : "text-gray-700"
                    }`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for days before the 1st of the month */}
                  {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                    <div key={`empty-start-${i}`} className="min-h-[100px] bg-white/30 border border-white/40 rounded-xl p-2 shadow-sm"></div>
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
                    const dayOfMonth = date.getDate()
                    const dayVacations = timeOffRequests.filter(vacation => {
                      const startDate = new Date(vacation.startDate)
                      const endDate = new Date(vacation.endDate)
                      return date >= startDate && date <= endDate
                    })
                    
                    return (
                      <div 
                        key={i} 
                        className="min-h-[100px] border border-white/40 rounded-xl p-2 bg-white/50 hover:bg-white/70 hover:shadow-md cursor-pointer transition-all duration-200 ease-out"
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="text-sm font-bold mb-2 text-gray-900">
                          {dayOfMonth}
                        </div>
                        <div className="space-y-1">
                          {dayVacations.map((vacation) => {
                            const getVacationStyle = (type: string, status: string) => {
                              if (type === 'sick') {
                                return 'bg-blue-100 border border-blue-500 text-blue-800'
                              } else if (type === 'personal') {
                                return 'bg-purple-100 border border-purple-500 text-purple-800'
                              } else {
                                // vacation type
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
                            }
                            
                            const getEventText = (vacation: any) => {
                              // Show only employee name
                              return vacation.employeeName
                            }
                            
                            return (
                              <div
                                key={vacation.id}
                                className={`text-xs p-2 rounded-lg shadow-sm font-medium ${getVacationStyle(vacation.type, vacation.status)}`}
                                title={`${vacation.employeeName} - ${vacation.reason}`}
                              >
                                <div className="font-medium truncate">
                                  {getEventText(vacation)}
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
                    <div key={`empty-end-${i}`} className="min-h-[100px] bg-white/30 border border-white/40 rounded-xl p-2 shadow-sm"></div>
                  ))}
                </div>
              </div>

              {/* Selected Date Details */}
              {selectedDate && (
                <div className="mt-8 glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  <div className="space-y-4">
                    {getVacationEventsForDate(selectedDate).length > 0 ? (
                      getVacationEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="glass-effect rounded-xl border-white/30 p-6 bg-white/80 backdrop-blur-xl shadow-modern">
                          <div className="flex items-start gap-3">
                            <div className={`p-3 rounded-xl shadow-sm ${getTypeColor(event.type)}`}>
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold text-gray-900">{event.employeeName}</h5>
                                <Badge variant="outline" className={getTypeColor(event.type)}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(event.status)}>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-3 font-medium">{event.reason}</p>
                              <div className="text-xs text-gray-600 font-medium">
                                {event.startDate} - {event.endDate} ({event.days} days) | Group: {event.employeeGroup}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-600">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No vacation events on this date</h4>
                        <p className="text-gray-600">Select another date to view vacation details.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
