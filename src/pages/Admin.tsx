
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
import { ArrowLeft, LogOut } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  const handleBack = () => {
    navigate('/');
  };

  const TabComponents = {
    dashboard: AdminDashboard,
    patients: PatientManagement,
    appointments: AppointmentManagement,
    rewards: RewardManagement,
    settings: SettingsPanel
  };

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
                <p className="text-xs sm:text-sm text-gray-600">Manage patients, appointments & rewards</p>
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
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
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
