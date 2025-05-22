
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Brain, Phone, MessageSquare, Award, Shield, Globe, Wifi, Heart } from 'lucide-react';
import DoctorDashboard from '@/components/DoctorDashboard';
import PatientPortal from '@/components/PatientPortal';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [activeView, setActiveView] = useState<'overview' | 'doctor' | 'patient' | 'admin'>('overview');

  const features = [
    {
      icon: Brain,
      title: "AI-Based Scheduling & Prediction",
      description: "Flags high-risk patients who miss appointments frequently using machine learning algorithms.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "EHR Integration",
      description: "Syncs with existing hospital EHR systems and Practice Management Software automatically.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Doctor & Patient Dashboards",
      description: "Comprehensive portals for both healthcare providers and patients with real-time updates.",
      color: "bg-purple-500"
    },
    {
      icon: Phone,
      title: "Multi-Channel Communication",
      description: "SMS, WhatsApp, Email, and Voice Bot integration for comprehensive patient outreach.",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "HIPAA/GDPR Compliant",
      description: "End-to-end encryption with secure consent mechanisms for data protection.",
      color: "bg-red-500"
    },
    {
      icon: Heart,
      title: "Chronic Care Support",
      description: "Specialized reminders for chronic illness patients with medication adherence tracking.",
      color: "bg-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Voice Bot for Rural/Elderly",
      description: "Accessible voice-based reminders for patients in low-resource settings.",
      color: "bg-indigo-500"
    },
    {
      icon: Globe,
      title: "Global Scalability",
      description: "Multilingual interface with timezone support and localized reminder templates.",
      color: "bg-cyan-500"
    },
    {
      icon: Wifi,
      title: "Offline Mode with Sync",
      description: "Works in areas with poor connectivity, syncing when connection is restored.",
      color: "bg-teal-500"
    },
    {
      icon: Award,
      title: "Reward-Based Engagement",
      description: "Points-based system encouraging patients to consistently attend follow-ups.",
      color: "bg-yellow-500"
    }
  ];

  if (activeView === 'doctor') {
    return <DoctorDashboard onBack={() => setActiveView('overview')} />;
  }

  if (activeView === 'patient') {
    return <PatientPortal onBack={() => setActiveView('overview')} />;
  }

  if (activeView === 'admin') {
    return <AdminPanel onBack={() => setActiveView('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CareAI Follow-Up</h1>
                <p className="text-sm text-gray-600">Intelligent Healthcare Reminder System</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setActiveView('doctor')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Doctor Dashboard
              </Button>
              <Button 
                onClick={() => setActiveView('patient')}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Patient Portal
              </Button>
              <Button 
                onClick={() => setActiveView('admin')}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionizing Healthcare Follow-Up Care
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AI-powered system that automatically reminds both doctors and patients of appointments, 
            reduces no-shows, and improves patient outcomes through intelligent scheduling and prediction.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              GDPR Ready
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              Multi-Language
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              24/7 Monitoring
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Patients Managed</p>
                  <p className="text-3xl font-bold">12,847</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Appointments Scheduled</p>
                  <p className="text-3xl font-bold">8,234</p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">No-Show Reduction</p>
                  <p className="text-3xl font-bold">67%</p>
                </div>
                <Brain className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Messages Sent</p>
                  <p className="text-3xl font-bold">45,621</p>
                </div>
                <MessageSquare className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Comprehensive Healthcare Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Healthcare Practice?</h3>
          <p className="text-lg mb-6 text-blue-100">
            Join thousands of healthcare providers who have reduced no-shows and improved patient outcomes.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setActiveView('doctor')}
            >
              Start Doctor Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => setActiveView('patient')}
            >
              Patient Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
