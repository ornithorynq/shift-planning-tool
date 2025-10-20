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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Cycles Configuration</h1>
                <p className="text-gray-600">Configure locations, shift cycles, and employee groups</p>
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
        {/* Create New Location */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Location</h3>
              <p className="text-gray-600">Add a new facility or location to the system</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Name
              </Label>
              <Input
                id="location-name"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Enter location name"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="location-address"
                value={newLocationAddress}
                onChange={(e) => setNewLocationAddress(e.target.value)}
                placeholder="Enter full address"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <div className="h-6"></div>
              <Button 
                onClick={handleCreateLocation}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!newLocationName || !newLocationAddress}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Location
              </Button>
            </div>
          </div>
        </div>

        {/* Create New Shift Cycle */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Shift Cycle</h3>
              <p className="text-gray-600">Configure shift cycles for existing locations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cycle-name" className="text-sm font-semibold text-gray-700">
                Cycle Name
              </Label>
              <Input
                id="cycle-name"
                value={newCycleName}
                onChange={(e) => setNewCycleName(e.target.value)}
                placeholder="Enter cycle name"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cycle-location" className="text-sm font-semibold text-gray-700">
                Location
              </Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
            
            <div className="space-y-2">
              <Label htmlFor="cycle-shifts" className="text-sm font-semibold text-gray-700">
                Shifts per Cycle
              </Label>
              <Select value={newCycleShifts.toString()} onValueChange={(value) => setNewCycleShifts(parseInt(value))}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
            
            <div className="space-y-2">
              <Label htmlFor="cycle-duration" className="text-sm font-semibold text-gray-700">
                Shift Duration (hours)
              </Label>
              <Select value={newCycleDuration.toString()} onValueChange={(value) => setNewCycleDuration(parseInt(value))}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cycle-start-time" className="text-sm font-semibold text-gray-700">
                Start Time
              </Label>
              <Input
                id="cycle-start-time"
                type="time"
                value={newCycleStartTime}
                onChange={(e) => setNewCycleStartTime(e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Employee Groups
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {employeeGroups
                  .filter(group => group.locationId === selectedLocation)
                  .map((group) => (
                    <label key={group.id} className="flex items-center space-x-2 cursor-pointer">
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{group.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleCreateCycle}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!newCycleName || !selectedLocation || selectedGroups.length === 0}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Shift Cycle
            </Button>
          </div>
        </div>

        {/* Locations and Cycles Overview */}
        <div className="space-y-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-gray-600">{location.address}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteLocation(location.id)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Location
                </Button>
              </div>
              
              <div className="space-y-4">
                {location.shiftCycles.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Settings className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No shift cycles configured</h4>
                    <p className="text-gray-600">Create a shift cycle for this location to get started.</p>
                  </div>
                ) : (
                  location.shiftCycles.map((cycle) => (
                    <div key={cycle.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-200 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{cycle.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {cycle.shiftsPerCycle} Shifts
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  {cycle.shiftDuration}h Duration
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Start Time:</span> {cycle.startTime} | 
                              <span className="font-medium ml-2">Duration:</span> {cycle.shiftDuration} hours
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Employee Groups:</span> {cycle.employeeGroups.join(", ")}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCycle(location.id, cycle.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
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
          ))}
        </div>
      </main>
    </div>
  )
}
