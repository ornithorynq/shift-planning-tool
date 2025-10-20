"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  ChevronLeft,
  Plus,
  Trash2,
  Award,
  UserCheck,
  UserX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

type Employee = {
  id: string
  name: string
  employeeId: string
  email: string
  currentLocation: string | null
  currentGroup: string | null
  qualifications: string[]
  status: "active" | "inactive"
  hireDate: string
}

type Qualification = {
  id: string
  code: string
  name: string
  description: string
  level: "basic" | "intermediate" | "advanced"
}

export default function QualificationsPage() {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const goBack = () => {
    router.push("/shift-manager")
  }

  // Mock data for employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Employee AA",
      employeeId: "EMP001",
      email: "aa@company.com",
      currentLocation: "1",
      currentGroup: "A",
      qualifications: ["Q1", "Q2"],
      status: "active",
      hireDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Employee AB",
      employeeId: "EMP002",
      email: "ab@company.com",
      currentLocation: "1",
      currentGroup: "B",
      qualifications: ["Q1"],
      status: "active",
      hireDate: "2023-02-20"
    },
    {
      id: "3",
      name: "Employee AC",
      employeeId: "EMP003",
      email: "ac@company.com",
      currentLocation: "2",
      currentGroup: "A",
      qualifications: ["Q2", "Q3"],
      status: "active",
      hireDate: "2023-03-10"
    },
    {
      id: "4",
      name: "Employee AD",
      employeeId: "EMP004",
      email: "ad@company.com",
      currentLocation: "1",
      currentGroup: "C",
      qualifications: ["Q1"],
      status: "active",
      hireDate: "2024-01-05"
    },
    {
      id: "5",
      name: "Employee AE ID",
      employeeId: "EMP005",
      email: "ae@company.com",
      currentLocation: "2",
      currentGroup: "B",
      qualifications: ["Q2"],
      status: "active",
      hireDate: "2024-02-12"
    },
    {
      id: "6",
      name: "Employee AF",
      employeeId: "EMP006",
      email: "af@company.com",
      currentLocation: "1",
      currentGroup: "C",
      qualifications: ["Q1", "Q3"],
      status: "active",
      hireDate: "2024-03-01"
    },
    {
      id: "7",
      name: "Employee AG",
      employeeId: "EMP007",
      email: "ag@company.com",
      currentLocation: "2",
      currentGroup: "A",
      qualifications: ["Q2"],
      status: "active",
      hireDate: "2024-03-15"
    },
    {
      id: "8",
      name: "Employee AH",
      employeeId: "EMP008",
      email: "ah@company.com",
      currentLocation: "1",
      currentGroup: "D",
      qualifications: ["Q1", "Q2"],
      status: "active",
      hireDate: "2024-04-01"
    },
    {
      id: "9",
      name: "Employee AI",
      employeeId: "EMP009",
      email: "ai@company.com",
      currentLocation: "2",
      currentGroup: "E",
      qualifications: ["Q3"],
      status: "active",
      hireDate: "2024-04-10"
    },
    {
      id: "10",
      name: "Employee AJ",
      employeeId: "EMP010",
      email: "aj@company.com",
      currentLocation: "1",
      currentGroup: "D",
      qualifications: ["Q1"],
      status: "active",
      hireDate: "2024-04-20"
    },
    {
      id: "11",
      name: "Employee AK",
      employeeId: "EMP011",
      email: "ak@company.com",
      currentLocation: "2",
      currentGroup: "E",
      qualifications: ["Q2", "Q3"],
      status: "active",
      hireDate: "2024-05-01"
    },
    {
      id: "12",
      name: "Employee AL",
      employeeId: "EMP012",
      email: "al@company.com",
      currentLocation: "1",
      currentGroup: "B",
      qualifications: ["Q1", "Q3"],
      status: "active",
      hireDate: "2024-05-15"
    }
  ])

  // Mock data for qualifications
  const [qualifications] = useState<Qualification[]>([
    {
      id: "1",
      code: "Q1",
      name: "Basic Operations",
      description: "Fundamental equipment operation and safety procedures",
      level: "basic"
    },
    {
      id: "2",
      code: "Q2",
      name: "Advanced Operations",
      description: "Complex equipment operation and troubleshooting",
      level: "intermediate"
    },
    {
      id: "3",
      code: "Q3",
      name: "Expert Operations",
      description: "Master-level operations and training capabilities",
      level: "advanced"
    }
  ])

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleQualificationSelection = (qualificationId: string) => {
    setSelectedQualifications(prev => 
      prev.includes(qualificationId) 
        ? prev.filter(id => id !== qualificationId)
        : [...prev, qualificationId]
    )
  }

  const handleAssignQualifications = () => {
    if (selectedEmployees.length > 0 && selectedQualifications.length > 0) {
      const qualCodes = selectedQualifications.map(qualId => {
        const qual = qualifications.find(q => q.id === qualId)
        return qual?.code
      }).filter(Boolean)
      
      let assignedCount = 0
      let skippedCount = 0
      
      setEmployees(employees.map(emp => {
        if (selectedEmployees.includes(emp.id)) {
          const newQualifications = [...emp.qualifications]
          qualCodes.forEach(code => {
            if (code && !newQualifications.includes(code)) {
              newQualifications.push(code)
              assignedCount++
            } else if (code && newQualifications.includes(code)) {
              skippedCount++
            }
          })
          return { ...emp, qualifications: newQualifications }
        }
        return emp
      }))
      
      setSelectedEmployees([])
      setSelectedQualifications([])
      
      // Enhanced feedback
      const message = `✅ Successfully assigned ${assignedCount} qualification(s) to ${selectedEmployees.length} employee(s)${skippedCount > 0 ? `\n⚠️ ${skippedCount} qualification(s) were already assigned` : ''}`
      console.log(message)
      alert(message)
    }
  }

  const handleRemoveQualification = (employeeId: string, qualificationCode: string) => {
    const employee = employees.find(emp => emp.id === employeeId)
    const qualification = qualifications.find(qual => qual.code === qualificationCode)
    
    if (!employee || !qualification) return
    
    // Check if qualification exists
    if (!employee.qualifications.includes(qualificationCode)) {
      return
    }
    
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, qualifications: emp.qualifications.filter(q => q !== qualificationCode) }
        : emp
    ))
    
    // Show success feedback
    const employeeName = employee.name
    const qualificationName = qualification.name
    console.log(`🗑️ Successfully removed ${qualificationCode} (${qualificationName}) from ${employeeName}`)
  }

  const handleQuickAssign = (employeeId: string, qualificationCode: string) => {
    const employee = employees.find(emp => emp.id === employeeId)
    const qualification = qualifications.find(qual => qual.code === qualificationCode)
    
    if (!employee || !qualification) return
    
    // Check if already assigned
    if (employee.qualifications.includes(qualificationCode)) {
      return
    }
    
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const newQualifications = [...emp.qualifications, qualificationCode]
        return { ...emp, qualifications: newQualifications }
      }
      return emp
    }))
    
    // Show success feedback
    const employeeName = employee.name
    const qualificationName = qualification.name
    console.log(`✅ Successfully assigned ${qualificationCode} (${qualificationName}) to ${employeeName}`)
  }

  // Get unique groups from employees
  const availableGroups = Array.from(new Set(employees.map(emp => emp.currentGroup).filter(Boolean))).sort()
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGroup = selectedGroup === "all" || emp.currentGroup === selectedGroup
    
    return matchesSearch && matchesGroup
  })

  // Get group statistics
  const groupStats = availableGroups.reduce((acc, group) => {
    const groupEmployees = employees.filter(emp => emp.currentGroup === group)
    acc[group] = {
      total: groupEmployees.length,
      active: groupEmployees.filter(emp => emp.status === 'active').length,
      withQualifications: groupEmployees.filter(emp => emp.qualifications.length > 0).length
    }
    return acc
  }, {} as Record<string, { total: number; active: number; withQualifications: number }>)

  const getQualificationInfo = (code: string) => {
    return qualifications.find(q => q.code === code)
  }

  const getQualificationColor = (level: string) => {
    switch (level) {
      case "basic": return "bg-green-100 text-green-800 border-green-200"
      case "intermediate": return "bg-blue-100 text-blue-800 border-blue-200"
      case "advanced": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
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
                  <h1 className="text-4xl font-bold text-gray-900">Employee Qualifications</h1>
                  <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                    Manager Portal
                  </div>
                </div>
                <p className="text-gray-600 text-lg">Manage employee qualifications and certifications</p>
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
        {/* Group Filter */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Filter by Group</h3>
                <p className="text-gray-600 text-lg">Switch between different employee groups to view their qualifications</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedGroup("all")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-out shadow-lg hover:shadow-xl ${
                  selectedGroup === "all"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-white/30"
                }`}
                style={{borderRadius: '9999px'}}
              >
                All Groups ({employees.length})
              </button>
              {availableGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-out shadow-lg hover:shadow-xl ${
                    selectedGroup === group
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-105"
                      : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-white/30"
                  }`}
                  style={{borderRadius: '9999px'}}
                >
                  Group {group} ({groupStats[group]?.total || 0})
                </button>
              ))}
            </div>
            
            {/* Group Statistics */}
            {selectedGroup !== "all" && groupStats[selectedGroup] && (
              <div className="mt-6 glass-effect rounded-2xl border-white/30 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{groupStats[selectedGroup].total}</div>
                    <div className="text-blue-700 font-semibold">Total Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{groupStats[selectedGroup].active}</div>
                    <div className="text-green-700 font-semibold">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{groupStats[selectedGroup].withQualifications}</div>
                    <div className="text-purple-700 font-semibold">With Qualifications</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Employee List */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Employee Qualifications
                  {selectedGroup !== "all" && (
                    <span className="text-xl font-normal text-blue-600 ml-3">
                      - Group {selectedGroup}
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 text-lg">
                  {selectedGroup === "all" 
                    ? "View and manage individual employee qualifications across all groups"
                    : `View and manage qualifications for employees in Group ${selectedGroup}`
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                    {selectedEmployees.length} Selected
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                    {filteredEmployees.length} Showing
                  </div>
                </div>
              </div>
            </div>
          
          <div className="space-y-6">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                <div className="flex items-start gap-6">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => handleEmployeeSelection(employee.id)}
                      className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{employee.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                          {employee.employeeId}
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                          {employee.status}
                        </div>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                          Group {employee.currentGroup}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-600 mb-6">
                      <span className="font-semibold">Email:</span> {employee.email} | 
                      <span className="font-semibold ml-2">Hire Date:</span> {employee.hireDate}
                    </div>
                    
                    {/* Current Qualifications */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg font-bold text-gray-700">Current Qualifications:</span>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                          {employee.qualifications.length} assigned
                        </div>
                      </div>
                      {employee.qualifications.length === 0 ? (
                        <div className="text-gray-500 italic bg-gray-100 rounded-lg p-4 text-center">
                          No qualifications assigned yet
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {employee.qualifications.map((qualCode) => {
                            const qualInfo = getQualificationInfo(qualCode)
                            return (
                              <div key={qualCode} className="relative group">
                                <div className={`${getQualificationColor(qualInfo?.level || 'basic')} px-4 py-2 rounded-full shadow-sm font-semibold text-sm flex items-center gap-2`}>
                                  <Award className="w-4 h-4" />
                                  {qualCode} - {qualInfo?.name}
                                  <button
                                    onClick={() => handleRemoveQualification(employee.id, qualCode)}
                                    className="ml-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg leading-none"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Assign Buttons */}
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-700">Quick Assign:</span>
                      <div className="flex flex-wrap gap-3">
                        {qualifications.map((qual) => (
                          <Button
                            key={qual.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAssign(employee.id, qual.code)}
                            disabled={employee.qualifications.includes(qual.code)}
                            className={`h-10 px-4 text-sm font-semibold rounded-full transition-all duration-200 ${
                              employee.qualifications.includes(qual.code)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white/80 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 shadow-sm hover:shadow-md"
                            }`}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            {qual.code}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h4>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Qualifications Reference */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Qualifications</h3>
              <p className="text-gray-600">Reference guide for all available qualifications</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {qualifications.map((qual) => (
              <div key={qual.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Award className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">{qual.code}</h4>
                      <Badge 
                        variant="outline" 
                        className={getQualificationColor(qual.level)}
                      >
                        {qual.level}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">{qual.name}</h5>
                    <p className="text-sm text-gray-600">{qual.description}</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {employees.filter(emp => emp.qualifications.includes(qual.code)).length} employees have this qualification
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
