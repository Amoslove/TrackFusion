
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, MessageSquare, Shield, GlobeLock, Megaphone, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const adminPasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SettingsPanel = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('general');
  
  // Password change form
  const passwordForm = useForm<z.infer<typeof adminPasswordSchema>>({
    resolver: zodResolver(adminPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Settings states
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [voiceBotEnabled, setVoiceBotEnabled] = useState(false);
  const [autoReminderDays, setAutoReminderDays] = useState(3);
  const [rewardPointsEnabled, setRewardPointsEnabled] = useState(true);
  const [defaultRiskLevel, setDefaultRiskLevel] = useState('low');

  const onPasswordSubmit = (data: z.infer<typeof adminPasswordSchema>) => {
    // For this example app, we're not actually changing any password
    // In a real app, this would update the password in the database
    toast({
      title: "Password updated",
      description: "Your admin password has been successfully updated",
    });
    
    passwordForm.reset();
  };

  const saveGeneralSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };

  const saveSecuritySettings = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GlobeLock className="w-5 h-5 mr-2 text-blue-600" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Auto-Reminder Days</FormLabel>
                    <Select 
                      defaultValue={autoReminderDays.toString()} 
                      onValueChange={(value) => setAutoReminderDays(parseInt(value, 10))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day before</SelectItem>
                        <SelectItem value="2">2 days before</SelectItem>
                        <SelectItem value="3">3 days before</SelectItem>
                        <SelectItem value="5">5 days before</SelectItem>
                        <SelectItem value="7">7 days before</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Days before appointment to send automatic reminders
                    </p>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Default Risk Level</FormLabel>
                    <Select 
                      defaultValue={defaultRiskLevel} 
                      onValueChange={setDefaultRiskLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Default risk level for new patients
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <FormLabel>Reward Points System</FormLabel>
                      <p className="text-sm text-gray-500">
                        Enable points-based rewards for patient compliance
                      </p>
                    </div>
                    <Switch 
                      checked={rewardPointsEnabled}
                      onCheckedChange={setRewardPointsEnabled}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <FormLabel>Language</FormLabel>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-2">
                      System display language (patient communications use their preferred language)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGeneralSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure communication preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <FormLabel>SMS Reminders</FormLabel>
                      <p className="text-sm text-gray-500">
                        Send SMS text message reminders
                      </p>
                    </div>
                    <Switch 
                      checked={smsEnabled}
                      onCheckedChange={setSmsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <FormLabel>Email Notifications</FormLabel>
                      <p className="text-sm text-gray-500">
                        Send email notifications
                      </p>
                    </div>
                    <Switch 
                      checked={emailEnabled}
                      onCheckedChange={setEmailEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <FormLabel>WhatsApp Messages</FormLabel>
                      <p className="text-sm text-gray-500">
                        Send WhatsApp message reminders
                      </p>
                    </div>
                    <Switch 
                      checked={whatsappEnabled}
                      onCheckedChange={setWhatsappEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <FormLabel>Voice Bot Calls</FormLabel>
                      <p className="text-sm text-gray-500">
                        Enable automated voice calls for elderly patients
                      </p>
                    </div>
                    <Switch 
                      checked={voiceBotEnabled}
                      onCheckedChange={setVoiceBotEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4 flex items-center">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Reminder Templates
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <FormLabel>Appointment Reminder</FormLabel>
                    <Input 
                      defaultValue="Hello {patient_name}, this is a reminder about your appointment on {date} at {time} with {doctor}. Reply Y to confirm." 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Follow-up Reminder</FormLabel>
                    <Input 
                      defaultValue="Hello {patient_name}, please don't forget your follow-up appointment on {date}. Your health is important to us!" 
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Session Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Session Timeout (minutes)</FormLabel>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">
                        Time before inactive users are automatically logged out
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <FormLabel>Force HTTPS</FormLabel>
                        <p className="text-sm text-gray-500">
                          Always use secure connection
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Data Protection</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <FormLabel>End-to-end Encryption</FormLabel>
                        <p className="text-sm text-gray-500">
                          Encrypt all patient communications
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <FormLabel>HIPAA Compliance Mode</FormLabel>
                        <p className="text-sm text-gray-500">
                          Apply strict data handling rules
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Audit Log</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    System keeps detailed logs of all user actions for compliance
                  </p>
                  <Button variant="outline" size="sm">View Logs</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSecuritySettings}>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Admin Account
              </CardTitle>
              <CardDescription>Manage your admin account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Change Admin Password</h3>
                
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Change Password</Button>
                  </form>
                </Form>
              </div>
              
              <div className="pt-8 border-t">
                <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Reset All Settings</h4>
                      <p className="text-sm text-gray-600">
                        Reset all settings to default values
                      </p>
                    </div>
                    <Button variant="destructive">Reset</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
