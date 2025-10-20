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
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">HR Portal</h1>
                <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                  HR Portal
                </div>
              </div>
              <p className="text-gray-600 text-lg">Welcome, HR Manager. Focus on employee management and compliance oversight.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-bold text-lg">HR Manager</div>
                <div className="text-sm text-gray-500">ID: 1001 | Department: HR</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleLogout} className="btn-modern border-white/30 text-gray-700 hover:bg-white/20 hover:border-white/40 shadow-lg">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto section-padding">
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
              onClick={() => setViewMode("reports")}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative ${
                viewMode === "reports" 
                  ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
              }`}
            >
              Shift Matrix
            </button>
          </div>
        </div>

        {viewMode === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Currently Sick Employees Card */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-red-50/50 to-orange-50/50 hover:shadow-modern-lg hover:border-red-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-red-200 rounded-xl shadow-sm">
                <ArrowDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Critical
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-600 mb-3">6</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Employees Currently Sick</div>
              <div className="text-gray-600 text-lg">(Overall Location)</div>
            </div>
          </div>

          {/* Open Vacation Requests Card */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Pending
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-3">5</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Open Vacation Requests</div>
              <div className="text-gray-600 text-lg">(For Approval)</div>
            </div>
          </div>
        </div>

        {/* Planning Efficiency Chart Section */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Planning Efficiency: Planned vs. Actual Shift Staffing</h3>
                <p className="text-gray-600 text-lg">January 2025 Performance Analysis</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="status-success px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                  Jan 2025
                </div>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="glass-effect rounded-3xl border-white/20 p-10 bg-white/60 backdrop-blur-xl">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 tracking-tight">Staffing Efficiency Trends</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700 font-medium text-sm">Planned</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700 font-medium text-sm">Actual</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700 font-medium text-sm">Efficiency</span>
                    </div>
                  </div>
                </div>
                
                {/* Apple-style Chart */}
                <div className="relative h-[32rem] bg-white/80 rounded-2xl p-8 pb-16 border border-gray-100/50 shadow-sm">
                  {/* Y-axis labels */}
                  <div className="absolute left-4 top-8 bottom-20 flex flex-col justify-between text-sm text-gray-500 font-medium">
                    <span>100%</span>
                    <span>90%</span>
                    <span className="relative -top-4">80%</span>
                    <span className="relative -top-8">70%</span>
                  </div>
                  
                  {/* Chart area with extra bottom padding for 70% line */}
                  <div className="ml-16 h-full relative pb-3">
                    {/* Subtle grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="border-t border-gray-100/60"></div>
                      <div className="border-t border-gray-100/60"></div>
                      <div className="border-t border-gray-100/60 relative -top-4"></div>
                      <div className="border-t border-gray-100/60 relative -top-8"></div>
                    </div>
                    
                    {/* Chart bars area - positioned to start from 70% line */}
                    <div className="absolute inset-0 flex items-end justify-center gap-16 px-10" style={{paddingBottom: '0px'}}>
                      {/* Week 1 - 96.5% efficiency */}
                      <div className="flex flex-col items-center w-32">
                        <div className="flex items-end gap-3 mb-4">
                          <div className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-lg" style={{height: '340px'}}></div>
                          <div className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg shadow-lg" style={{height: '310px'}}></div>
                        </div>
                        <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">96.5%</div>
                      </div>
                      
                      {/* Week 2 - 96.6% efficiency */}
                      <div className="flex flex-col items-center w-32">
                        <div className="flex items-end gap-3 mb-4">
                          <div className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-lg" style={{height: '340px'}}></div>
                          <div className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg shadow-lg" style={{height: '315px'}}></div>
                        </div>
                        <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">96.6%</div>
                      </div>
                      
                      {/* Week 3 - 96.7% efficiency */}
                      <div className="flex flex-col items-center w-32">
                        <div className="flex items-end gap-3 mb-4">
                          <div className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-lg" style={{height: '340px'}}></div>
                          <div className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg shadow-lg" style={{height: '320px'}}></div>
                        </div>
                        <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">96.7%</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* X-axis labels positioned under each bar */}
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-16 px-10">
                    <div className="flex flex-col items-center w-32">
                      <div className="text-sm text-gray-600 font-medium">Week 1</div>
                    </div>
                    <div className="flex flex-col items-center w-32">
                      <div className="text-sm text-gray-600 font-medium">Week 2</div>
                    </div>
                    <div className="flex flex-col items-center w-32">
                      <div className="text-sm text-gray-600 font-medium">Week 3</div>
                    </div>
                  </div>
                </div>
                
                {/* Apple-style Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">96.6%</div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">Average Efficiency</div>
                    <div className="text-sm text-gray-500 font-medium">January 2025</div>
                  </div>
                  
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-2 tracking-tight">+2.3%</div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">Improvement</div>
                    <div className="text-sm text-gray-500 font-medium">vs December 2024</div>
                  </div>
                  
                  <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl text-center">
                    <div className="text-4xl font-bold text-amber-600 mb-2 tracking-tight">96.7%</div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">Best Month</div>
                    <div className="text-sm text-gray-500 font-medium">Week 3, Jan 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

            {/* Data Management & Reporting Section */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Data Management & Reporting</h3>
                    <p className="text-gray-600 text-lg">Export reports and manage employee data</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-4 bg-purple-200 rounded-xl shadow-sm">
                      <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="status-info px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      Reports
                    </div>
                  </div>
                </div>
                
                <div className="glass-effect rounded-2xl border-white/20 p-8 bg-white/60 backdrop-blur-xl">
                  <div className="flex gap-6">
                    <Button className="btn-modern bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-14 px-8" style={{borderRadius: '9999px'}}>
                      <Download className="w-5 h-5 mr-3" />
                      Export Monthly Report for SAGE (Excel/CSV)
                    </Button>
                    <Button variant="outline" className="btn-modern border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg h-14 px-8" style={{borderRadius: '9999px'}}>
                      <FileSpreadsheet className="w-5 h-5 mr-3" />
                      Detailed Absence Report (Excel)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Vacation Requests Section */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Open Vacation Requests (HR Approval)</h3>
                    <p className="text-gray-600 text-lg">Pending requests requiring HR approval</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                      3 Pending
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Request Card 1 */}
                  <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-slate-200 rounded-xl shadow-sm">
                          <Users className="w-8 h-8 text-slate-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-bold text-gray-900">M. Musterfrau</h4>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                              Waiting for Shift Manager
                            </Badge>
                          </div>
                          <div className="text-base text-gray-700 mb-3">
                            <span className="font-semibold text-gray-900">Request Period:</span> 20.12. - 24.12.2024
                          </div>
                          <div className="text-sm text-gray-500">
                            Submitted 2 days ago • 5 days requested
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-semibold text-gray-700 mb-1">Pending Review</div>
                          <div className="text-sm text-gray-500">Awaiting shift manager</div>
                        </div>
                        <Button variant="outline" size="sm" className="btn-modern border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Request Card 2 */}
                  <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                          <Users className="w-8 h-8 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-bold text-gray-900">J. Schmidt</h4>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                              Waiting for HR Approval
                            </Badge>
                          </div>
                          <div className="text-base text-gray-700 mb-3">
                            <span className="font-semibold text-gray-900">Request Period:</span> 01.03. - 05.03.2025
                          </div>
                          <div className="text-sm text-gray-500">
                            Submitted 1 day ago • 5 days requested
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-semibold text-blue-700 mb-1">Ready for Approval</div>
                          <div className="text-sm text-gray-500">Shift manager approved</div>
                        </div>
                        <Button className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                          Review & Approve
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Request Card 3 */}
                  <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                          <Users className="w-8 h-8 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-bold text-gray-900">T. Müller</h4>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                              Waiting for HR Approval
                            </Badge>
                          </div>
                          <div className="text-base text-gray-700 mb-3">
                            <span className="font-semibold text-gray-900">Request Period:</span> 08.11. - 12.11.2025
                          </div>
                          <div className="text-sm text-gray-500">
                            Submitted 3 hours ago • 5 days requested
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-semibold text-blue-700 mb-1">Ready for Approval</div>
                          <div className="text-sm text-gray-500">Shift manager approved</div>
                        </div>
                        <Button className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                          Review & Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "reports" && (
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
      </main>
    </div>
  )
}
