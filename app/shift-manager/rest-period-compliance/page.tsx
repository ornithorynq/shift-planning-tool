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
      employeeName: "Employee AB",
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
      employeeName: "Employee AC",
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
      employeeName: "Employee AD",
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
      employeeName: "Employee AB",
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
                  onClick={handleBack}
                  className="btn-modern hover:bg-white/30 text-gray-700 hover:text-gray-900 mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-4xl font-bold text-gray-900">Rest Period Compliance</h1>
                <div className="status-info px-4 py-2 text-sm font-bold rounded-full shadow-sm">
                  Manager Portal
                </div>
              </div>
              <p className="text-gray-600 text-lg">Monitor and manage employee rest period compliance across all shifts</p>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-2">{complianceSummary.totalRecords}</div>
              <div className="text-lg font-semibold text-gray-700">Total Records</div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-green-50/50 to-emerald-50/50 hover:shadow-modern-lg hover:border-green-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-green-200 rounded-xl shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Compliant
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{complianceSummary.compliant}</div>
              <div className="text-lg font-semibold text-gray-700">Compliant Records</div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-red-50/50 to-rose-50/50 hover:shadow-modern-lg hover:border-red-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-red-200 rounded-xl shadow-sm">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Critical
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-700 mb-2">{complianceSummary.nonCompliant}</div>
              <div className="text-lg font-semibold text-gray-700">Non-Compliant</div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 p-8 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:shadow-modern-lg hover:border-amber-300 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-amber-200 rounded-xl shadow-sm">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                Warning
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-700 mb-2">{complianceSummary.warnings}</div>
              <div className="text-lg font-semibold text-gray-700">Warnings</div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30 mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Filter & Search</h3>
                <p className="text-gray-600 text-lg">Search and filter compliance records by employee or status</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-6 flex-1">
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      Search Employees
                    </label>
                    <Input
                      placeholder="Search by employee ID or name..."
                      value={filterEmployee}
                      onChange={(e) => setFilterEmployee(e.target.value)}
                      className="modern-input h-14 px-4 py-3 text-base w-64"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                      Filter by Status
                    </label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="modern-input h-14 px-4 py-3 text-base w-48">
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
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportComplianceReport}
                    className="btn-modern border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-lg h-12 px-6"
                    style={{borderRadius: '9999px'}}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshComplianceData}
                    className="btn-modern border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 shadow-lg h-12 px-6"
                    style={{borderRadius: '9999px'}}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Records */}
        <div className="glass-effect rounded-2xl shadow-modern-lg border-white/30">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Compliance Records</h3>
                <p className="text-gray-600 text-lg">View and manage individual compliance records</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-semibold rounded-full shadow-sm">
                  {filteredRecords.length} Showing
                </Badge>
              </div>
            </div>
            
            <div className="space-y-6">
              {filteredRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="glass-effect rounded-2xl border-white/30 p-8 bg-gradient-to-r from-slate-50/50 to-gray-50/50 hover:shadow-modern-lg hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => handleRecordClick(record)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-xl shadow-sm ${record.status === 'compliant' ? 'bg-green-200' : record.status === 'non-compliant' ? 'bg-red-200' : 'bg-amber-200'}`}>
                        {record.status === 'compliant' ? (
                          <CheckCircle className="w-8 h-8 text-green-700" />
                        ) : record.status === 'non-compliant' ? (
                          <XCircle className="w-8 h-8 text-red-700" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-amber-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{record.employeeName}</h3>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                          </Badge>
                          {record.violationType && (
                            <Badge variant="outline" className="text-red-700 border-red-300">
                              {getViolationTypeText(record.violationType)}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base text-gray-700 mb-4">
                          <div>
                            <span className="font-semibold text-gray-900">Shift:</span> {record.shiftType} on {record.shiftDate}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Rest Period:</span> {record.restPeriodHours}h / {record.requiredHours}h required
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Last Checked:</span> {record.lastChecked}
                          </div>
                        </div>
                        {record.notes && (
                          <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            {record.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-1">
                          {record.restPeriodHours >= record.requiredHours ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span>{record.restPeriodHours}h</span>
                        </div>
                        <div className="text-sm text-gray-500">Rest Period</div>
                      </div>
                      {record.status === 'non-compliant' && (
                        <Button 
                          size="sm" 
                          className="btn-modern bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          style={{borderRadius: '9999px'}}
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
                <div className="text-center py-16">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">No compliance records found</h4>
                  <p className="text-gray-600 text-lg">Try adjusting your filters or check back later for new records.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
              {selectedRecord && getStatusIcon(selectedRecord.status)}
              Compliance Details - {selectedRecord?.employeeName}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Detailed information about rest period compliance for this employee
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6 p-6">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Employee Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Employee ID:</span>
                      <span className="text-gray-900">{selectedRecord.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">{selectedRecord.employeeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Shift Date:</span>
                      <span className="text-gray-900">{selectedRecord.shiftDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Shift Type:</span>
                      <span className="text-gray-900">{selectedRecord.shiftType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Rest Period Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Previous Shift End:</span>
                      <span className="text-gray-900">{selectedRecord.previousShiftEnd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Next Shift Start:</span>
                      <span className="text-gray-900">{selectedRecord.nextShiftStart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Actual Rest Period:</span>
                      <span className="text-gray-900">{selectedRecord.restPeriodHours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Required Rest Period:</span>
                      <span className="text-gray-900">{selectedRecord.requiredHours} hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Compliance Status</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium text-gray-900">
                      {selectedRecord.restPeriodHours}h / {selectedRecord.requiredHours}h required
                    </div>
                    <Badge className={getStatusColor(selectedRecord.status)}>
                      {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Last Checked: {selectedRecord.lastChecked}
                  </div>
                  
                  {selectedRecord.violationType && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-700 border-red-300">
                        {getViolationTypeText(selectedRecord.violationType)}
                      </Badge>
                    </div>
                  )}
                  
                  {selectedRecord.notes && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {selectedRecord.notes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
                {selectedRecord.status === 'non-compliant' && (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                    onClick={() => {
                      handleResolveViolation(selectedRecord.id)
                      setShowDetailsModal(false)
                    }}
                  >
                    Resolve
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
