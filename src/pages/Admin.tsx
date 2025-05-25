import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from '@/components/AdminDashboard';
import AppointmentManagement from '@/components/AppointmentManagement';
import RewardManagement from '@/components/RewardManagement';
import SettingsPanel from '@/components/SettingsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Calendar, Users, Award, MessageCircle, Settings, AlertCircle, ActivitySquare } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { PatientManagementMain } from '@/components/patients/PatientManagementMain';

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

    // Handle the splash screen - make it more responsive
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Extended to 3 seconds for better UX
      return () => clearTimeout(timer);
    }
  }, [navigate, showSplash]);

  // Add global event listener for tab switching
  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => window.removeEventListener('switchTab', handleTabSwitch as EventListener);
  }, []);
  
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

  // Enhanced Splash Screen with shooting arrow animation
  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 overflow-hidden relative">
        {/* Shooting arrow animation */}
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse opacity-70"></div>
        <div className="absolute top-1/4 left-0 w-8 h-8 transform rotate-45 bg-blue-500 animate-bounce" style={{
          animation: 'shootArrow 2s ease-out forwards',
          clipPath: 'polygon(0% 50%, 40% 0%, 40% 30%, 100% 30%, 100% 70%, 40% 70%, 40% 100%)'
        }}></div>
        
        <div className="animate-fade-in animate-scale-in text-center max-w-4xl px-4 z-10">
          <div className="relative mb-8">
            <img 
              src="/lovable-uploads/72888aac-b824-42d4-b008-29c54e8afac6.png" 
              alt="Health Tracker" 
              className="w-full max-w-md h-auto mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 animate-fade-in">
              Health Tracker
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 animate-fade-in" style={{animationDelay: '0.5s'}}>
              Revolutionizing Healthcare Follow-Up Care
            </p>
            <div className="mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg animate-fade-in" style={{animationDelay: '1s'}}>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                Developed by <span className="text-blue-600 font-bold">Adebayo Toheeb Kolawole</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Full Stack Developer at PLP Academy
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shootArrow {
            0% {
              left: -50px;
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              left: calc(100% + 50px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size={isMobile ? "sm" : "icon"}
                onClick={handleBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Admin Panel
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Welcome, {doctorName} | Manage patients, appointments & rewards
                </p>
                <p className="text-xs text-gray-600 sm:hidden truncate">
                  {doctorName}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="text-red-600 border-red-600 hover:bg-red-50 flex-shrink-0"
              onClick={handleLogout}
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className={isMobile ? "text-xs" : "text-sm"}>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Responsive Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className={`${isMobile ? 'inline-flex min-w-max' : 'grid w-full grid-cols-5'} gap-1`}>
              <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                <ActivitySquare className={`h-3 w-3 sm:h-4 sm:w-4 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                <Users className={`h-3 w-3 sm:h-4 sm:w-4 ${activeTab === 'patients' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Patients</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                <Calendar className={`h-3 w-3 sm:h-4 sm:w-4 ${activeTab === 'appointments' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="hidden sm:inline">Appointments</span>
                <span className="sm:hidden">Appts</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                <Award className={`h-3 w-3 sm:h-4 sm:w-4 ${activeTab === 'rewards' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                <Settings className={`h-3 w-3 sm:h-4 sm:w-4 ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <AdminDashboard doctorName={doctorName} updateDoctorName={updateDoctorName} />
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagementMain />
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
