
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, Brain, Phone, MessageSquare, Activity, Plus, Clock, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface AdminDashboardProps {
  doctorName?: string;
  updateDoctorName?: (name: string) => void;
}

const AdminDashboard = ({ doctorName, updateDoctorName }: AdminDashboardProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeCard, setActiveCard] = useState<string | null>(null);

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

  const handleQuickSchedule = () => {
    toast({ 
      title: "Quick Schedule", 
      description: "Opening appointment scheduler...",
      duration: 2000 
    });
    // Switch to appointments tab
    const event = new CustomEvent('switchTab', { detail: 'appointments' });
    window.dispatchEvent(event);
  };

  const handleNewPatient = () => {
    toast({ 
      title: "New Patient", 
      description: "Opening patient registration...",
      duration: 2000 
    });
    // Switch to patients tab
    const event = new CustomEvent('switchTab', { detail: 'patients' });
    window.dispatchEvent(event);
  };

  const handleNewMessage = () => {
    toast({ 
      title: "Communication Center", 
      description: "Opening messaging system...",
      duration: 2000 
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600">Welcome back, {doctorName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleQuickSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Quick Schedule
          </Button>
          <Button 
            onClick={handleNewPatient}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards - Fully Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer transform transition-all duration-200 ${
            activeCard === 'patients' ? 'scale-105 shadow-lg' : 'hover:scale-102'
          }`}
          onClick={() => {
            setActiveCard('patients');
            handleNewPatient();
          }}
        >
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-blue-100 text-xs sm:text-sm truncate">Total Patients</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{patientCount}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer transform transition-all duration-200 ${
            activeCard === 'appointments' ? 'scale-105 shadow-lg' : 'hover:scale-102'
          }`}
          onClick={() => {
            setActiveCard('appointments');
            handleQuickSchedule();
          }}
        >
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-green-100 text-xs sm:text-sm truncate">Appointments</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{appointmentCount}</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-200 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer transform transition-all duration-200 ${
            activeCard === 'pending' ? 'scale-105 shadow-lg' : 'hover:scale-102'
          }`}
          onClick={() => setActiveCard('pending')}
        >
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-purple-100 text-xs sm:text-sm truncate">Pending</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{pendingAppointments}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer transform transition-all duration-200 ${
            activeCard === 'highrisk' ? 'scale-105 shadow-lg' : 'hover:scale-102'
          }`}
          onClick={() => setActiveCard('highrisk')}
        >
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-red-100 text-xs sm:text-sm truncate">High Risk</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{highRiskPatients}</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-200 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Enhanced for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Patient Management
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Register and track patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex-1 text-xs sm:text-sm" 
                onClick={handleNewPatient}
                size={isMobile ? "sm" : "default"}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Patient
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm" 
                onClick={handleNewPatient}
                size={isMobile ? "sm" : "default"}
              >
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
              Appointments
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 flex-1 text-xs sm:text-sm" 
                onClick={handleQuickSchedule}
                size={isMobile ? "sm" : "default"}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Schedule
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm" 
                onClick={handleQuickSchedule}
                size={isMobile ? "sm" : "default"}
              >
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Communication
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">WhatsApp, SMS & Email messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 flex-1 text-xs sm:text-sm"
                onClick={handleNewMessage}
                size={isMobile ? "sm" : "default"}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Message
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm"
                size={isMobile ? "sm" : "default"}
              >
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
