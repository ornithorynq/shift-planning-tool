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
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"overview" | "matrix" | "create-shift">("overview")
  const [newShiftDate, setNewShiftDate] = useState("")
  const [newShiftType, setNewShiftType] = useState("")
  const [newShiftQualification, setNewShiftQualification] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)) // January 2025
  const [showOpenShiftsModal, setShowOpenShiftsModal] = useState(false)
  const [showActiveShiftsModal, setShowActiveShiftsModal] = useState(false)
  const [showErrorState, setShowErrorState] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const handleOpenShiftClick = (requestId: string) => {
    // Find the request details
    const request = openRequests.find(req => req.id === requestId)
    if (request) {
      // Navigate to employee assignment page with shift details
      router.push(`/shift-manager/employee-assignment?shiftId=${requestId}&shiftType=${encodeURIComponent(request.shiftType)}&shiftDate=${encodeURIComponent(request.shiftDate)}&qualification=${encodeURIComponent(request.requiredQualification)}&reason=${encodeURIComponent(request.reason)}`)
    }
  }

  const [bringShifts, setBringShifts] = useState<BringShift[]>([
    {
      id: "1",
      date: "2025-01-04",
      shiftType: "Early Shift",
      qualification: "Q1",
      reason: "Vacation AA (Approved)",
      status: "open"
    },
    {
      id: "2",
      date: "2025-01-05",
      shiftType: "Late Shift",
      qualification: "Q2",
      reason: "Sick Leave - COVID-19",
      status: "open"
    },
    {
      id: "3",
      date: "2025-01-06",
      shiftType: "Night Shift",
      qualification: "Q1",
      reason: "Family Emergency",
      status: "open"
    },
    {
      id: "4",
      date: "2025-01-07",
      shiftType: "Early Shift",
      qualification: "Q3",
      reason: "No-show (No prior notice)",
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
      available: 1,
      status: "covered"
    },
    {
      qualification: "Q3 (Required: 1)",
      required: 1,
      available: 0,
      status: "understaffed"
    }
  ])

  // Enhanced mock data for active shifts today with realistic scenarios
  const activeShiftsData = [
    {
      id: "1",
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      shiftType: "Early Shift",
      startTime: "06:00",
      endTime: "14:00",
      location: "Main Plant - Production Line A",
      qualification: "Q1",
      status: "in-progress",
      progress: 65,
      lastCheckIn: "08:30",
      performance: "excellent",
      notes: "Running ahead of schedule"
    },
    {
      id: "2", 
      employeeName: "Mike Chen",
      employeeId: "EMP002",
      shiftType: "Late Shift",
      startTime: "14:00",
      endTime: "22:00",
      location: "Main Plant - Quality Control",
      qualification: "Q2",
      status: "in-progress",
      progress: 25,
      lastCheckIn: "14:15",
      performance: "good",
      notes: "Equipment maintenance in progress"
    },
    {
      id: "3",
      employeeName: "Emily Rodriguez", 
      employeeId: "EMP003",
      shiftType: "Night Shift",
      startTime: "22:00",
      endTime: "06:00",
      location: "Secondary Facility - Warehouse",
      qualification: "Q1",
      status: "in-progress",
      progress: 80,
      lastCheckIn: "23:45",
      performance: "excellent",
      notes: "Inventory count completed early"
    },
    {
      id: "4",
      employeeName: "David Kim",
      employeeId: "EMP004",
      shiftType: "Early Shift",
      startTime: "06:00",
      endTime: "14:00",
      location: "Main Plant - Packaging",
      qualification: "Q3",
      status: "in-progress",
      progress: 40,
      lastCheckIn: "07:20",
      performance: "needs-attention",
      notes: "Running behind due to equipment issues"
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
    setIsActionLoading(true)
    // Simulate Excel export with realistic delay
    setTimeout(() => {
      const data = {
        shifts: bringShifts,
        requests: openRequests,
        employees: employeeReports,
        coverage: qualificationCoverage
      }
      console.log("Exporting data to Excel:", data)
      setIsActionLoading(false)
      setSuccessMessage("Excel report exported successfully! Check your downloads folder.")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }, 1500)
  }

  const sendNotifications = () => {
    setIsActionLoading(true)
    // Simulate sending notifications with realistic delay
    setTimeout(() => {
      console.log("Sending notifications to employees")
      setIsActionLoading(false)
      setSuccessMessage("Notifications sent to 12 employees successfully!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }, 2000)
  }

  const refreshData = () => {
    setIsActionLoading(true)
    // Simulate data refresh with realistic delay
    setTimeout(() => {
      console.log("Refreshing shift data")
      setIsActionLoading(false)
      setSuccessMessage("Data refreshed successfully! 3 new updates found.")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }, 1000)
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

  const handleQualificationClick = (qualification: string) => {
    // Navigate to qualifications page with filter
    router.push(`/shift-manager/qualifications?filter=${qualification}`)
  }

  const handleRestPeriodClick = () => {
    // Navigate to rest period compliance page
    router.push('/shift-manager/rest-period-compliance')
  }

  const handleComplianceCardClick = () => {
    // Navigate to rest period compliance page
    router.push('/shift-manager/rest-period-compliance')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manager dashboard...</p>
        </div>
      </div>
    )
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
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">Planning Dashboard</h1>
                <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                  Manager Portal
                </div>
              </div>
              <p className="text-gray-600 text-lg">Welcome back! Here's your shift management overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-blue-600 font-medium">Shift Manager</div>
                <div className="text-sm text-gray-500">ID: SM001 | Level: Manager</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Management Tools Navigation */}
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex flex-wrap gap-3">
              <Link href="/shift-manager/shift-cycles">
                <Button variant="outline" size="sm" className="btn-modern border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 shadow-lg h-10 px-4" style={{borderRadius: '9999px'}}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Cycles
                </Button>
              </Link>
              <Link href="/shift-manager/employee-assignment">
                <Button variant="outline" size="sm" className="btn-modern border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 shadow-lg h-10 px-4" style={{borderRadius: '9999px'}}>
                  <Users className="w-4 h-4 mr-2" />
                  Employee Assignment
                </Button>
              </Link>
              <Link href="/shift-manager/qualifications">
                <Button variant="outline" size="sm" className="btn-modern border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 shadow-lg h-10 px-4" style={{borderRadius: '9999px'}}>
                  <Users className="w-4 h-4 mr-2" />
                  Qualifications
                </Button>
              </Link>
              <Link href="/shift-manager/vacation-management">
                <Button variant="outline" size="sm" className="btn-modern border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-lg h-10 px-4" style={{borderRadius: '9999px'}}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Vacation Management
                </Button>
              </Link>
              
              {/* Quick Actions */}
              <div className="ml-auto flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToExcel} 
                  disabled={isActionLoading}
                  className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg h-10 px-4 disabled:opacity-50"
                  style={{borderRadius: '9999px'}}
                >
                  {isActionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={sendNotifications} 
                  disabled={isActionLoading}
                  className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg h-10 px-4 disabled:opacity-50"
                  style={{borderRadius: '9999px'}}
                >
                  {isActionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Notify
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData} 
                  disabled={isActionLoading}
                  className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg h-10 px-4 disabled:opacity-50"
                  style={{borderRadius: '9999px'}}
                >
                  {isActionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isActionLoading && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 flex items-center gap-3 shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">Processing...</span>
          </div>
        </div>
      )}

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto section-padding">
        {/* Navigation Tabs */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="flex border-b border-white/30 overflow-x-auto">
            <button 
              onClick={() => setViewMode("overview")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                viewMode === "overview" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setViewMode("matrix")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                viewMode === "matrix" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Shift Matrix
            </button>
            <button 
              onClick={() => setViewMode("create-shift")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative ${
                viewMode === "create-shift" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Create Shift
            </button>
          </div>
        </div>

        {viewMode === "overview" && (
          <div className="space-y-6">
            {/* Overview Header */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Overview Dashboard</h2>
                <p className="text-lg text-gray-600">Current status and quick actions for shift management</p>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-orange-300 transition-all duration-500 ease-out border-l-4 border-l-orange-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] group"
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
                    <div className="text-5xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">{totalOpenShifts}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors duration-300">Open Bring-Shifts</div>
                    <div className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300">Require immediate attention</div>
                    <div className="mt-2 text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to view details →
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-blue-300 transition-all duration-500 ease-out border-l-4 border-l-blue-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] group"
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
                    <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">{activeShiftsToday}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">Active Shifts Today</div>
                    <div className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Currently running</div>
                    <div className="mt-2 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to monitor →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Coverage by Qualification */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-green-300 transition-all duration-300 ease-out border-l-4 border-l-green-600 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-green-50/50 to-green-100/50 p-6"
                  onClick={() => handleQualificationClick('Q1')}
                >
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
                
                <div 
                  className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-green-300 transition-all duration-300 ease-out border-l-4 border-l-green-600 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-green-50/50 to-green-100/50 p-6"
                  onClick={() => handleQualificationClick('Q2')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Q2 Qualification</div>
                        <div className="text-sm text-gray-600">Required: 1 position</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-green-700">1</div>
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
                
                <div 
                  className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-red-300 transition-all duration-300 ease-out border-l-4 border-l-red-600 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-red-50/50 to-red-100/50 p-6"
                  onClick={() => handleQualificationClick('Q3')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-200 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Q3 Qualification</div>
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
              
              <div 
                className="mt-6 p-4 glass-effect rounded-lg cursor-pointer hover:bg-amber-100/50 hover:border-amber-300 transition-all duration-200 ease-out bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                onClick={handleRestPeriodClick}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Rest Period Check:</span>
                  <span className="text-amber-700">Not permissible for current assignments</span>
                </div>
              </div>
            </div>


            {/* Open Requests */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
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
                  <div key={request.id} className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-amber-300 transition-all duration-300 ease-out hover:-translate-y-0.5 bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-6">
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
                          <Button variant="outline" size="sm" className="btn-modern border-amber-300 text-amber-700 hover:bg-amber-50 shadow-lg">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="btn-modern bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                            onClick={() => handleOpenShiftClick(request.id)}
                          >
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
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
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
                <div 
                  className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-green-300 transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-green-50/50 to-emerald-50/50 p-6"
                  onClick={handleComplianceCardClick}
                >
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
                      <Button variant="outline" size="sm" className="btn-modern border-green-300 text-green-700 hover:bg-green-50 shadow-lg">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="glass-effect rounded-xl shadow-modern hover:shadow-modern-lg hover:border-red-300 transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-red-50/50 to-rose-50/50 p-6"
                  onClick={handleComplianceCardClick}
                >
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
                        <Button variant="outline" size="sm" className="btn-modern border-red-300 text-red-700 hover:bg-red-50 shadow-lg">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="btn-modern bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 glass-effect rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
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
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-6">
            <div className="p-8">
              {/* Matrix Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Shift Matrix Capacity Planning</h2>
                    <p className="text-sm text-gray-600">Entire Plant - Next 13 Months</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportToExcel} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
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
                    className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg"
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
                    className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-8 mb-8 text-base">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-xl shadow-sm"></div>
                  <span className="font-semibold text-gray-800">F - Early Shift</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-amber-100 rounded-xl shadow-sm"></div>
                  <span className="font-semibold text-gray-800">S - Late Shift</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-xl shadow-sm"></div>
                  <span className="font-semibold text-gray-800">N - Night Shift</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-orange-100 rounded-xl shadow-sm"></div>
                  <span className="font-semibold text-gray-800">U - Vacation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-red-100 rounded-xl shadow-sm"></div>
                  <span className="font-semibold text-gray-800">A - Bring-shift-Assigned</span>
                </div>
              </div>

              {/* Main Matrix Table */}
              <div className="glass-effect border-white/30 rounded-2xl overflow-hidden shadow-modern">
                <div className="flex relative">
                  {/* Fixed Columns Container */}
                  <div className="glass-effect border-r-2 border-white/30 shadow-lg z-10 sticky left-0">
                    {/* Fixed Header */}
                    <div className="bg-white/50 border-b border-white/30">
                      <div className="flex text-xs font-semibold text-gray-700 uppercase tracking-wide py-5 px-6 h-16 items-center">
                        <div className="w-48 text-left">Employee</div>
                        <div className="w-20 text-center">Shifts</div>
                        <div className="w-20 text-center">Vacation</div>
                        <div className="w-24 text-center">Bring-Shifts</div>
                        <div className="w-20 text-center">Conversion</div>
                      </div>
                      <div className="flex text-sm font-medium text-gray-600 py-4 px-6 bg-white/30 h-12 items-center">
                        <div className="w-132"></div>
                      </div>
                    </div>

                    {/* Fixed Employee Rows */}
                    <div className="bg-white/30">
                      {employeeData.map((employee, index) => (
                        <div key={index} className="border-b border-white/30 hover:bg-white/50 hover:shadow-sm transition-all duration-200 ease-out">
                          <div className="flex text-base py-5 px-6 h-16 items-center">
                            <div className="w-48 font-semibold text-gray-800">{employee.name}</div>
                            <div className="w-20 text-center text-gray-600 font-medium">{employee.shifts}</div>
                            <div className="w-20 text-center text-gray-600 font-medium">{employee.vacation}</div>
                            <div className="w-24 text-center text-gray-600 font-medium">{employee.bringShifts}</div>
                            <div className="w-20 text-center text-gray-600 font-medium">{employee.conversion}</div>
                          </div>
                        </div>
                      ))}

                      {/* Fixed Summary Rows */}
                      <div className="bg-white/50 border-t border-white/30">
                        <div className="flex text-base py-5 px-6 h-16 items-center">
                          <div className="w-132 font-semibold text-gray-700">Attendance own shift</div>
                        </div>
                        <div className="flex text-base py-5 px-6 h-16 items-center">
                          <div className="w-132 font-semibold text-gray-700">Planned total attendance</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Columns Container */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="min-w-max">
                      {/* Scrollable Header */}
                      <div className="bg-white/50 border-b border-white/30">
                        <div className="flex text-sm font-semibold text-gray-700 uppercase tracking-wide py-5 px-6 h-16 items-center">
                          <div className="w-372 text-left">{getMonthName(currentMonth)}</div>
                        </div>
                        <div className="flex text-sm font-medium text-gray-600 py-4 px-6 bg-white/30 h-12 items-center gap-1">
                          {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => (
                            <div key={i} className="w-10 text-center">{i + 1}</div>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Employee Rows */}
                      <div className="bg-white/30">
                        {employeeData.map((employee, index) => (
                          <div key={index} className="border-b border-white/30 hover:bg-white/50 hover:shadow-sm transition-all duration-200 ease-out">
                            <div className="flex text-base py-5 px-6 h-16 items-center gap-1">
                              {generateShiftData(currentMonth, index).map((day, dayIndex) => (
                                <div key={dayIndex} className={`w-10 h-10 text-center text-gray-800 font-semibold text-sm ${getShiftColor(day)} flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}>
                                  {day}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Scrollable Summary Rows */}
                        <div className="bg-white/50 border-t border-white/30">
                          <div className="flex text-base py-5 px-6 h-16 items-center gap-1">
                            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                              const isJanuary2025 = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === 2025
                              const value = isJanuary2025 ? (i < 12 ? '6' : '') : (Math.random() < 0.7 ? String(Math.floor(Math.random() * 8) + 4) : '')
                              return (
                                <div key={i} className="w-10 text-center text-gray-600 font-medium">
                                  {value}
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex text-base py-5 px-6 h-16 items-center gap-1">
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
                                <div key={i} className="w-10 text-center text-gray-600 font-medium">
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

        {viewMode === "create-shift" && (
          <div className="space-y-6">
            {/* Create New Bring-Shift */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Create New Bring-Shift</h3>
                <p className="text-gray-600 text-lg">Add a new shift that needs to be filled by employees</p>
              </div>
              
              <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="shift-date" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Shift Date
                    </Label>
                    <Input
                      id="shift-date"
                      type="date"
                      value={newShiftDate}
                      onChange={(e) => setNewShiftDate(e.target.value)}
                      className="h-14 px-4 py-3 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      placeholder="Select date"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="shift-type" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Shift Type
                    </Label>
                    <Select value={newShiftType} onValueChange={setNewShiftType}>
                      <SelectTrigger className="h-14 px-4 py-3 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" size="default">
                        <SelectValue placeholder="Select shift type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early">Early Shift (6:00 - 14:00)</SelectItem>
                        <SelectItem value="late">Late Shift (14:00 - 22:00)</SelectItem>
                        <SelectItem value="night">Night Shift (22:00 - 6:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="qualification" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      Qualification
                    </Label>
                    <Select value={newShiftQualification} onValueChange={setNewShiftQualification}>
                      <SelectTrigger className="h-14 px-4 py-3 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" size="default">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">Q1 - Basic Level</SelectItem>
                        <SelectItem value="q2">Q2 - Intermediate Level</SelectItem>
                        <SelectItem value="q3">Q3 - Advanced Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-6"></div> {/* Spacer to align with labels */}
                    <Button 
                      onClick={handleCreateShift} 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full h-14 rounded-full"
                      disabled={!newShiftDate || !newShiftType || !newShiftQualification}
                    >
                      Publish Shift
                    </Button>
                  </div>
                </div>
                
                {newShiftDate && newShiftType && newShiftQualification && (
                  <div className="mt-8 p-6 glass-effect rounded-2xl border-white/30 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                    <div className="flex items-center gap-3 text-base text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Ready to publish:</span>
                      <span>{newShiftType} on {newShiftDate} requiring {newShiftQualification} qualification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Open Bring-Shifts Modal */}
      <Dialog open={showOpenShiftsModal} onOpenChange={setShowOpenShiftsModal}>
        <DialogContent className="w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
          <DialogHeader className="border-b border-gray-100 pb-6">
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
              <div key={shift.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 w-full hover:bg-gray-100 transition-colors duration-200">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-3 bg-orange-100 rounded-xl flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-900">{shift.shiftType}</h4>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 text-sm font-medium rounded-full">
                        {shift.qualification}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-sm font-medium rounded-full">
                        Open
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-6">
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Date:</span> {shift.date}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Reason:</span> {shift.reason}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Status:</span> <span className="text-orange-600 font-medium">Requires immediate assignment</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleAssignShift(shift.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-base font-semibold flex-1 sm:flex-none rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Assign Employee
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 text-base font-semibold flex-1 sm:flex-none rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Eye className="w-5 h-5 mr-2" />
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
        <DialogContent className="w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
          <DialogHeader className="border-b border-gray-100 pb-6">
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
              <div key={shift.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 w-full hover:bg-gray-100 transition-colors duration-200">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-900">{shift.employeeName}</h4>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1 text-sm font-medium rounded-full">{shift.employeeId}</Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium rounded-full">
                        {shift.shiftType}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm font-medium rounded-full">
                        In Progress
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-6">
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Time:</span> {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Location:</span> {shift.location}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-semibold text-gray-900">Qualification:</span> {shift.qualification}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-base text-gray-700 mb-3">
                    <span className="font-semibold text-gray-900">Shift Progress</span>
                    <span className="font-bold text-blue-600">{shift.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                      style={{width: `${shift.progress}%`}}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleContactEmployee(shift.employeeId)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 text-base font-semibold flex-1 sm:flex-none rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call
                  </Button>
                  <Button 
                    onClick={() => handleContactEmployee(shift.employeeId)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 text-base font-semibold flex-1 sm:flex-none rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Message
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 text-base font-semibold flex-1 sm:flex-none rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Eye className="w-5 h-5 mr-2" />
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
