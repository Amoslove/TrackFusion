
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  Bell,
  Activity,
  TrendingUp,
  FileText
} from 'lucide-react';

interface PatientPortalProps {
  onBack: () => void;
  patientId?: string;
}

const PatientPortal = ({ onBack, patientId = 'mock-patient-id' }: PatientPortalProps) => {
  const [points, setPoints] = useState(1250);

  // Query patient data
  const { data: patient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!patientId
  });

  // Query appointments
  const { data: appointments } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId
  });

  // Query medication schedules
  const { data: medications } = useQuery({
    queryKey: ['patient-medications', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_schedules')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId
  });

  // Query health tracking
  const { data: healthData } = useQuery({
    queryKey: ['patient-health-tracking', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_tracking')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId
  });

  // Query surveys
  const { data: surveys } = useQuery({
    queryKey: ['patient-surveys', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_surveys')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId
  });

  // Query rewards
  const { data: rewards } = useQuery({
    queryKey: ['patient-rewards', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId
  });

  // Calculate total points from rewards
  useEffect(() => {
    if (rewards) {
      const totalPoints = rewards.reduce((sum, reward) => sum + (reward.points || 0), 0);
      setPoints(totalPoints);
    }
  }, [rewards]);

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.date) >= new Date()
  ).slice(0, 2) || [];

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
    }
  ];

  const availableRewards = [
    { points: 500, reward: '$10 Pharmacy Gift Card', description: 'Redeem for pharmacy purchases' },
    { points: 750, reward: 'Free Health Consultation', description: '30-minute telehealth session' },
    { points: 1000, reward: 'Wellness Kit', description: 'Blood pressure monitor & health guides' },
    { points: 1500, reward: '$25 Healthcare Credit', description: 'Apply to any medical bills' }
  ];

  const recordVitalSigns = () => {
    // This would typically open a form to record vital signs
    console.log('Recording vital signs...');
  };

  const submitHealthGoal = () => {
    // This would typically open a form to set health goals
    console.log('Setting health goals...');
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
                <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {patient ? `${patient.first_name} ${patient.last_name}` : 'Patient'}
                </p>
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
                  {upcomingAppointments.length > 0 ? (
                    <>
                      <p className="text-lg font-bold">{upcomingAppointments[0].date} at {upcomingAppointments[0].time}</p>
                      <p className="text-sm text-blue-200">{upcomingAppointments[0].type || 'Consultation'}</p>
                    </>
                  ) : (
                    <p className="text-lg font-bold">No upcoming appointments</p>
                  )}
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Medications</p>
                  <p className="text-lg font-bold">{medications?.length || 0}</p>
                  <p className="text-sm text-green-200">Current prescriptions</p>
                </div>
                <Pill className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Health Records</p>
                  <p className="text-lg font-bold">{healthData?.length || 0}</p>
                  <p className="text-sm text-purple-200">Tracked metrics</p>
                </div>
                <Activity className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="health">Health Tracking</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
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
                          <h4 className="font-semibold text-lg">{appointment.type || 'Consultation'}</h4>
                          <p className="text-gray-600">Healthcare Provider</p>
                          <p className="text-sm text-gray-500">Main Office</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={appointment.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Confirm</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {upcomingAppointments.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No upcoming appointments scheduled</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Your First Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
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
              {medications?.map((medication) => (
                <Card key={medication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Pill className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{medication.medication_name}</h4>
                          <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                          <p className="text-sm text-gray-500">Started: {medication.start_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Reminder Times</p>
                          <div className="flex flex-wrap gap-1">
                            {medication.reminder_times?.map((time, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Taken
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || []}
              
              {(!medications || medications.length === 0) && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No active medications</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <h3 className="text-xl font-semibold">Health Tracking & Progress</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Recent Health Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthData?.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold capitalize">{record.tracking_type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.recorded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{JSON.stringify(record.value)}</p>
                        {record.notes && (
                          <p className="text-xs text-gray-500">{record.notes}</p>
                        )}
                      </div>
                    </div>
                  )) || []}
                  
                  <Button onClick={recordVitalSigns} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Record New Data
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
                  
                  <Button onClick={submitHealthGoal} className="w-full bg-green-600 hover:bg-green-700">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Update Goals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Health Surveys</h3>
            </div>
            
            <div className="grid gap-4">
              {surveys?.map((survey) => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold capitalize">
                            {survey.survey_type.replace('_', ' ')} Survey
                          </h4>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(survey.created_at).toLocaleDateString()}
                          </p>
                          {survey.completed_at && (
                            <p className="text-sm text-green-600">
                              Completed: {new Date(survey.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {survey.completed_at ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                        ) : (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                        )}
                        {!survey.completed_at && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Complete Survey
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || []}
              
              {(!surveys || surveys.length === 0) && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No surveys available</p>
                  </CardContent>
                </Card>
              )}
            </div>
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
                  {rewards?.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-green-800">+{reward.points} points</p>
                        <p className="text-sm text-green-600">{reward.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(reward.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  )) || []}
                  
                  {(!rewards || rewards.length === 0) && (
                    <p className="text-gray-500 text-center">No rewards earned yet</p>
                  )}
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
        </Tabs>
      </div>
    </div>
  );
};

export default PatientPortal;
