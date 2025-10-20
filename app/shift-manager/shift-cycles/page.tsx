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
  Settings,
  MapPin,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Location = {
  id: string
  name: string
  address: string
  shiftCycles: ShiftCycle[]
}

type ShiftCycle = {
  id: string
  name: string
  shiftsPerCycle: number
  shiftDuration: number
  startTime: string
  endTime: string
  employeeGroups: string[]
}

type EmployeeGroup = {
  id: string
  name: string
  locationId: string
  employeeCount: number
}

export default function ShiftCyclesPage() {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const goBack = () => {
    router.push("/shift-manager")
  }

  // Mock data for locations
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Main Plant",
      address: "123 Industrial Ave, Manufacturing District",
      shiftCycles: [
        {
          id: "1",
          name: "Standard 3-Shift Cycle",
          shiftsPerCycle: 3,
          shiftDuration: 8,
          startTime: "06:00",
          endTime: "22:00",
          employeeGroups: ["A", "B", "C"]
        }
      ]
    },
    {
      id: "2",
      name: "Secondary Facility",
      address: "456 Production Blvd, Industrial Zone",
      shiftCycles: [
        {
          id: "2",
          name: "Extended 4-Shift Cycle",
          shiftsPerCycle: 4,
          shiftDuration: 10,
          startTime: "05:00",
          endTime: "21:00",
          employeeGroups: ["D", "E"]
        }
      ]
    }
  ])

  // Mock data for employee groups
  const [employeeGroups, setEmployeeGroups] = useState<EmployeeGroup[]>([
    { id: "1", name: "Group A", locationId: "1", employeeCount: 15 },
    { id: "2", name: "Group B", locationId: "1", employeeCount: 12 },
    { id: "3", name: "Group C", locationId: "1", employeeCount: 18 },
    { id: "4", name: "Group D", locationId: "2", employeeCount: 10 },
    { id: "5", name: "Group E", locationId: "2", employeeCount: 14 }
  ])

  const [newLocationName, setNewLocationName] = useState("")
  const [newLocationAddress, setNewLocationAddress] = useState("")
  const [newCycleName, setNewCycleName] = useState("")
  const [newCycleShifts, setNewCycleShifts] = useState(3)
  const [newCycleDuration, setNewCycleDuration] = useState(8)
  const [newCycleStartTime, setNewCycleStartTime] = useState("06:00")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const handleCreateLocation = () => {
    if (newLocationName && newLocationAddress) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: newLocationName,
        address: newLocationAddress,
        shiftCycles: []
      }
      setLocations([...locations, newLocation])
      setNewLocationName("")
      setNewLocationAddress("")
    }
  }

  const handleCreateCycle = () => {
    if (newCycleName && selectedLocation && selectedGroups.length > 0) {
      const newCycle: ShiftCycle = {
        id: Date.now().toString(),
        name: newCycleName,
        shiftsPerCycle: newCycleShifts,
        shiftDuration: newCycleDuration,
        startTime: newCycleStartTime,
        endTime: newCycleStartTime,
        employeeGroups: selectedGroups
      }
      
      setLocations(locations.map(loc => 
        loc.id === selectedLocation 
          ? { ...loc, shiftCycles: [...loc.shiftCycles, newCycle] }
          : loc
      ))
      
      setNewCycleName("")
      setNewCycleShifts(3)
      setNewCycleDuration(8)
      setNewCycleStartTime("06:00")
      setSelectedLocation("")
      setSelectedGroups([])
    }
  }

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter(loc => loc.id !== locationId))
    setEmployeeGroups(employeeGroups.filter(group => group.locationId !== locationId))
  }

  const handleDeleteCycle = (locationId: string, cycleId: string) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, shiftCycles: loc.shiftCycles.filter(cycle => cycle.id !== cycleId) }
        : loc
    ))
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
                  <h1 className="text-4xl font-bold text-gray-900">Shift Cycles Configuration</h1>
                  <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                    Manager Portal
                  </div>
                </div>
                <p className="text-gray-600 text-lg">Configure locations, shift cycles, and employee groups</p>
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

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto section-padding">
          {/* Create New Location */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
            <div className="card-padding">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Create New Location</h3>
                  <p className="text-gray-600 text-lg">Add a new facility or location to the system</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="location-name" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Location Name
                    </Label>
                    <Input
                      id="location-name"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="Enter location name"
                      className="modern-input h-14 px-4 py-3 text-base"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="location-address" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Address
                    </Label>
                    <Input
                      id="location-address"
                      value={newLocationAddress}
                      onChange={(e) => setNewLocationAddress(e.target.value)}
                      placeholder="Enter full address"
                      className="modern-input h-14 px-4 py-3 text-base"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-end h-full">
                    <div className="h-6"></div>
                    <Button 
                      onClick={handleCreateLocation}
                      className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full h-14"
                      style={{borderRadius: '9999px'}}
                      disabled={!newLocationName || !newLocationAddress}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Location
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Shift Cycle */}
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="card-padding">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create New Shift Cycle</h3>
                <p className="text-gray-600 text-lg">Configure shift cycles for existing locations</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="cycle-name" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-green-600" />
                    Cycle Name
                  </Label>
                  <Input
                    id="cycle-name"
                    value={newCycleName}
                    onChange={(e) => setNewCycleName(e.target.value)}
                    placeholder="Enter cycle name"
                    className="modern-input h-14 px-4 py-3 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cycle-location" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Building className="w-5 h-5 text-green-600" />
                    Location
                  </Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cycle-shifts" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    Shifts per Cycle
                  </Label>
                  <Select value={newCycleShifts.toString()} onValueChange={(value) => setNewCycleShifts(parseInt(value))}>
                    <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Shifts</SelectItem>
                      <SelectItem value="3">3 Shifts</SelectItem>
                      <SelectItem value="4">4 Shifts</SelectItem>
                      <SelectItem value="5">5 Shifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cycle-duration" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    Duration (hours)
                  </Label>
                  <Select value={newCycleDuration.toString()} onValueChange={(value) => setNewCycleDuration(parseInt(value))}>
                    <SelectTrigger className="modern-input h-14 px-4 py-3 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="10">10 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-3">
                  <Label htmlFor="cycle-start-time" className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    Start Time
                  </Label>
                  <Input
                    id="cycle-start-time"
                    type="time"
                    value={newCycleStartTime}
                    onChange={(e) => setNewCycleStartTime(e.target.value)}
                    className="modern-input h-14 px-4 py-3 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800 flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    Employee Groups
                  </Label>
                  <div className="glass-effect rounded-xl border-white/30 p-6 bg-white/50">
                    <div className="grid grid-cols-1 gap-3">
                      {employeeGroups
                        .filter(group => group.locationId === selectedLocation)
                        .map((group) => (
                          <label key={group.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/70 transition-colors duration-200">
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGroups([...selectedGroups, group.name])
                                } else {
                                  setSelectedGroups(selectedGroups.filter(name => name !== group.name))
                                }
                              }}
                              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
                            />
                            <div className="flex-1">
                              <span className="text-base font-medium text-gray-800">{group.name}</span>
                              <div className="text-sm text-gray-600">{group.employeeCount} employees</div>
                            </div>
                          </label>
                        ))}
                      {selectedLocation && employeeGroups.filter(group => group.locationId === selectedLocation).length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No employee groups available for this location</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleCreateCycle}
                  className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4"
                  style={{borderRadius: '9999px'}}
                  disabled={!newCycleName || !selectedLocation || selectedGroups.length === 0}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Shift Cycle
                </Button>
              </div>
            </div>
          </div>
        </div>

          {/* Locations and Cycles Overview */}
          <div className="space-y-8">
            {locations.map((location) => (
              <div key={location.id} className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
                <div className="card-padding">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{location.name}</h3>
                      <p className="text-gray-600 text-lg">{location.address}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="btn-modern border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Location
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {location.shiftCycles.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <Settings className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">No shift cycles configured</h4>
                        <p className="text-gray-600 text-lg">Create a shift cycle for this location to get started.</p>
                      </div>
                    ) : (
                      location.shiftCycles.map((cycle) => (
                        <div key={cycle.id} className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-6">
                              <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                                <Clock className="w-8 h-8 text-blue-700" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <h4 className="text-xl font-bold text-gray-900">{cycle.name}</h4>
                                  <div className="flex items-center gap-3">
                                    <span className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full shadow-sm">
                                      {cycle.shiftsPerCycle} Shifts
                                    </span>
                                    <span className="px-3 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full shadow-sm">
                                      {cycle.shiftDuration}h Duration
                                    </span>
                                  </div>
                                </div>
                                <div className="text-base text-gray-700 mb-3">
                                  <span className="font-semibold text-gray-900">Start Time:</span> {cycle.startTime} | 
                                  <span className="font-semibold text-gray-900 ml-2">Duration:</span> {cycle.shiftDuration} hours
                                </div>
                                <div className="text-base text-gray-700">
                                  <span className="font-semibold text-gray-900">Employee Groups:</span> {cycle.employeeGroups.join(", ")}
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCycle(location.id, cycle.id)}
                              className="btn-modern border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 shadow-lg"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
