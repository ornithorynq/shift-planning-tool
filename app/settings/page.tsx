"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Bell, Clock, Users, Shield, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const router = useRouter()
  
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      shiftReminders: true,
      emergencyAlerts: true
    },
    scheduling: {
      defaultShiftDuration: "8",
      advanceNoticeHours: "24",
      maxConsecutiveShifts: "5",
      restPeriodHours: "11"
    },
    system: {
      timezone: "UTC+1",
      dateFormat: "DD/MM/YYYY",
      language: "English",
      autoSave: true
    }
  })

  const handleSave = () => {
    console.log("Settings saved:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Configure your shift management preferences</p>
              </div>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailNotifications: checked }
                  }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <Switch 
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, pushNotifications: checked }
                  }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Shift Reminders</Label>
                  <p className="text-sm text-gray-500">Remind employees before shifts start</p>
                </div>
                <Switch 
                  checked={settings.notifications.shiftReminders}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, shiftReminders: checked }
                  }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emergency Alerts</Label>
                  <p className="text-sm text-gray-500">Immediate alerts for urgent situations</p>
                </div>
                <Switch 
                  checked={settings.notifications.emergencyAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emergencyAlerts: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Scheduling Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Scheduling Preferences
              </CardTitle>
              <CardDescription>
                Configure default scheduling parameters and rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shiftDuration">Default Shift Duration (hours)</Label>
                  <Input
                    id="shiftDuration"
                    type="number"
                    value={settings.scheduling.defaultShiftDuration}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling, defaultShiftDuration: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="advanceNotice">Advance Notice (hours)</Label>
                  <Input
                    id="advanceNotice"
                    type="number"
                    value={settings.scheduling.advanceNoticeHours}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling, advanceNoticeHours: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxConsecutive">Max Consecutive Shifts</Label>
                  <Input
                    id="maxConsecutive"
                    type="number"
                    value={settings.scheduling.maxConsecutiveShifts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling, maxConsecutiveShifts: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restPeriod">Minimum Rest Period (hours)</Label>
                  <Input
                    id="restPeriod"
                    type="number"
                    value={settings.scheduling.restPeriodHours}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      scheduling: { ...prev.scheduling, restPeriodHours: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system preferences and display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.system.timezone}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+1">UTC+1 (Central European)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (Greenwich)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (Eastern US)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={settings.system.dateFormat}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, dateFormat: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.system.language}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, language: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-gray-500">Automatically save changes</p>
                  </div>
                  <Switch 
                    checked={settings.system.autoSave}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, autoSave: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Current User: Shift Manager</div>
                    <div className="text-sm text-gray-500">ID: SM001 | Level: Manager</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Team Members</div>
                    <div className="text-sm text-gray-500">Manage team access and permissions</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}