
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Globe, 
  MessageSquare,
  Phone,
  Wifi,
  Database,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const systemStats = {
    totalPatients: 12847,
    activeProviders: 234,
    appointmentsToday: 1456,
    systemUptime: '99.9%',
    messagesProcessed: 45621,
    adherenceRate: 87.2,
    noShowReduction: 67,
    avgResponseTime: '1.2s'
  };

  const communicationChannels = [
    { channel: 'SMS', sent: 15420, delivered: 15234, response: 78 },
    { channel: 'WhatsApp', sent: 8934, delivered: 8912, response: 92 },
    { channel: 'Email', sent: 12456, delivered: 11987, response: 45 },
    { channel: 'Voice Call', sent: 2341, delivered: 2298, response: 89 },
    { channel: 'Push Notification', sent: 6470, delivered: 6401, response: 34 }
  ];

  const ehrIntegrations = [
    { system: 'Epic MyChart', status: 'connected', patients: 4521, lastSync: '2 min ago' },
    { system: 'Cerner PowerChart', status: 'connected', patients: 3245, lastSync: '5 min ago' },
    { system: 'Allscripts', status: 'connected', patients: 2134, lastSync: '1 min ago' },
    { system: 'athenahealth', status: 'syncing', patients: 1876, lastSync: '10 min ago' },
    { system: 'NextGen', status: 'error', patients: 1071, lastSync: '2 hours ago' }
  ];

  const riskAlerts = [
    { level: 'high', count: 23, description: 'Patients with 3+ missed appointments' },
    { level: 'medium', count: 45, description: 'Medication adherence below 70%' },
    { level: 'low', count: 12, description: 'Upcoming chronic care appointments' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>;
      case 'syncing':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Syncing</Badge>;
      case 'error':
        return <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">System Administration & Analytics</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alert Center
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Patients</p>
                  <p className="text-3xl font-bold">{systemStats.totalPatients.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Providers</p>
                  <p className="text-3xl font-bold">{systemStats.activeProviders}</p>
                </div>
                <Activity className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">System Uptime</p>
                  <p className="text-3xl font-bold">{systemStats.systemUptime}</p>
                </div>
                <Wifi className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">No-Show Reduction</p>
                  <p className="text-3xl font-bold">{systemStats.noShowReduction}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="integrations">EHR Integrations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="global">Global Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">System Analytics Dashboard</h3>
              <div className="flex space-x-2">
                <Input placeholder="Date range..." className="w-48" />
                <Button variant="outline">Export Report</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">Adherence Rate</p>
                      <p className="text-sm text-green-600">Average medication compliance</p>
                    </div>
                    <span className="text-2xl font-bold text-green-700">{systemStats.adherenceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-800">Messages Processed</p>
                      <p className="text-sm text-blue-600">Last 30 days</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">{systemStats.messagesProcessed.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-purple-800">Avg Response Time</p>
                      <p className="text-sm text-purple-600">System performance</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-700">{systemStats.avgResponseTime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Risk Alerts Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                      alert.level === 'high' ? 'bg-red-50 border border-red-200' :
                      alert.level === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <div>
                        <p className={`font-semibold ${
                          alert.level === 'high' ? 'text-red-800' :
                          alert.level === 'medium' ? 'text-yellow-800' :
                          'text-blue-800'
                        }`}>
                          {alert.description}
                        </p>
                        <p className={`text-sm ${
                          alert.level === 'high' ? 'text-red-600' :
                          alert.level === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {alert.level.toUpperCase()} PRIORITY
                        </p>
                      </div>
                      <span className={`text-2xl font-bold ${
                        alert.level === 'high' ? 'text-red-700' :
                        alert.level === 'medium' ? 'text-yellow-700' :
                        'text-blue-700'
                      }`}>
                        {alert.count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Communication Channels Performance</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Configure Channels
              </Button>
            </div>
            
            <div className="grid gap-4">
              {communicationChannels.map((channel, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          {channel.channel === 'SMS' && <Phone className="w-6 h-6 text-white" />}
                          {channel.channel === 'WhatsApp' && <MessageSquare className="w-6 h-6 text-white" />}
                          {channel.channel === 'Email' && <MessageSquare className="w-6 h-6 text-white" />}
                          {channel.channel === 'Voice Call' && <Phone className="w-6 h-6 text-white" />}
                          {channel.channel === 'Push Notification' && <MessageSquare className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{channel.channel}</h4>
                          <p className="text-gray-600">Last 30 days performance</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Sent</p>
                          <p className="text-lg font-bold">{channel.sent.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Delivered</p>
                          <p className="text-lg font-bold text-green-600">{channel.delivered.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Response Rate</p>
                          <p className="text-lg font-bold text-blue-600">{channel.response}%</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">EHR System Integrations</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <Database className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>
            
            <div className="grid gap-4">
              {ehrIntegrations.map((ehr, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Database className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{ehr.system}</h4>
                          <p className="text-gray-600">{ehr.patients.toLocaleString()} patients synced</p>
                          <p className="text-sm text-gray-500">Last sync: {ehr.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(ehr.status)}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Configure</Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Compliance & Security</h3>
              <Button className="bg-red-600 hover:bg-red-700">
                <Shield className="w-4 h-4 mr-2" />
                Security Audit
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    HIPAA Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">Data Encryption</p>
                      <p className="text-sm text-green-600">AES-256 end-to-end</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">Access Controls</p>
                      <p className="text-sm text-green-600">Role-based permissions</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">Audit Logging</p>
                      <p className="text-sm text-green-600">Complete activity tracking</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    GDPR Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-800">Consent Management</p>
                      <p className="text-sm text-blue-600">Granular consent tracking</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-800">Data Portability</p>
                      <p className="text-sm text-blue-600">Patient data export ready</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-800">Right to Erasure</p>
                      <p className="text-sm text-blue-600">Automated data deletion</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Global Deployment Settings</h3>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Globe className="w-4 h-4 mr-2" />
                Add Region
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supported Languages</CardTitle>
                  <CardDescription>Multi-language support status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>English</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Spanish</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>French</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>German</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Mandarin</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <Button size="sm" className="w-full mt-4">Add Language</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timezone Coverage</CardTitle>
                  <CardDescription>Global timezone support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Americas</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Europe</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Asia-Pacific</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Middle East</span>
                    <Badge className="bg-yellow-500">Partial</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Africa</span>
                    <Badge className="bg-yellow-500">Partial</Badge>
                  </div>
                  <Button size="sm" className="w-full mt-4">Configure</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Offline Capabilities</CardTitle>
                  <CardDescription>Low-connectivity support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Offline Mode</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Data Sync</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>SMS Fallback</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Voice Bot</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Rural Support</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <Button size="sm" className="w-full mt-4">Optimize</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
