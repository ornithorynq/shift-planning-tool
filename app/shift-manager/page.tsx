"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  LogOut,
  Eye,
  EyeOff,
  Download,
  FileSpreadsheet,
  Settings,
  Bell,
  RefreshCw,
  Send,
  ChevronLeft,
  ChevronRight,
  Award,
  X,
  UserCheck,
  UserX,
  Phone,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NotificationCenter } from "@/components/notification-center"

type BringShift = {
  id: string
  date: string
  shiftType: string
  qualification: string
  reason: string
  status: "open" | "assigned"
}

type OpenRequest = {
  id: string
  shiftDate: string
  shiftType: string
  requiredQualification: string
  reason: string
  status: "open" | "closed"
  notifications: number
}

type EmployeeReport = {
  id: string
  employeeId: string
  employeeName: string
  group: string
  qualification: string
  reason: string
  status: "permissible" | "not-permissible"
}

type QualificationCoverage = {
  qualification: string
  required: number
  available: number
  status: "covered" | "understaffed"
}

export default function ShiftManagerPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"overview" | "matrix">("overview")
  const [newShiftDate, setNewShiftDate] = useState("")
  const [newShiftType, setNewShiftType] = useState("")
  const [newShiftQualification, setNewShiftQualification] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)) // January 2025
  const [showOpenShiftsModal, setShowOpenShiftsModal] = useState(false)
  const [showActiveShiftsModal, setShowActiveShiftsModal] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const [bringShifts, setBringShifts] = useState<BringShift[]>([
    {
      id: "1",
      date: "2025-01-04",
      shiftType: "Early Shift",
      qualification: "Q1",
      reason: "Vacation AA (Approved)",
      status: "open"
    }
  ])

  const [openRequests] = useState<OpenRequest[]>([
    {
      id: "1",
      shiftDate: "2025-01-04",
      shiftType: "Early Shift",
      requiredQualification: "Q1",
      reason: "Vacation AA (Approved)",
      status: "open",
      notifications: 3
    }
  ])

  const [employeeReports] = useState<EmployeeReport[]>([
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Employee AA",
      group: "Group A",
      qualification: "Q1",
      reason: "Vacation AA (Approved)",
      status: "permissible"
    }
  ])

  const [qualificationCoverage] = useState<QualificationCoverage[]>([
    {
      qualification: "Q1 (Required: 2)",
      required: 2,
      available: 2,
      status: "covered"
    },
    {
      qualification: "Q2 (Required: 1)",
      required: 1,
      available: 0,
      status: "understaffed"
    }
  ])

  // Mock data for active shifts today
  const activeShiftsData = [
    {
      id: "1",
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      shiftType: "Early Shift",
      startTime: "06:00",
      endTime: "14:00",
      location: "Main Plant",
      qualification: "Q1",
      status: "in-progress",
      progress: 65
    },
    {
      id: "2", 
      employeeName: "Mike Chen",
      employeeId: "EMP002",
      shiftType: "Late Shift",
      startTime: "14:00",
      endTime: "22:00",
      location: "Main Plant",
      qualification: "Q2",
      status: "in-progress",
      progress: 25
    },
    {
      id: "3",
      employeeName: "Emily Rodriguez", 
      employeeId: "EMP003",
      shiftType: "Night Shift",
      startTime: "22:00",
      endTime: "06:00",
      location: "Secondary Facility",
      qualification: "Q1",
      status: "in-progress",
      progress: 80
    }
  ]

  const handleCreateShift = () => {
    if (newShiftDate && newShiftType && newShiftQualification) {
      const newShift: BringShift = {
        id: Date.now().toString(),
        date: newShiftDate,
        shiftType: newShiftType,
        qualification: newShiftQualification,
        reason: "Manual creation",
        status: "open"
      }
      setBringShifts([...bringShifts, newShift])
      setNewShiftDate("")
      setNewShiftType("")
      setNewShiftQualification("")
    }
  }

  const exportToExcel = () => {
    // Simulate Excel export
    const data = {
      shifts: bringShifts,
      requests: openRequests,
      employees: employeeReports,
      coverage: qualificationCoverage
    }
    console.log("Exporting data to Excel:", data)
    // In a real app, this would trigger a download
    alert("Excel export functionality would be implemented here")
  }

  const sendNotifications = () => {
    // Simulate sending notifications to employees
    console.log("Sending notifications to employees")
    alert("Notifications sent to relevant employees")
  }

  const refreshData = () => {
    // Simulate data refresh
    console.log("Refreshing shift data")
    alert("Data refreshed successfully")
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

  const generateShiftData = (month: Date, employeeIndex: number) => {
    const daysInMonth = getDaysInMonth(month)
    const shifts = ['F', 'S', 'N', 'U', 'A', '']
    const shiftWeights = [0.25, 0.25, 0.2, 0.1, 0.05, 0.15] // More empty days for other months
    
    // January 2025 has full data, other months are more sparse
    const isJanuary2025 = month.getMonth() === 0 && month.getFullYear() === 2025
    
    if (isJanuary2025) {
      // Return the original data for January 2025
      return employeeData[employeeIndex]?.days || []
    }
    
    // Generate realistic but sparse data for other months
    const generatedDays = []
    for (let i = 0; i < daysInMonth; i++) {
      const random = Math.random()
      let cumulativeWeight = 0
      let selectedShift = ''
      
      for (let j = 0; j < shifts.length; j++) {
        cumulativeWeight += shiftWeights[j]
        if (random <= cumulativeWeight) {
          selectedShift = shifts[j]
          break
        }
      }
      
      // Add some realistic patterns (weekends have more vacation, weekdays more shifts)
      const dayOfWeek = new Date(month.getFullYear(), month.getMonth(), i + 1).getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        if (selectedShift === 'F' || selectedShift === 'S' || selectedShift === 'N') {
          selectedShift = Math.random() < 0.3 ? 'U' : selectedShift
        }
      }
      
      generatedDays.push(selectedShift)
    }
    
    return generatedDays
  }

  const totalOpenShifts = bringShifts.filter(shift => shift.status === "open").length
  const activeShiftsToday = 3

  // Employee data for shift matrix
  const employeeData = [
    {
      name: "Employee AA",
      shifts: 218,
      vacation: 6,
      bringShifts: 2,
      conversion: 0,
      days: ["F", "F", "F", "F", "U", "U", "U", "U", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee AB", 
      shifts: 219,
      vacation: 0,
      bringShifts: 0,
      conversion: 0,
      days: ["F", "F", "F", "S", "S", "S", "N", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee AC",
      shifts: 215,
      vacation: 3,
      bringShifts: 1,
      conversion: 0,
      days: ["F", "S", "S", "N", "N", "N", "F", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N"]
    },
    {
      name: "Employee AD",
      shifts: 220,
      vacation: 2,
      bringShifts: 0,
      conversion: 0,
      days: ["N", "N", "N", "F", "F", "S", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee AE",
      shifts: 217,
      vacation: 4,
      bringShifts: 1,
      conversion: 0,
      days: ["F", "F", "S", "S", "N", "N", "N", "F", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee AF",
      shifts: 219,
      vacation: 1,
      bringShifts: 0,
      conversion: 0,
      days: ["S", "S", "N", "N", "N", "F", "F", "S", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee AG",
      shifts: 218,
      vacation: 2,
      bringShifts: 1,
      conversion: 0,
      days: ["N", "N", "F", "F", "S", "S", "N", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BA",
      shifts: 216,
      vacation: 5,
      bringShifts: 3,
      conversion: 0,
      days: ["S", "N", "N", "N", "F", "F", "S", "S", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BB",
      shifts: 220,
      vacation: 0,
      bringShifts: 1,
      conversion: 0,
      days: ["F", "F", "S", "S", "N", "N", "N", "F", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BC",
      shifts: 217,
      vacation: 3,
      bringShifts: 2,
      conversion: 0,
      days: ["S", "N", "N", "A", "F", "S", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BD",
      shifts: 218,
      vacation: 2,
      bringShifts: 0,
      conversion: 0,
      days: ["S", "N", "N", "", "F", "S", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BE",
      shifts: 219,
      vacation: 1,
      bringShifts: 1,
      conversion: 0,
      days: ["F", "S", "S", "N", "N", "N", "F", "F", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BF",
      shifts: 217,
      vacation: 3,
      bringShifts: 0,
      conversion: 0,
      days: ["S", "N", "N", "N", "F", "F", "S", "S", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S"]
    },
    {
      name: "Employee BG",
      shifts: 220,
      vacation: 0,
      bringShifts: 0,
      conversion: 0,
      days: ["F", "F", "S", "S", "S", "N", "N", "F", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F", "S", "N", "F"]
    }
  ]

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'F': return 'bg-emerald-100 text-emerald-600'
      case 'S': return 'bg-amber-100 text-amber-600'
      case 'N': return 'bg-blue-100 text-blue-600'
      case 'U': return 'bg-orange-100 text-orange-600'
      case 'A': return 'bg-red-100 text-red-600'
      default: return 'bg-slate-100 text-slate-400'
    }
  }

  const handleOpenShiftsClick = () => {
    setShowOpenShiftsModal(true)
  }

  const handleActiveShiftsClick = () => {
    setShowActiveShiftsModal(true)
  }

  const handleAssignShift = (shiftId: string) => {
    // Navigate to employee assignment page with shift ID
    const shift = bringShifts.find(s => s.id === shiftId)
    if (shift) {
      // Close the modal first
      setShowOpenShiftsModal(false)
      // Navigate to employee assignment page with shift details
      router.push(`/shift-manager/employee-assignment?shiftId=${shiftId}&date=${shift.date}&type=${encodeURIComponent(shift.shiftType)}&qualification=${shift.qualification}`)
    }
  }

  const handleContactEmployee = (employeeId: string) => {
    // Mock contact logic
    console.log(`Contacting employee ${employeeId}`)
    alert(`Contact functionality for employee ${employeeId} would be implemented here`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning Dashboard</h1>
              <p className="text-gray-600">Welcome, Shift Manager. Control of cross-location personnel planning.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-blue-600 font-medium">Shift Manager</div>
                <div className="text-sm text-gray-500">ID: SM001 | Level: Manager</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Management Tools Navigation */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Link href="/shift-manager/shift-cycles">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 h-10 px-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Cycles
                </Button>
              </Link>
              <Link href="/shift-manager/employee-assignment">
                <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50 h-10 px-4">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Employees
                </Button>
              </Link>
              <Link href="/shift-manager/qualifications">
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-10 px-4">
                  <Award className="w-4 h-4 mr-2" />
                  Qualifications
                </Button>
              </Link>
              <Link href="/shift-manager/vacation-management">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 h-10 px-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Vacation Management
                </Button>
              </Link>
              
              {/* Quick Actions */}
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToExcel} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={sendNotifications} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4">
                  <Send className="w-4 h-4 mr-2" />
                  Notify
                </Button>
                <Button variant="outline" size="sm" onClick={refreshData} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setViewMode("overview")}
              className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                viewMode === "overview" 
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setViewMode("matrix")}
              className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                viewMode === "matrix" 
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Shift Matrix
            </button>
          </div>
        </div>

        {viewMode === "overview" && (
          <div className="space-y-6">
            {/* Overview Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Overview Dashboard</h2>
                <p className="text-lg text-gray-600">Current status and quick actions for shift management</p>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500 cursor-pointer hover:scale-105 transform transition-all duration-200"
                onClick={handleOpenShiftsClick}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Urgent
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-orange-600 mb-2">{totalOpenShifts}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-1">Open Bring-Shifts</div>
                    <div className="text-sm text-gray-600">Require immediate attention</div>
                  </div>
                </div>
              </div>
              <div 
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500 cursor-pointer hover:scale-105 transform transition-all duration-200"
                onClick={handleActiveShiftsClick}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Active
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">{activeShiftsToday}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-1">Active Shifts Today</div>
                    <div className="text-sm text-gray-600">Currently running</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Coverage by Qualification */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Coverage by Qualification</h3>
                  <p className="text-gray-600">Current staffing levels for today's shifts</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Covered</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
                  <span className="text-sm text-gray-600">Understaffed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Q1 Qualification</div>
                        <div className="text-sm text-gray-600">Required: 2 positions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-green-700">2</div>
                      <div className="text-sm text-green-600 font-medium">Available</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                    <div className="text-xs text-green-700 mt-1">100% Coverage</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-200 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Q2 Qualification</div>
                        <div className="text-sm text-gray-600">Required: 1 position</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-red-700">0</div>
                      <div className="text-sm text-red-600 font-medium">Available</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <div className="text-xs text-red-700 mt-1">0% Coverage - Action Required</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Rest Period Check:</span>
                  <span className="text-amber-700">Not permissible for current assignments</span>
                </div>
              </div>
            </div>

            {/* Bring-Shifts Management & Creation */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Bring-Shift</h3>
                  <p className="text-gray-600">Add a new shift that needs to be filled by employees</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shift-date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Shift Date
                    </Label>
                    <Input
                      id="shift-date"
                      type="date"
                      value={newShiftDate}
                      onChange={(e) => setNewShiftDate(e.target.value)}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Select date"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shift-type" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Shift Type
                    </Label>
                    <Select value={newShiftType} onValueChange={setNewShiftType}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500" size="default">
                        <SelectValue placeholder="Select shift type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early">Early Shift (6:00 - 14:00)</SelectItem>
                        <SelectItem value="late">Late Shift (14:00 - 22:00)</SelectItem>
                        <SelectItem value="night">Night Shift (22:00 - 6:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Qualification
                    </Label>
                    <Select value={newShiftQualification} onValueChange={setNewShiftQualification}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500" size="default">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">Q1 - Basic Level</SelectItem>
                        <SelectItem value="q2">Q2 - Intermediate Level</SelectItem>
                        <SelectItem value="q3">Q3 - Advanced Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col justify-end h-full">
                    <div className="h-6"></div> {/* Spacer to align with input fields */}
                    <Button 
                      onClick={handleCreateShift} 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={!newShiftDate || !newShiftType || !newShiftQualification}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Publish Shift
                    </Button>
                  </div>
                </div>
                
                {newShiftDate && newShiftType && newShiftQualification && (
                  <div className="mt-6 p-4 bg-white border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Ready to publish:</span>
                      <span>{newShiftType} on {newShiftDate} requiring {newShiftQualification} qualification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Open Requests */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Open Shift Requests</h3>
                  <p className="text-gray-600">Pending requests that need your attention</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {openRequests.length} Active
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                {openRequests.map((request) => (
                  <div key={request.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-200 rounded-lg">
                          <Clock className="w-6 h-6 text-amber-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{request.shiftType}</h4>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              {request.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Date:</span> {request.shiftDate} | 
                            <span className="font-medium ml-2">Qualification:</span> {request.requiredQualification}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Bell className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">{request.notifications} notifications</span>
                          </div>
                          <div className="text-xs text-gray-500">Last updated 2 hours ago</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Assign
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {openRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h4>
                    <p className="text-gray-600">No open requests at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rest Period Check */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rest Period Compliance Check</h3>
                  <p className="text-gray-600">Verify employee rest periods meet regulatory requirements</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Compliance Check
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">Employee AA</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Compliant
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Shift:</span> Early Shift | 
                          <span className="font-medium ml-2">Date:</span> Jan 15, 2025 | 
                          <span className="font-medium ml-2">Qualification:</span> Q1
                        </div>
                        <div className="text-sm text-green-700">
                          <span className="font-medium">Rest Period:</span> 12 hours between shifts ✓
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-700 mb-1">Compliant</div>
                        <div className="text-xs text-gray-500">Last checked 1 hour ago</div>
                      </div>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-200 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">Employee BB</h4>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Non-Compliant
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Shift:</span> Night Shift | 
                          <span className="font-medium ml-2">Date:</span> Jan 15, 2025 | 
                          <span className="font-medium ml-2">Qualification:</span> Q2
                        </div>
                        <div className="text-sm text-red-700">
                          <span className="font-medium">Issue:</span> Insufficient rest period (8 hours) - requires 12 hours minimum
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-700 mb-1">Action Required</div>
                        <div className="text-xs text-gray-500">Last checked 1 hour ago</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Compliance Summary:</span>
                  <span className="text-blue-700">1 compliant, 1 non-compliant - Review required for Employee BB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "matrix" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              {/* Matrix Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Shift Matrix Capacity Planning</h2>
                    <p className="text-sm text-gray-600">Entire Plant - Next 13 Months</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportToExcel} className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateMonth('prev')}
                    className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">{getMonthName(currentMonth)}</h3>
                    <p className="text-sm text-gray-600">{getDaysInMonth(currentMonth)} days</p>
                  </div>
                  
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
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-700 mb-2">
                    <span className="font-medium">Legend:</span> F=Early, S=Late, N=Night, U=Vacation, A=Bring-shift-Assigned
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Employee columns are frozen - scroll horizontally to view daily shifts</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-8 mb-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-md"></div>
                  <span className="font-medium text-gray-700">F - Early Shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-amber-100 rounded-md"></div>
                  <span className="font-medium text-gray-700">S - Late Shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-md"></div>
                  <span className="font-medium text-gray-700">N - Night Shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-md"></div>
                  <span className="font-medium text-gray-700">U - Vacation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-md"></div>
                  <span className="font-medium text-gray-700">A - Bring-shift-Assigned</span>
                </div>
              </div>

              {/* Main Matrix Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex relative">
                  {/* Fixed Columns Container */}
                  <div className="bg-white border-r-2 border-slate-200 shadow-lg z-10 sticky left-0">
                    {/* Fixed Header */}
                    <div className="bg-slate-50 border-b border-slate-200">
                      <div className="flex text-xs font-semibold text-slate-700 uppercase tracking-wide py-4 px-6 h-14 items-center">
                        <div className="w-48 text-left">Employee</div>
                        <div className="w-16 text-center">Shifts</div>
                        <div className="w-16 text-center">Vacation</div>
                        <div className="w-16 text-center">Bring-Shifts</div>
                        <div className="w-16 text-center">Conversion</div>
                      </div>
                      <div className="flex text-xs font-medium text-slate-500 py-3 px-6 bg-white h-10 items-center">
                        <div className="w-112"></div>
                      </div>
                    </div>

                    {/* Fixed Employee Rows */}
                    <div className="bg-white">
                      {employeeData.map((employee, index) => (
                        <div key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex text-sm py-4 px-6 h-14 items-center">
                            <div className="w-48 font-semibold text-slate-900">{employee.name}</div>
                            <div className="w-16 text-center text-slate-700 font-medium">{employee.shifts}</div>
                            <div className="w-16 text-center text-slate-700 font-medium">{employee.vacation}</div>
                            <div className="w-16 text-center text-slate-700 font-medium">{employee.bringShifts}</div>
                            <div className="w-16 text-center text-slate-700 font-medium">{employee.conversion}</div>
                          </div>
                        </div>
                      ))}

                      {/* Fixed Summary Rows */}
                      <div className="bg-slate-50 border-t border-slate-200">
                        <div className="flex text-sm py-4 px-6 h-14 items-center">
                          <div className="w-112 font-semibold text-slate-700">Attendance own shift</div>
                        </div>
                        <div className="flex text-sm py-4 px-6 h-14 items-center">
                          <div className="w-112 font-semibold text-slate-700">Planned total attendance</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Columns Container */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="min-w-max">
                      {/* Scrollable Header */}
                      <div className="bg-slate-50 border-b border-slate-200">
                        <div className="flex text-xs font-semibold text-slate-700 uppercase tracking-wide py-4 px-6 h-14 items-center">
                          <div className="w-372 text-left">{getMonthName(currentMonth)}</div>
                        </div>
                        <div className="flex text-xs font-medium text-slate-500 py-3 px-6 bg-white h-10 items-center gap-1">
                          {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => (
                            <div key={i} className="w-10 text-center">{i + 1}</div>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Employee Rows */}
                      <div className="bg-white">
                        {employeeData.map((employee, index) => (
                          <div key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="flex text-sm py-4 px-6 h-14 items-center gap-1">
                              {generateShiftData(currentMonth, index).map((day, dayIndex) => (
                                <div key={dayIndex} className={`w-10 h-10 text-center text-slate-900 font-semibold text-xs ${getShiftColor(day)} flex items-center justify-center rounded-md shadow-sm`}>
                                  {day}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Scrollable Summary Rows */}
                        <div className="bg-slate-50 border-t border-slate-200">
                          <div className="flex text-sm py-4 px-6 h-14 items-center gap-1">
                            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                              const isJanuary2025 = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === 2025
                              const value = isJanuary2025 ? (i < 12 ? '6' : '') : (Math.random() < 0.7 ? String(Math.floor(Math.random() * 8) + 4) : '')
                              return (
                                <div key={i} className="w-10 text-center text-slate-700 font-semibold">
                                  {value}
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex text-sm py-4 px-6 h-14 items-center gap-1">
                            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                              const isJanuary2025 = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === 2025
                              let value = ''
                              
                              if (isJanuary2025) {
                                const values = [8, 7, 8, 9, 8, 7, 8, 8, 8, 7, 8, 8, 9, 8, 7, 8, 8, 8, 7, 8, 8, 9, 8, 7, 8, 8, 8, 7, 8, 8, 9];
                                value = values[i] ? String(values[i]) : ''
                              } else {
                                // Generate realistic but sparse data for other months
                                value = Math.random() < 0.6 ? String(Math.floor(Math.random() * 12) + 6) : ''
                              }
                              
                              return (
                                <div key={i} className="w-10 text-center text-slate-700 font-semibold">
                                  {value}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Open Bring-Shifts Modal */}
      <Dialog open={showOpenShiftsModal} onOpenChange={setShowOpenShiftsModal}>
        <DialogContent className="w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Open Bring-Shifts Requiring Attention
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Manage and assign employees to open bring-shifts that need immediate attention.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {bringShifts.filter(shift => shift.status === "open").map((shift) => (
              <div key={shift.id} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 w-full">
                {/* Header Section */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-orange-200 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{shift.shiftType}</h4>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 px-2 py-1 text-xs">
                        {shift.qualification}
                      </Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800 px-2 py-1 text-xs">
                        Open
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {shift.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Reason:</span> {shift.reason}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> <span className="text-orange-700">Requires immediate assignment</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleAssignShift(shift.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm flex-1 sm:flex-none"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Assign Employee
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 px-4 py-2 text-sm flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {bringShifts.filter(shift => shift.status === "open").length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h4>
                <p className="text-gray-600">No open bring-shifts requiring immediate attention.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Shifts Modal */}
      <Dialog open={showActiveShiftsModal} onOpenChange={setShowActiveShiftsModal}>
        <DialogContent className="w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
              <Clock className="w-6 h-6 text-blue-600" />
              Active Shifts Today
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Monitor currently running shifts and manage employee activities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {activeShiftsData.map((shift) => (
              <div key={shift.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 w-full">
                {/* Header Section */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-200 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{shift.employeeName}</h4>
                      <Badge variant="outline" className="px-2 py-1 text-xs">{shift.employeeId}</Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 px-2 py-1 text-xs">
                        {shift.shiftType}
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800 px-2 py-1 text-xs">
                        In Progress
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {shift.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Qualification:</span> {shift.qualification}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Shift Progress</span>
                    <span className="font-semibold text-blue-600">{shift.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{width: `${shift.progress}%`}}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleContactEmployee(shift.employeeId)}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm flex-1 sm:flex-none"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    onClick={() => handleContactEmployee(shift.employeeId)}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm flex-1 sm:flex-none"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
