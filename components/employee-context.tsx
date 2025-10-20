"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Shift = {
  id: string
  date: string
  startTime: string
  endTime: string
  role: string
  location: string
  status: "scheduled" | "confirmed" | "pending" | "rejected"
}

type AvailableShift = {
  id: string
  date: string
  shiftType: string
  qualification: string
  status: "available"
}

type EmployeeContextType = {
  shifts: Shift[]
  availableShifts: AvailableShift[]
  setShifts: (shifts: Shift[] | ((prev: Shift[]) => Shift[])) => void
  setAvailableShifts: (shifts: AvailableShift[] | ((prev: AvailableShift[]) => AvailableShift[])) => void
  takeShift: (shiftId: string) => void
  addShift: (shift: Shift) => void
  removeAvailableShift: (shiftId: string) => void
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined)

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "1",
      date: "2025-01-15",
      startTime: "06:00",
      endTime: "14:00",
      role: "Early Shift",
      location: "Main Plant",
      status: "confirmed",
    },
    {
      id: "2",
      date: "2025-01-17",
      startTime: "14:00",
      endTime: "22:00",
      role: "Late Shift",
      location: "Main Plant",
      status: "scheduled",
    },
    {
      id: "3",
      date: "2025-01-19",
      startTime: "22:00",
      endTime: "06:00",
      role: "Night Shift",
      location: "Main Plant",
      status: "confirmed",
    },
  ])

  const [availableShifts, setAvailableShifts] = useState<AvailableShift[]>([
    {
      id: "1",
      date: "2025-01-21",
      shiftType: "Early Shift",
      qualification: "Q1",
      status: "available",
    },
    {
      id: "2",
      date: "2025-01-23",
      shiftType: "Late Shift",
      qualification: "Q2",
      status: "available",
    },
    {
      id: "3",
      date: "2025-01-25",
      shiftType: "Night Shift",
      qualification: "Q3",
      status: "available",
    },
  ])

  const takeShift = (shiftId: string) => {
    // Find the shift being taken
    const shiftToTake = availableShifts.find(shift => shift.id === shiftId)
    
    if (shiftToTake) {
      // Convert available shift to scheduled shift format
      const newShift: Shift = {
        id: `taken-${Date.now()}-${shiftToTake.id}`,
        date: shiftToTake.date,
        startTime: shiftToTake.shiftType === "Early Shift" ? "06:00" : 
                  shiftToTake.shiftType === "Late Shift" ? "14:00" : 
                  shiftToTake.shiftType === "Night Shift" ? "22:00" : "08:00",
        endTime: shiftToTake.shiftType === "Early Shift" ? "14:00" : 
                 shiftToTake.shiftType === "Late Shift" ? "22:00" : 
                 shiftToTake.shiftType === "Night Shift" ? "06:00" : "16:00",
        role: shiftToTake.shiftType,
        location: "Main Plant",
        status: "scheduled"
      }
      
      // Add to scheduled shifts (appears in My Schedule)
      setShifts(prev => [...prev, newShift])
      
      // Remove from available shifts (disappears from Available Shifts)
      setAvailableShifts(prev => prev.filter(shift => shift.id !== shiftId))
    }
  }

  const addShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift])
  }

  const removeAvailableShift = (shiftId: string) => {
    setAvailableShifts(prev => prev.filter(shift => shift.id !== shiftId))
  }

  return (
    <EmployeeContext.Provider value={{
      shifts,
      availableShifts,
      setShifts,
      setAvailableShifts,
      takeShift,
      addShift,
      removeAvailableShift
    }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployee() {
  const context = useContext(EmployeeContext)
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider')
  }
  return context
}
