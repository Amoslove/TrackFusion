
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Heart, 
  Pill, 
  Award, 
  MessageSquare,
  Phone,
  CheckCircle,
  AlertCircle,
  Star,
  Gift,
  Bell
} from 'lucide-react';

interface PatientPortalProps {
  onBack: () => void;
}

const PatientPortal = ({ onBack }: PatientPortalProps) => {
  const [points, setPoints] = useState(1250);

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-25',
      time: '10:30 AM',
      doctor: 'Dr. Sarah Mitchell',
      type: 'Follow-up Consultation',
      status: 'confirmed',
      location: 'Room 302, Main Building'
    },
    {
      id: '2',
      date: '2024-02-15',
      time: '02:00 PM',
      doctor: 'Dr. Michael Chang',
      type: 'Cardiology Check-up',
      status: 'pending',
      location: 'Cardiology Wing, Floor 2'
    }
  ];

  const medications = [
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: '2:00 PM',
      adherence: 92,
      remaining: 28
    },
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: '8:00 AM',
      adherence: 88,
      remaining: 15
    }
  ];

  const recentMessages = [
    {
      from: 'Dr. Sarah Mitchell',
      subject: 'Lab Results Ready',
      time: '2 hours ago',
      unread: true
    },
    {
      from: 'Appointment Center',
      subject: 'Reminder: Tomorrow\'s Appointment',
      time: '1 day ago',
      unread: false
    },
    {
      from: 'Pharmacy',
      subject: 'Prescription Ready for Pickup',
      time: '2 days ago',
      unread: false
    }
  ];

  const rewards = [
    { points: 50, action: 'Attended appointment on time', date: '2024-01-20' },
    { points: 25, action: 'Completed medication adherence week', date: '2024-01-18' },
    { points: 100, action: 'Completed health assessment', date: '2024-01-15' },
    { points: 30, action: 'Confirmed appointment 24h in advance', date: '2024-01-12' }
  ];

  const availableRewards = [
    { points: 500, reward: '$10 Pharmacy Gift Card', description: 'Redeem for pharmacy purchases' },
    { points: 750, reward: 'Free Health Consultation', description: '30-minute telehealth session' },
    { points: 1000, reward: 'Wellness Kit', description: 'Blood pressure monitor & health guides' },
    { points: 1500, reward: '$25 Healthcare Credit', description: 'Apply to any medical bills' }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, Michael Chen</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{points} Points</span>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Next Appointment</p>
                  <p className="text-lg font-bold">Jan 25, 10:30 AM</p>
                  <p className="text-sm text-blue-200">Dr. Sarah Mitchell</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Medication Adherence</p>
                  <p className="text-lg font-bold">90%</p>
                  <p className="text-sm text-green-200">This month</p>
                </div>
                <Pill className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Health Score</p>
                  <p className="text-lg font-bold">85/100</p>
                  <p className="text-sm text-purple-200">Excellent</p>
                </div>
                <Heart className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="health">Health Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Appointments</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New
              </Button>
            </div>
            
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <Calendar className="w-6 h-6 text-blue-600 mx-auto" />
                          <p className="font-semibold text-sm">{appointment.date}</p>
                          <p className="text-xs text-gray-600">{appointment.time}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{appointment.type}</h4>
                          <p className="text-gray-600">{appointment.doctor}</p>
                          <p className="text-sm text-gray-500">{appointment.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {appointment.status === 'confirmed' ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
                        ) : (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                        )}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Confirm</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gift className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Earn 50 Points!</h4>
                      <p className="text-sm text-green-600">Confirm your appointment 24 hours in advance</p>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">Confirm Early</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Medication Management</h3>
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Reminder Settings
              </Button>
            </div>
            
            <div className="grid gap-4">
              {medications.map((medication, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Pill className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{medication.name}</h4>
                          <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                          <p className="text-sm text-gray-500">Next dose: {medication.nextDose}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Adherence</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={medication.adherence} className="w-20" />
                            <span className="text-sm font-semibold">{medication.adherence}%</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Remaining</p>
                          <p className="text-lg font-bold">{medication.remaining}</p>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Take Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Prescription Refill Needed</h4>
                      <p className="text-sm text-orange-600">Lisinopril will run out in 15 days</p>
                    </div>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Request Refill</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Messages & Notifications</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
            
            <div className="grid gap-4">
              {recentMessages.map((message, index) => (
                <Card key={index} className={`hover:shadow-md transition-shadow ${message.unread ? 'border-blue-200 bg-blue-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {message.from.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{message.from}</h4>
                          <p className="text-gray-600">{message.subject}</p>
                          <p className="text-sm text-gray-500">{message.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {message.unread && (
                          <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                        )}
                        <Button size="sm" variant="outline">Reply</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Rewards & Points</h3>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{points} Points Available</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Points Earned</CardTitle>
                  <CardDescription>Keep up the great work!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-green-800">+{reward.points} points</p>
                        <p className="text-sm text-green-600">{reward.action}</p>
                        <p className="text-xs text-gray-500">{reward.date}</p>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                  <CardDescription>Redeem your points for great benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{reward.reward}</p>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <p className="text-xs text-blue-600">{reward.points} points</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={points < reward.points}
                        className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                      >
                        {points >= reward.points ? 'Redeem' : 'Need More'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <h3 className="text-xl font-semibold">Health Tracking & Progress</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Vital Signs Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Blood Pressure</span>
                    <span className="font-semibold text-green-600">120/80 mmHg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Heart Rate</span>
                    <span className="font-semibold">72 bpm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Blood Sugar</span>
                    <span className="font-semibold text-blue-600">95 mg/dL</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Log New Reading
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Goals Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Daily Steps</span>
                      <span>7,500 / 10,000</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Water Intake</span>
                      <span>6 / 8 glasses</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Exercise Minutes</span>
                      <span>25 / 30 min</span>
                    </div>
                    <Progress value={83} />
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

export default PatientPortal;
