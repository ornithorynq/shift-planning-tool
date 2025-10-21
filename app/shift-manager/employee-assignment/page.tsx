"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  ChevronLeft,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  MapPin,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Employee = {
  id: string
  name: string
  employeeId: string
  email: string
  qualifications: string[]
  status: "active" | "inactive"
  availability: "available" | "busy" | "off"
}

export default function EmployeeAssignmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for tab switching
  const [activeTab, setActiveTab] = useState<"shifts" | "groups">("shifts")
  
  // State for shift selection
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [shiftNeeds, setShiftNeeds] = useState<{
    needsMore: boolean
    required: number
    assigned: number
    qualification: string
  } | null>(null)
  
  // Open bring shifts data
  const [openBringShifts] = useState([
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
  
  // State for group/location assignment
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [locationNeeds, setLocationNeeds] = useState<{
    needsMore: boolean
    required: number
    assigned: number
    locationName: string
    groupName: string
  } | null>(null)

  // Mock data for employees
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Smith",
      employeeId: "EMP001",
      email: "john@company.com",
      qualifications: ["Q1", "Q2"],
      status: "active",
      availability: "available"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      employeeId: "EMP002",
      email: "sarah@company.com",
      qualifications: ["Q1"],
      status: "active",
      availability: "available"
    },
    {
      id: "3",
      name: "Mike Wilson",
      employeeId: "EMP003",
      email: "mike@company.com",
      qualifications: ["Q2", "Q3"],
      status: "active",
      availability: "busy"
    },
    {
      id: "4",
      name: "Lisa Brown",
      employeeId: "EMP004",
      email: "lisa@company.com",
      qualifications: ["Q1", "Q3"],
      status: "active",
      availability: "available"
    }
  ])

  // Locations and groups data from the existing app
  const [locations] = useState([
    { id: "1", name: "Main Plant", address: "Production Line A & Quality Control", capacity: 30, currentEmployees: 22 },
    { id: "2", name: "Secondary Facility", address: "Warehouse Operations", capacity: 20, currentEmployees: 12 }
  ])

  const [groups] = useState([
    { id: "1", name: "Group A", locationId: "1", maxCapacity: 8, currentCount: 6 },
    { id: "2", name: "Group B", locationId: "1", maxCapacity: 6, currentCount: 4 },
    { id: "3", name: "Group C", locationId: "1", maxCapacity: 8, currentCount: 5 },
    { id: "4", name: "Group D", locationId: "2", maxCapacity: 10, currentCount: 7 },
    { id: "5", name: "Group E", locationId: "2", maxCapacity: 6, currentCount: 4 }
  ])

  // Handle URL parameters for open shift requests
  useEffect(() => {
    const shiftId = searchParams.get('shiftId')
    const shiftType = searchParams.get('shiftType')
    const shiftDate = searchParams.get('shiftDate')
    const qualification = searchParams.get('qualification')
    const reason = searchParams.get('reason')
    
    if (shiftId && shiftType && shiftDate && qualification) {
      // Auto-populate the shift selection form
      setSelectedDate(shiftDate)
      setSelectedTimeSlot(shiftType.toLowerCase().replace(' ', ''))
      
      // Auto-check shift needs
      setTimeout(() => {
        checkShiftNeeds()
      }, 100)
    }
  }, [searchParams])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const goBack = () => {
        router.push("/shift-manager")
      }

  const checkShiftNeeds = () => {
    if (!selectedTimeSlot) return
    
    // Mock shift needs check
    const mockNeeds = {
      early: { needsMore: true, required: 4, assigned: 2, qualification: "Q1" },
      earlyshift: { needsMore: true, required: 4, assigned: 2, qualification: "Q1" },
      late: { needsMore: true, required: 4, assigned: 1, qualification: "Q2" },
      lateshift: { needsMore: true, required: 4, assigned: 1, qualification: "Q2" },
      night: { needsMore: true, required: 2, assigned: 0, qualification: "Q3" },
      nightshift: { needsMore: true, required: 2, assigned: 0, qualification: "Q3" }
    }
    
    setShiftNeeds(mockNeeds[selectedTimeSlot as keyof typeof mockNeeds])
  }

  const handleAssignEmployee = (employeeId: string) => {
    // Mock assignment logic
    console.log(`Assigning employee ${employeeId} to shift`)
    // Update shift needs to reflect the new assignment
    if (shiftNeeds) {
      setShiftNeeds({
        ...shiftNeeds,
        assigned: shiftNeeds.assigned + 1
      })
    }
  }

  const handleRemoveEmployee = (employeeId: string) => {
    // Mock removal logic
    console.log(`Removing employee ${employeeId} from shift`)
  }

  const checkLocationNeeds = () => {
    if (!selectedLocation || !selectedGroup) return
    
    const location = locations.find(loc => loc.id === selectedLocation)
    const group = groups.find(grp => grp.id === selectedGroup)
    
    if (!location || !group) return
    
    setLocationNeeds({
      needsMore: group.currentCount < group.maxCapacity,
      required: group.maxCapacity,
      assigned: group.currentCount,
      locationName: location.name,
      groupName: group.name
    })
  }

  const handleAssignToLocation = (employeeId: string) => {
    // Mock assignment logic
    console.log(`Assigning employee ${employeeId} to ${selectedLocation} - ${selectedGroup}`)
    // Update location needs to reflect the new assignment
    if (locationNeeds) {
      setLocationNeeds({
        ...locationNeeds,
        assigned: locationNeeds.assigned + 1
      })
    }
  }

  const handleRemoveFromLocation = (employeeId: string) => {
    // Mock removal logic
    console.log(`Removing employee ${employeeId} from location/group`)
  }

  const handleQuickAssignFromOpenShift = (shiftId: string) => {
    // Find the open shift and auto-populate the form
    const openShift = openBringShifts.find(shift => shift.id === shiftId)
    if (openShift) {
      setSelectedDate(openShift.date)
      setSelectedTimeSlot(openShift.shiftType.toLowerCase().replace(' shift', ''))
      // Auto-trigger the shift check
      setTimeout(() => {
        checkShiftNeeds()
      }, 100)
    }
  }

  const getAvailableEmployees = () => {
    if (!shiftNeeds) return []
    
    return employees.filter(emp => 
      emp.qualifications.includes(shiftNeeds.qualification) && 
      emp.availability === "available"
    )
  }

  const getAvailableEmployeesForLocation = () => {
    if (!locationNeeds) return []
    
    return employees.filter(emp => 
      emp.availability === "available"
    )
  }

  const getGroupsForLocation = (locationId: string) => {
    return groups.filter(group => group.locationId === locationId)
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={goBack}
                  className="btn-modern hover:bg-white/30 text-gray-700 hover:text-gray-900 mr-4"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
                <h1 className="text-4xl font-bold text-gray-900">Employee Assignment</h1>
                  <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                    Manager Portal
                </div>
              </div>
              <p className="text-gray-600 text-lg">Assign employees to specific shifts, locations and groups</p>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto section-padding relative z-10">
        <div className="space-y-8">
          {/* Tab Switcher */}
            <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
            <div className="flex border-b border-white/30 overflow-x-auto">
              <button 
                onClick={() => setActiveTab("shifts")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative border-r border-gray-200/50 ${
                  activeTab === "shifts" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                Shifts
              </button>
              <button 
                onClick={() => setActiveTab("groups")}
                className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === "groups" 
                    ? "text-blue-600 bg-blue-100/50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                }`}
              >
                Groups and Locations
              </button>
            </div>
                  </div>

          {/* Shifts Tab Content */}
          {activeTab === "shifts" && (
            <div className="space-y-8">
              {/* Open Bring Shifts Section */}
              {openBringShifts.length > 0 && (
                <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Open Bring-Shifts Requiring Attention</h3>
                        <p className="text-gray-600">Quickly assign employees to urgent shifts that need immediate coverage</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-3 bg-orange-100 rounded-xl shadow-sm">
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                      </div>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold rounded-full">
                          {openBringShifts.length} Urgent
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {openBringShifts.map((shift) => (
                        <div key={shift.id} className="glass-effect rounded-2xl border-white/30 p-6 bg-gradient-to-r from-orange-50/50 to-red-50/50 hover:shadow-modern-lg hover:border-orange-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-200 rounded-lg shadow-sm">
                                <Clock className="w-5 h-5 text-orange-700" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{shift.shiftType}</h4>
                                <p className="text-sm text-gray-600">{shift.date}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 px-3 py-1 text-sm font-semibold rounded-full">
                              {shift.qualification}
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-semibold">Reason:</span> {shift.reason}
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                              <AlertCircle className="w-4 h-4" />
                              Requires immediate assignment
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => handleQuickAssignFromOpenShift(shift.id)}
                            className="btn-modern bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full"
                            style={{borderRadius: '9999px'}}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Quick Assign Employee
                          </Button>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          )}

              {/* Shift Selection Form */}
              <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">Assign Employees to Shifts</h2>
                      <p className="text-gray-600 text-lg">Select employees and assign them to specific shifts</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                  <div className="space-y-3">
                        <Label htmlFor="shift-date" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Date
                    </Label>
                    <Input
                          id="shift-date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                      className="modern-input h-14 px-4 py-3 text-base"
                    />
                  </div>
                  
                  <div className="space-y-3">
                        <Label htmlFor="shift-time" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          Time Slot
                    </Label>
                        <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                            <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="early">Early Shift (6:00-14:00)</SelectItem>
                            <SelectItem value="late">Late Shift (14:00-22:00)</SelectItem>
                            <SelectItem value="night">Night Shift (22:00-6:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col justify-end h-full">
                    <div className="h-6"></div>
                    <Button 
                          onClick={checkShiftNeeds}
                          disabled={!selectedTimeSlot}
                          className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{borderRadius: '9999px'}}
                    >
                          <Users className="w-5 h-5 mr-2" />
                          Check Shift Status
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* Shift Status Display */}
              {shiftNeeds && (
                <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Shift Status</h3>
                        <p className="text-gray-600">Current staffing for {selectedTimeSlot} shift on {selectedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {shiftNeeds.needsMore ? (
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-700 mb-2">{shiftNeeds.assigned}</div>
                          <div className="text-sm font-semibold text-gray-700">Currently Assigned</div>
                        </div>
                      </div>
                      
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-700 mb-2">{shiftNeeds.required}</div>
                          <div className="text-sm font-semibold text-gray-700">Required</div>
                        </div>
                      </div>
                      
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-700 mb-2">{shiftNeeds.required - shiftNeeds.assigned}</div>
                          <div className="text-sm font-semibold text-gray-700">Still Needed</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold rounded-full">
                        Requires {shiftNeeds.qualification} Qualification
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Employees Section */}
              {shiftNeeds && (
                <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Available Employees</h3>
                        <p className="text-gray-600 text-lg">Select employees to assign to this shift</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                          {shiftNeeds.qualification} Qualified
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                          {getAvailableEmployees().length} Available
                  </Badge>
                </div>
              </div>
              
                    <div className="space-y-4">
                      {getAvailableEmployees().map((employee) => (
                        <div key={employee.id} className="glass-effect rounded-2xl border-white/30 p-6 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-200 rounded-xl shadow-sm">
                                <Users className="w-6 h-6 text-blue-700" />
                        </div>
                        <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                  <h4 className="text-lg font-bold text-gray-900">{employee.name}</h4>
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-semibold rounded-full">
                                {employee.employeeId}
                              </Badge>
                                  <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full">
                                    Available
                                </Badge>
                            </div>
                                <div className="text-sm text-gray-700 mb-2">
                                  <span className="font-semibold">Email:</span> {employee.email}
                          </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Qualifications:</span> {employee.qualifications.join(", ")}
                          </div>
                            </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button 
                                size="sm"
                                onClick={() => handleAssignEmployee(employee.id)}
                                className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                style={{borderRadius: '9999px'}}
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign to Shift
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveEmployee(employee.id)}
                                className="btn-modern border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 shadow-lg"
                                style={{borderRadius: '9999px'}}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getAvailableEmployees().length === 0 && (
                        <div className="text-center py-12">
                          <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Users className="w-12 h-12 text-gray-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">No Available Employees</h4>
                          <p className="text-gray-600">No employees with the required qualification are currently available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                )}

            </div>
          )}

          {/* Groups Tab Content */}
          {activeTab === "groups" && (
            <div className="space-y-8">
              {/* Location and Group Selection Form */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">Assign Employees to Groups and Locations</h2>
                      <p className="text-gray-600 text-lg">Select employees and assign them to specific locations and groups</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
                  <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                      <div className="space-y-3">
                        <Label htmlFor="location-select" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          Location
                        </Label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name} - {location.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="group-select" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                          <Users className="w-5 h-5 text-green-600" />
                          Group
                        </Label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup} disabled={!selectedLocation}>
                          <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            {getGroupsForLocation(selectedLocation).map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} ({group.currentCount}/{group.maxCapacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col justify-end h-full">
                        <div className="h-6"></div>
                        <Button 
                          onClick={checkLocationNeeds}
                          disabled={!selectedLocation || !selectedGroup}
                          className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{borderRadius: '9999px'}}
                        >
                          <Building className="w-5 h-5 mr-2" />
                          Check Group Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Status Display */}
              {locationNeeds && (
                <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Group Status</h3>
                        <p className="text-gray-600">Current staffing for {locationNeeds.groupName} at {locationNeeds.locationName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {locationNeeds.needsMore ? (
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-700 mb-2">{locationNeeds.assigned}</div>
                          <div className="text-sm font-semibold text-gray-700">Currently Assigned</div>
                        </div>
                      </div>
                      
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-700 mb-2">{locationNeeds.required}</div>
                          <div className="text-sm font-semibold text-gray-700">Max Capacity</div>
                        </div>
                      </div>
                      
                      <div className="glass-effect rounded-xl border-white/30 p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-700 mb-2">{locationNeeds.required - locationNeeds.assigned}</div>
                          <div className="text-sm font-semibold text-gray-700">Available Spots</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Badge variant="outline" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold rounded-full">
                        {locationNeeds.locationName} - {locationNeeds.groupName}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Employees Section */}
              {locationNeeds && (
                <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Available Employees</h3>
                        <p className="text-gray-600 text-lg">Select employees to assign to this group and location</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                          {locationNeeds.groupName}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                          {getAvailableEmployeesForLocation().length} Available
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {getAvailableEmployeesForLocation().map((employee) => (
                        <div key={employee.id} className="glass-effect rounded-2xl border-white/30 p-6 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-green-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
                            <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-green-200 rounded-xl shadow-sm">
                                <Users className="w-6 h-6 text-green-700" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                  <h4 className="text-lg font-bold text-gray-900">{employee.name}</h4>
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-semibold rounded-full">
                                    {employee.employeeId}
                                  </Badge>
                                  <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full">
                                    Available
                                  </Badge>
                              </div>
                                <div className="text-sm text-gray-700 mb-2">
                                  <span className="font-semibold">Email:</span> {employee.email}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Qualifications:</span> {employee.qualifications.join(", ")}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button 
                                size="sm"
                                onClick={() => handleAssignToLocation(employee.id)}
                                className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                style={{borderRadius: '9999px'}}
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign to Group
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveFromLocation(employee.id)}
                                className="btn-modern border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 shadow-lg"
                                style={{borderRadius: '9999px'}}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      
                      {getAvailableEmployeesForLocation().length === 0 && (
                        <div className="text-center py-12">
                          <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Users className="w-12 h-12 text-gray-400" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">No Available Employees</h4>
                          <p className="text-gray-600">No employees are currently available for assignment.</p>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}