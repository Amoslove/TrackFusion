
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, Brain, Phone, MessageSquare, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data || [];
    }
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('appointments').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data || [];
    }
  });

  // Calculate stats
  const patientCount = patients?.length || 0;
  const appointmentCount = appointments?.length || 0;
  const pendingAppointments = appointments?.filter(app => app.status === 'pending').length || 0;
  const completedAppointments = appointments?.filter(app => app.status === 'completed').length || 0;
  const highRiskPatients = patients?.filter(p => p.risk_level === 'high').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/admin/patients')}>
            <span className={isMobile ? "hidden" : "inline-block mr-2"}>New Patient</span>
            <Users className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => navigate('/admin/appointments')} 
            variant="outline"
          >
            <span className={isMobile ? "hidden" : "inline-block mr-2"}>Schedule</span>
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Patients</p>
                <p className="text-2xl sm:text-3xl font-bold">{patientCount}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Appointments</p>
                <p className="text-2xl sm:text-3xl font-bold">{appointmentCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Pending Appts.</p>
                <p className="text-2xl sm:text-3xl font-bold">{pendingAppointments}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">High Risk</p>
                <p className="text-2xl sm:text-3xl font-bold">{highRiskPatients}</p>
              </div>
              <Brain className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Patient Management
            </CardTitle>
            <CardDescription>Register and track patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700 flex-1" onClick={() => navigate('/admin/patients')}>
                <Users className="w-4 h-4 mr-2" />
                New Patient
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/patients')}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Appointments
            </CardTitle>
            <CardDescription>Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button className="bg-green-600 hover:bg-green-700 flex-1" onClick={() => navigate('/admin/appointments')}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/appointments')}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Communication
            </CardTitle>
            <CardDescription>WhatsApp and SMS messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button className="bg-purple-600 hover:bg-purple-700 flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Message
              </Button>
              <Button variant="outline" className="flex-1">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
