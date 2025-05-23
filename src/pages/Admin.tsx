
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from '@/components/AdminDashboard';
import PatientManagement from '@/components/PatientManagement';
import AppointmentManagement from '@/components/AppointmentManagement';
import RewardManagement from '@/components/RewardManagement';
import SettingsPanel from '@/components/SettingsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Calendar, Users, Award, MessageCircle, Settings, AlertCircle, Health } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const [doctorName, setDoctorName] = useState(localStorage.getItem('doctorName') || "Dr. Sarah Johnson");
  
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin-login');
      return;
    }

    // Handle the splash screen
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSplash]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  const handleBack = () => {
    navigate('/');
  };

  const updateDoctorName = (name: string) => {
    setDoctorName(name);
    localStorage.setItem('doctorName', name);
    toast({ title: "Success", description: "Doctor name updated successfully" });
  };

  const TabComponents = {
    dashboard: AdminDashboard,
    patients: PatientManagement,
    appointments: AppointmentManagement,
    rewards: RewardManagement,
    settings: SettingsPanel
  };

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 overflow-hidden">
        <div className="animate-fade-in animate-scale-in text-center max-w-3xl px-4">
          <div className="relative mb-6">
            <img 
              src="/lovable-uploads/72888aac-b824-42d4-b008-29c54e8afac6.png" 
              alt="Health Tracker" 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Health Tracker
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Revolutionizing Healthcare Follow-Up Care
          </p>
          <p className="text-sm mt-6 text-gray-500">
            By Adebayo Toheeb Kolawole<br />
            Full Stack Developer at PLP Academy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Welcome, {doctorName} | Manage patients, appointments & rewards
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className={isMobile ? "hidden" : "inline"}>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className={`${isMobile ? 'w-[500px] min-w-full' : 'grid w-full grid-cols-5'}`}>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Health className={`h-4 w-4 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center space-x-2">
                <Users className={`h-4 w-4 ${activeTab === 'patients' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Patients</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-2">
                <Calendar className={`h-4 w-4 ${activeTab === 'appointments' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center space-x-2">
                <Award className={`h-4 w-4 ${activeTab === 'rewards' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className={`h-4 w-4 ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <AdminDashboard doctorName={doctorName} updateDoctorName={updateDoctorName} />
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentManagement />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel doctorName={doctorName} updateDoctorName={updateDoctorName} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
