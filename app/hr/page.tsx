"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft, Users, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle, LogOut, Calendar, ArrowDown, FileSpreadsheet, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function HRPage() {
  const [viewMode, setViewMode] = useState<"overview" | "reports">("overview")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)) // January 2025
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    window.location.href = "/"
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

  const exportToExcel = () => {
    // Simulate Excel export
    const data = {
      shifts: employeeData,
      month: getMonthName(currentMonth)
    }
    console.log("Exporting data to Excel:", data)
    // In a real app, this would trigger a download
    alert("Excel export functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Portal</h1>
              <p className="text-gray-600">Welcome, HR Manager. Focus on employee management and compliance oversight.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-medium">HR Manager</div>
                <div className="text-sm text-gray-500">ID: 1001 | Department: HR</div>
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
              onClick={() => setViewMode("reports")}
              className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                viewMode === "reports" 
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
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Currently Sick Employees Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ArrowDown className="w-6 h-6 text-red-600" />
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Critical
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">6</div>
                <div className="text-xl font-semibold text-gray-900 mb-1">Employees Currently Sick</div>
                <div className="text-sm text-gray-600">(Overall Location)</div>
              </div>
            </div>
          </div>

          {/* Open Vacation Requests Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Pending
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-xl font-semibold text-gray-900 mb-1">Open Vacation Requests</div>
                <div className="text-sm text-gray-600">(For Approval)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Efficiency Chart Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Planning Efficiency: Planned vs. Actual Shift Staffing</h3>
              <p className="text-gray-600">(Last Quarter)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="w-full h-96 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-lg font-medium mb-2">[Chart: Simulated representation of planning efficiency and occupancy rate]</div>
              <div className="text-sm">Chart placeholder for planning efficiency visualization</div>
            </div>
          </div>
            </div>

            {/* Data Management & Reporting Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Management & Reporting</h3>
                  <p className="text-gray-600">Export reports and manage employee data</p>
                </div>
                        <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                        </div>
              
              <div className="flex gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  Export Monthly Report for SAGE (Excel/CSV)
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Detailed Absence Report (Excel)
                        </Button>
              </div>
            </div>

            {/* Open Vacation Requests Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Open Vacation Requests (HR Approval)</h3>
                  <p className="text-gray-600">Pending requests requiring HR approval</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    3 Pending
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Request Card 1 */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-200 rounded-lg">
                        <Users className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">M. Musterfrau</h4>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Waiting for Shift Manager
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Request Period:</span> 20.12. - 24.12.2024
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted 2 days ago • 5 days requested
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700 mb-1">Pending Review</div>
                        <div className="text-xs text-gray-500">Awaiting shift manager</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-50">
                        View Details
                            </Button>
                          </div>
                  </div>
                </div>

                {/* Request Card 2 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-200 rounded-lg">
                        <Users className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">J. Schmidt</h4>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Waiting for HR Approval
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Request Period:</span> 01.03. - 05.03.2025
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted 1 day ago • 5 days requested
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-700 mb-1">Ready for Approval</div>
                        <div className="text-xs text-gray-500">Shift manager approved</div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        Review & Approve
                      </Button>
                    </div>
            </div>
            </div>

                {/* Request Card 3 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-200 rounded-lg">
                        <Users className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">T. Müller</h4>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Waiting for HR Approval
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Request Period:</span> 08.11. - 12.11.2025
                          </div>
                        <div className="text-xs text-gray-500">
                          Submitted 3 hours ago • 5 days requested
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-700 mb-1">Ready for Approval</div>
                        <div className="text-xs text-gray-500">Shift manager approved</div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        Review & Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                        </div>
        )}

        {viewMode === "reports" && (
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
    </div>
  )
}
