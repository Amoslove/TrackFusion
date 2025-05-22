
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  MessageSquare,
  Brain,
  Clock,
  TrendingUp,
  Heart,
  Pill
} from 'lucide-react';

interface DoctorDashboardProps {
  onBack: () => void;
}

const DoctorDashboard = ({ onBack }: DoctorDashboardProps) => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const patients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 45,
      condition: 'Diabetes Type 2',
      riskLevel: 'high',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      missedAppointments: 3,
      adherenceScore: 65,
      phone: '+1-555-0123'
    },
    {
      id: '2',
      name: 'Michael Chen',
      age: 62,
      condition: 'Hypertension',
      riskLevel: 'medium',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-28',
      missedAppointments: 1,
      adherenceScore: 85,
      phone: '+1-555-0124'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      age: 34,
      condition: 'Chronic Migraine',
      riskLevel: 'low',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-01',
      missedAppointments: 0,
      adherenceScore: 95,
      phone: '+1-555-0125'
    }
  ];

  const upcomingAppointments = [
    { time: '09:00 AM', patient: 'Sarah Johnson', type: 'Follow-up', status: 'confirmed' },
    { time: '10:30 AM', patient: 'Michael Chen', type: 'Check-up', status: 'pending' },
    { time: '02:00 PM', patient: 'Emily Rodriguez', type: 'Consultation', status: 'confirmed' },
    { time: '03:30 PM', patient: 'David Wilson', type: 'Follow-up', status: 'at-risk' }
  ];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'at-risk':
        return <Badge className="bg-red-500 hover:bg-red-600">At Risk</Badge>;
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
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">Dr. Sarah Mitchell - Internal Medicine</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Contact
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Patients</p>
                  <p className="text-3xl font-bold">247</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Today's Appointments</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">High Risk Patients</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Adherence Rate</p>
                  <p className="text-3xl font-bold">87%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="appointments">Today's Schedule</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Patient Risk Assessment</h3>
              <div className="flex space-x-2">
                <Input placeholder="Search patients..." className="w-64" />
                <Button variant="outline">Filter by Risk</Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{patient.name}</h4>
                          <p className="text-gray-600">{patient.condition} • Age {patient.age}</p>
                          <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Adherence Score</p>
                          <p className="text-xl font-bold">{patient.adherenceScore}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Missed Appointments</p>
                          <p className="text-xl font-bold text-red-600">{patient.missedAppointments}</p>
                        </div>
                        {getRiskBadge(patient.riskLevel)}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Today's Appointments - January 25, 2024</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Add Appointment
              </Button>
            </div>
            
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <Clock className="w-6 h-6 text-blue-600 mx-auto" />
                          <p className="font-semibold">{appointment.time}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{appointment.patient}</h4>
                          <p className="text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(appointment.status)}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Start Visit</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <h3 className="text-xl font-semibold">AI-Powered Insights & Predictions</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    Risk Prediction Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-red-800">Sarah Johnson</p>
                      <p className="text-sm text-red-600">85% chance of missing next appointment</p>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">Contact Now</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-semibold text-yellow-800">Michael Chen</p>
                      <p className="text-sm text-yellow-600">Medication adherence declining</p>
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">Review</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Chronic Care Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-semibold text-blue-800">Diabetes Patients</p>
                      <p className="text-sm text-blue-600">3 patients need HbA1c follow-up</p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Schedule</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-green-800">Hypertension Group</p>
                      <p className="text-sm text-green-600">All patients within target BP range</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Communication Center</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Bulk Reminder
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    SMS Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-semibold">Today's Sent: 45</p>
                      <p className="text-gray-600">Response Rate: 78%</p>
                    </div>
                    <Button size="sm" className="w-full">View Analytics</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    WhatsApp Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-semibold">Today's Sent: 32</p>
                      <p className="text-gray-600">Response Rate: 92%</p>
                    </div>
                    <Button size="sm" className="w-full">Manage Templates</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-purple-600" />
                    Medication Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-semibold">Active Reminders: 156</p>
                      <p className="text-gray-600">Adherence: 89%</p>
                    </div>
                    <Button size="sm" className="w-full">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
