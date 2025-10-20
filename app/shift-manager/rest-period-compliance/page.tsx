"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Clock3,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type ComplianceRecord = {
  id: string
  employeeId: string
  employeeName: string
  shiftDate: string
  shiftType: string
  previousShiftEnd: string
  nextShiftStart: string
  restPeriodHours: number
  requiredHours: number
  status: "compliant" | "non-compliant" | "warning"
  violationType?: "insufficient-rest" | "consecutive-shifts" | "overtime-exceeded"
  notes?: string
  lastChecked: string
}

type ComplianceSummary = {
  totalRecords: number
  compliant: number
  nonCompliant: number
  warnings: number
  criticalIssues: number
}

export default function RestPeriodCompliancePage() {
  const router = useRouter()
  const [filterEmployee, setFilterEmployee] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const handleBack = () => {
    router.push("/shift-manager")
  }

  const handleRecordClick = (record: ComplianceRecord) => {
    setSelectedRecord(record)
    setShowDetailsModal(true)
  }

  const handleResolveViolation = (recordId: string) => {
    // Mock resolve logic
    console.log(`Resolving violation for record ${recordId}`)
    alert(`Violation resolution functionality for record ${recordId} would be implemented here`)
  }

  const exportComplianceReport = () => {
    // Mock export logic
    console.log("Exporting compliance report")
    alert("Compliance report export functionality would be implemented here")
  }

  const refreshComplianceData = () => {
    // Mock refresh logic
    console.log("Refreshing compliance data")
    alert("Compliance data refreshed successfully")
  }


  // Mock data for compliance records
  const [complianceRecords] = useState<ComplianceRecord[]>([
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Employee AA",
      shiftDate: "2025-01-15",
      shiftType: "Early Shift",
      previousShiftEnd: "2025-01-14 22:00",
      nextShiftStart: "2025-01-15 06:00",
      restPeriodHours: 12,
      requiredHours: 12,
      status: "compliant",
      lastChecked: "2025-01-15 05:30"
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Employee BB",
      shiftDate: "2025-01-15",
      shiftType: "Night Shift",
      previousShiftEnd: "2025-01-14 22:00",
      nextShiftStart: "2025-01-15 22:00",
      restPeriodHours: 8,
      requiredHours: 12,
      status: "non-compliant",
      violationType: "insufficient-rest",
      notes: "Insufficient rest period - requires 12 hours minimum",
      lastChecked: "2025-01-15 21:30"
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Employee CC",
      shiftDate: "2025-01-15",
      shiftType: "Late Shift",
      previousShiftEnd: "2025-01-14 22:00",
      nextShiftStart: "2025-01-15 14:00",
      restPeriodHours: 16,
      requiredHours: 12,
      status: "compliant",
      lastChecked: "2025-01-15 13:30"
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Employee DD",
      shiftDate: "2025-01-15",
      shiftType: "Early Shift",
      previousShiftEnd: "2025-01-14 14:00",
      nextShiftStart: "2025-01-15 06:00",
      restPeriodHours: 16,
      requiredHours: 12,
      status: "warning",
      violationType: "consecutive-shifts",
      notes: "Consecutive early shifts - monitor for fatigue",
      lastChecked: "2025-01-15 05:30"
    },
    {
      id: "5",
      employeeId: "EMP002",
      employeeName: "Employee BB",
      shiftDate: "2025-01-16",
      shiftType: "Late Shift",
      previousShiftEnd: "2025-01-15 22:00",
      nextShiftStart: "2025-01-16 14:00",
      restPeriodHours: 10,
      requiredHours: 12,
      status: "non-compliant",
      violationType: "insufficient-rest",
      notes: "Another insufficient rest period violation for EMP002",
      lastChecked: "2025-01-16 13:30"
    }
  ])

  const complianceSummary: ComplianceSummary = {
    totalRecords: complianceRecords.length,
    compliant: complianceRecords.filter(r => r.status === "compliant").length,
    nonCompliant: complianceRecords.filter(r => r.status === "non-compliant").length,
    warnings: complianceRecords.filter(r => r.status === "warning").length,
    criticalIssues: complianceRecords.filter(r => r.status === "non-compliant").length
  }

  // Filter records based on search params and filters
  const filteredRecords = complianceRecords.filter(record => {
    const matchesEmployee = !filterEmployee || record.employeeId.toLowerCase().includes(filterEmployee.toLowerCase()) || record.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())
    const matchesStatus = !filterStatus || filterStatus === "all" || record.status === filterStatus
    return matchesEmployee && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-100 text-green-800"
      case "non-compliant": return "bg-red-100 text-red-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="w-4 h-4" />
      case "non-compliant": return <XCircle className="w-4 h-4" />
      case "warning": return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getViolationTypeText = (type?: string) => {
    switch (type) {
      case "insufficient-rest": return "Insufficient Rest Period"
      case "consecutive-shifts": return "Consecutive Shifts"
      case "overtime-exceeded": return "Overtime Exceeded"
      default: return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBack}
                  className="shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 ease-out"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Rest Period Compliance</h1>
              </div>
              <p className="text-gray-600">Monitor and manage employee rest period compliance across all shifts</p>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-gray-900">{complianceSummary.totalRecords}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-3xl font-bold text-green-600">{complianceSummary.compliant}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-3xl font-bold text-red-600">{complianceSummary.nonCompliant}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-3xl font-bold text-yellow-600">{complianceSummary.warnings}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Filter & Search</h3>
              <p className="text-gray-600">Search and filter compliance records by employee or status</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Search Employees
                </label>
                <Input
                  placeholder="Search by employee ID or name..."
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  className="w-64 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Filter by Status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportComplianceReport}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 ease-out h-10 px-4"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshComplianceData}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 ease-out h-10 px-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Compliance Records */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance Records</h3>
              <p className="text-gray-600">View and manage individual compliance records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {filteredRecords.length} Showing
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-out cursor-pointer"
                onClick={() => handleRecordClick(record)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${record.status === 'compliant' ? 'bg-green-100' : record.status === 'non-compliant' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.employeeName}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                        </Badge>
                        {record.violationType && (
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            {getViolationTypeText(record.violationType)}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Shift:</span> {record.shiftType} on {record.shiftDate}
                        </div>
                        <div>
                          <span className="font-medium">Rest Period:</span> {record.restPeriodHours}h / {record.requiredHours}h required
                        </div>
                        <div>
                          <span className="font-medium">Last Checked:</span> {record.lastChecked}
                        </div>
                      </div>
                      {record.notes && (
                        <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          {record.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {record.restPeriodHours >= record.requiredHours ? '✓' : '✗'} {record.restPeriodHours}h
                      </div>
                      <div className="text-xs text-gray-500">Rest Period</div>
                    </div>
                    {record.status === 'non-compliant' && (
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleResolveViolation(record.id)
                        }}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No compliance records found</h4>
                <p className="text-gray-600">Try adjusting your filters or check back later for new records.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedRecord && getStatusIcon(selectedRecord.status)}
              Compliance Details - {selectedRecord?.employeeName}
            </DialogTitle>
            <DialogDescription>
              Detailed information about rest period compliance for this employee
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Employee ID:</span> {selectedRecord.employeeId}</div>
                    <div><span className="font-medium">Name:</span> {selectedRecord.employeeName}</div>
                    <div><span className="font-medium">Shift Date:</span> {selectedRecord.shiftDate}</div>
                    <div><span className="font-medium">Shift Type:</span> {selectedRecord.shiftType}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Rest Period Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Previous Shift End:</span> {selectedRecord.previousShiftEnd}</div>
                    <div><span className="font-medium">Next Shift Start:</span> {selectedRecord.nextShiftStart}</div>
                    <div><span className="font-medium">Actual Rest Period:</span> {selectedRecord.restPeriodHours} hours</div>
                    <div><span className="font-medium">Required Rest Period:</span> {selectedRecord.requiredHours} hours</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Compliance Status</h4>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1).replace('-', ' ')}
                  </Badge>
                  {selectedRecord.violationType && (
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      {getViolationTypeText(selectedRecord.violationType)}
                    </Badge>
                  )}
                </div>
                {selectedRecord.notes && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {selectedRecord.notes}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                {selectedRecord.status === 'non-compliant' && (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      handleResolveViolation(selectedRecord.id)
                      setShowDetailsModal(false)
                    }}
                  >
                    Resolve Violation
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
