"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  ChevronLeft,
  Plus,
  Trash2,
  MapPin,
  Building,
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

type Location = {
  id: string
  name: string
  address: string
  capacity: number
  currentEmployees: number
}

type EmployeeGroup = {
  id: string
  name: string
  locationId: string
  maxCapacity: number
  currentCount: number
}

export default function EmployeeAssignmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get shift information from URL parameters
  const shiftId = searchParams.get('shiftId')
  const shiftDate = searchParams.get('date')
  const shiftType = searchParams.get('type')
  const requiredQualification = searchParams.get('qualification')
  
  // State for shift assignment
  const [isShiftAssignment, setIsShiftAssignment] = useState(false)
  
  useEffect(() => {
    // Check if this is a shift assignment (has shift parameters)
    if (shiftId && shiftDate && shiftType && requiredQualification) {
      setIsShiftAssignment(true)
    }
  }, [shiftId, shiftDate, shiftType, requiredQualification])
  
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
      currentLocation: null,
      currentGroup: null,
      qualifications: ["Q1"],
      status: "active",
      hireDate: "2024-01-05"
    },
    {
      id: "5",
      name: "Employee AE",
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
      currentGroup: "A",
      qualifications: ["Q1", "Q3"],
      status: "active",
      hireDate: "2024-03-15"
    },
    {
      id: "7",
      name: "Employee AG",
      employeeId: "EMP007",
      email: "ag@company.com",
      currentLocation: null,
      currentGroup: null,
      qualifications: ["Q2"],
      status: "active",
      hireDate: "2024-04-01"
    },
    {
      id: "8",
      name: "Employee AH",
      employeeId: "EMP008",
      email: "ah@company.com",
      currentLocation: "2",
      currentGroup: "A",
      qualifications: ["Q1", "Q2", "Q3"],
      status: "active",
      hireDate: "2024-05-10"
    }
  ])

  // Mock data for locations
  const [locations] = useState<Location[]>([
    {
      id: "1",
      name: "Main Plant",
      address: "123 Industrial Ave, Manufacturing District",
      capacity: 50,
      currentEmployees: 2
    },
    {
      id: "2",
      name: "Secondary Facility",
      address: "456 Production Blvd, Industrial Zone",
      capacity: 30,
      currentEmployees: 2
    }
  ])

  // Mock data for employee groups
  const [employeeGroups] = useState<EmployeeGroup[]>([
    { id: "1", name: "Group A", locationId: "1", maxCapacity: 15, currentCount: 1 },
    { id: "2", name: "Group B", locationId: "1", maxCapacity: 12, currentCount: 1 },
    { id: "3", name: "Group C", locationId: "1", maxCapacity: 18, currentCount: 0 },
    { id: "4", name: "Group D", locationId: "2", maxCapacity: 10, currentCount: 1 },
    { id: "5", name: "Group E", locationId: "2", maxCapacity: 14, currentCount: 1 }
  ])

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleAssignEmployees = () => {
    if (isShiftAssignment) {
      // Handle shift assignment
      if (selectedEmployees.length > 0) {
        // In a real app, this would call an API to assign employees to the shift
        console.log(`Assigning employees ${selectedEmployees.join(', ')} to shift ${shiftId}`)
        alert(`Successfully assigned ${selectedEmployees.length} employee(s) to ${shiftType} shift on ${shiftDate}`)
        
        setSelectedEmployees([])
        
        // Navigate back to shift manager
        router.push("/shift-manager")
      }
    } else {
      // Handle location/group assignment (original logic)
      if (selectedEmployees.length > 0 && selectedLocation && selectedGroup) {
        setEmployees(employees.map(emp => {
          if (selectedEmployees.includes(emp.id)) {
            return {
              ...emp,
              currentLocation: selectedLocation,
              currentGroup: selectedGroup
            }
          }
          return emp
        }))
        
        setSelectedEmployees([])
        setSelectedLocation("")
        setSelectedGroup("")
        
        alert(`Successfully assigned ${selectedEmployees.length} employee(s) to ${selectedGroup}`)
      }
    }
  }

  const handleRemoveAssignment = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, currentLocation: null, currentGroup: null }
        : emp
    ))
  }

  const filteredEmployees = employees.filter(emp => {
    // Apply search filter
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Apply location filter
    const matchesLocation = !selectedLocation || selectedLocation === "all" || emp.currentLocation === selectedLocation
    
    // Apply group filter
    const matchesGroup = !selectedGroup || selectedGroup === "all" || emp.currentGroup === selectedGroup
    
    // If it's a shift assignment, also filter by qualification
    if (isShiftAssignment && requiredQualification) {
      return matchesSearch && matchesLocation && matchesGroup && emp.qualifications.includes(requiredQualification)
    }
    
    return matchesSearch && matchesLocation && matchesGroup
  })

  const getGroupCapacity = (groupId: string) => {
    const group = employeeGroups.find(g => g.name === groupId)
    return group ? group.maxCapacity : 0
  }

  const getGroupCurrentCount = (groupId: string) => {
    const group = employeeGroups.find(g => g.name === groupId)
    return group ? group.currentCount : 0
  }

  const getLocationName = (locationId: string | null) => {
    if (!locationId) return "Unassigned"
    const location = locations.find(l => l.id === locationId)
    return location ? location.name : "Unknown"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goBack} className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isShiftAssignment ? "Assign Employees to Shift" : "Employee Assignment"}
                </h1>
                <p className="text-gray-600">
                  {isShiftAssignment 
                    ? `Assign employees to ${shiftType} shift on ${shiftDate} requiring ${requiredQualification} qualification`
                    : "Assign employees to locations and groups"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-600 font-medium">Shift Manager</div>
                <div className="text-sm text-gray-500">ID: SM001 | Level: Manager</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Shift Information Card (only for shift assignments) */}
        {isShiftAssignment && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-200 rounded-lg">
                <Clock className="w-6 h-6 text-orange-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{shiftType} Shift Assignment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Date:</span> {shiftDate}
                  </div>
                  <div>
                    <span className="font-medium">Shift Type:</span> {shiftType}
                  </div>
                  <div>
                    <span className="font-medium">Required Qualification:</span> 
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 px-2 py-1 text-xs ml-2">
                      {requiredQualification}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isShiftAssignment ? "Select Employees for Shift" : "Assign Employees"}
              </h3>
              <p className="text-gray-600">
                {isShiftAssignment 
                  ? "Select employees to assign to this shift"
                  : "Select employees and assign them to locations and groups"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className={`grid gap-6 ${isShiftAssignment ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Search Employees
              </Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, or email..."
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employee Group
              </Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All groups</SelectItem>
                  {employeeGroups
                    .filter(group => selectedLocation === "all" || !selectedLocation || group.locationId === selectedLocation)
                    .map((group) => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <div className="h-6"></div>
              <Button 
                onClick={handleAssignEmployees}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={selectedEmployees.length === 0}
              >
                <UserCheck className="w-5 h-5 mr-2" />
                {isShiftAssignment ? 'Assign to Shift' : 'Assign'} ({selectedEmployees.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isShiftAssignment ? "Available Employees for Shift" : "Employee List"}
              </h3>
              <p className="text-gray-600">
                {isShiftAssignment 
                  ? `Showing employees with ${requiredQualification} qualification who can work this shift`
                  : "Select employees to assign to locations and groups"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedEmployees.length} Selected
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {filteredEmployees.length} Available
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleEmployeeSelection(employee.id)}
                        className="mr-3"
                      />
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                        <Badge variant="outline">{employee.employeeId}</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {employee.status}
                        </Badge>
                        {employee.currentLocation && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {employee.currentGroup}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Email:</span> {employee.email}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Location:</span> {getLocationName(employee.currentLocation)}
                        </div>
                        <div>
                          <span className="font-medium">Group:</span> {employee.currentGroup || "Unassigned"}
                        </div>
                        <div>
                          <span className="font-medium">Qualifications:</span> {employee.qualifications.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Hire Date:</span> {employee.hireDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {employee.currentLocation && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveAssignment(employee.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Remove Assignment
                    </Button>
                  )}
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

        {/* Location Overview */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location Overview</h3>
              <p className="text-gray-600">Current employee distribution across locations and groups</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((location) => (
              <div key={location.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">{location.currentEmployees}</div>
                    <div className="text-sm text-green-600">/{location.capacity} capacity</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {employeeGroups
                    .filter(group => group.locationId === location.id)
                    .map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                        <div>
                          <div className="font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-600">{group.currentCount} / {group.maxCapacity} employees</div>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${group.currentCount >= group.maxCapacity ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${(group.currentCount / group.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
