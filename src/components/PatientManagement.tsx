import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, UserPlus, Edit, Trash2, Phone, Mail, AlertTriangle, MessageCircle, Badge, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const patientSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  code_number: z.string().min(1, { message: 'Patient code is required' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  condition: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high']).default('low'),
});

type PatientFormData = z.infer<typeof patientSchema>;

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  code_number: string;
  phone: string | null;
  email: string | null;
  condition: string | null;
  risk_level: string | null;
  created_at: string;
};

const PatientManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [isHealthTrackingDialogOpen, setIsHealthTrackingDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      code_number: '',
      phone: '',
      email: '',
      condition: '',
      risk_level: 'low',
    },
  });

  const editForm = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      code_number: '',
      phone: '',
      email: '',
      condition: '',
      risk_level: 'low',
    },
  });

  // Form for health tracking
  const healthTrackingForm = useForm({
    defaultValues: {
      weight: '',
      bloodPressure: '',
      glucoseLevel: '',
      notes: '',
    },
  });

  // Form for rewards
  const rewardForm = useForm({
    defaultValues: {
      points: '10',
      action: 'appointment_attendance',
    },
  });

  // Form for messaging
  const messageForm = useForm({
    defaultValues: {
      message: '',
      method: 'all', // sms, whatsapp, email, all
    },
  });

  // Query patients
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data as Patient[];
    }
  });

  // Add patient mutation
  const addPatientMutation = useMutation({
    mutationFn: async (newPatient: PatientFormData) => {
      const { data, error } = await supabase.from('patients').insert(newPatient).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: "Success", description: "Patient added successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Edit patient mutation
  const editPatientMutation = useMutation({
    mutationFn: async (updatedPatient: PatientFormData & { id: string }) => {
      const { id, ...patientData } = updatedPatient;
      const { data, error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: "Success", description: "Patient updated successfully" });
      setIsEditDialogOpen(false);
      setEditingPatient(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: "Success", description: "Patient deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const addRewardMutation = useMutation({
    mutationFn: async ({ patientId, points, action }: { patientId: string, points: number, action: string }) => {
      // In a production app, this would add points to the patient's rewards
      console.log(`Adding ${points} points to patient ${patientId} for ${action}`);
      const { data, error } = await supabase
        .from('rewards')
        .insert([{
          patient_id: patientId,
          points,
          action,
        }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Reward added successfully" });
      setIsRewardDialogOpen(false);
      rewardForm.reset({ points: '10', action: 'appointment_attendance' });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add reward", variant: "destructive" });
    }
  });

  const addHealthTrackingMutation = useMutation({
    mutationFn: async (data: any) => {
      // In a production app, this would save health tracking data to a health_records table
      console.log('Health tracking data:', data);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Health data recorded successfully" });
      setIsHealthTrackingDialogOpen(false);
      healthTrackingForm.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to save health data", variant: "destructive" });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ patientId, message, method }: { patientId: string, message: string, method: string }) => {
      // In a production app, this would connect to a messaging service API
      console.log(`Sending ${method} message to patient ${patientId}: ${message}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Message sent successfully" });
      setIsMessageDialogOpen(false);
      messageForm.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  });

  const onAddSubmit = (data: PatientFormData) => {
    addPatientMutation.mutate(data);
  };

  const onEditSubmit = (data: PatientFormData) => {
    if (editingPatient) {
      editPatientMutation.mutate({ ...data, id: editingPatient.id });
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    editForm.reset({
      first_name: patient.first_name,
      last_name: patient.last_name,
      code_number: patient.code_number,
      phone: patient.phone || '',
      email: patient.email || '',
      condition: patient.condition || '',
      risk_level: (patient.risk_level || 'low') as 'low' | 'medium' | 'high',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      deletePatientMutation.mutate(id);
    }
  };

  const handleAddReward = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsRewardDialogOpen(true);
  };

  const handleAddHealthTracking = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsHealthTrackingDialogOpen(true);
  };

  const handleSendMessage = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsMessageDialogOpen(true);
  };

  const onRewardSubmit = (data: any) => {
    if (selectedPatient) {
      addRewardMutation.mutate({
        patientId: selectedPatient.id,
        points: Number(data.points),
        action: data.action,
      });
    }
  };

  const onHealthTrackingSubmit = (data: any) => {
    if (selectedPatient) {
      addHealthTrackingMutation.mutate({
        patientId: selectedPatient.id,
        ...data,
      });
    }
  };

  const onMessageSubmit = (data: any) => {
    if (selectedPatient) {
      sendMessageMutation.mutate({
        patientId: selectedPatient.id,
        message: data.message,
        method: data.method,
      });
    }
  };

  const handleWhatsApp = (phone: string | null) => {
    if (!phone) {
      toast({ title: "Error", description: "No phone number available", variant: "destructive" });
      return;
    }
    
    // Remove any non-numeric characters from phone
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleSMS = (phone: string | null) => {
    if (!phone) {
      toast({ title: "Error", description: "No phone number available", variant: "destructive" });
      return;
    }
    
    window.location.href = `sms:${phone}`;
  };

  const handleEmail = (email: string | null) => {
    if (!email) {
      toast({ title: "Error", description: "No email available", variant: "destructive" });
      return;
    }
    
    window.location.href = `mailto:${email}`;
  };

  const filteredPatients = patients?.filter(patient => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(query) ||
      patient.last_name.toLowerCase().includes(query) ||
      patient.code_number.toLowerCase().includes(query) ||
      (patient.email && patient.email.toLowerCase().includes(query)) ||
      (patient.condition && patient.condition.toLowerCase().includes(query))
    );
  }) || [];

  const getRiskLevelColor = (level: string | null) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients..." 
              className="pl-8 w-full sm:w-[260px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="code_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Unique identifier code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="For WhatsApp & SMS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Condition</FormLabel>
                        <FormControl>
                          <Input placeholder="Primary condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={addPatientMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {addPatientMutation.isPending ? 'Adding...' : 'Add Patient'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Patient</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={editForm.control}
                    name="code_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Unique identifier code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="For WhatsApp & SMS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Condition</FormLabel>
                        <FormControl>
                          <Input placeholder="Primary condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="risk_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={editPatientMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editPatientMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Reward Dialog */}
          <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Reward Points</DialogTitle>
              </DialogHeader>
              <form onSubmit={rewardForm.handleSubmit(onRewardSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Patient</label>
                  <p className="text-sm mt-1">{selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select 
                    onValueChange={(value) => rewardForm.setValue('action', value)} 
                    defaultValue={rewardForm.getValues('action')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment_attendance">Appointment Attendance</SelectItem>
                      <SelectItem value="medication_adherence">Medication Adherence</SelectItem>
                      <SelectItem value="health_goal_achievement">Health Goal Achievement</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="app_engagement">App Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Points</label>
                  <Input 
                    type="number" 
                    className="mt-1" 
                    {...rewardForm.register('points')} 
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsRewardDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={addRewardMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addRewardMutation.isPending ? 'Adding...' : 'Add Points'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Health Tracking Dialog */}
          <Dialog open={isHealthTrackingDialogOpen} onOpenChange={setIsHealthTrackingDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Health Tracking</DialogTitle>
              </DialogHeader>
              <form onSubmit={healthTrackingForm.handleSubmit(onHealthTrackingSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Patient</label>
                  <p className="text-sm mt-1">{selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input 
                    type="text" 
                    className="mt-1" 
                    {...healthTrackingForm.register('weight')} 
                    placeholder="e.g., 70.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Blood Pressure</label>
                  <Input 
                    type="text" 
                    className="mt-1" 
                    {...healthTrackingForm.register('bloodPressure')} 
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Glucose Level</label>
                  <Input 
                    type="text" 
                    className="mt-1" 
                    {...healthTrackingForm.register('glucoseLevel')} 
                    placeholder="e.g., 95"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    className="mt-1" 
                    {...healthTrackingForm.register('notes')} 
                    placeholder="Additional health notes"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsHealthTrackingDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={addHealthTrackingMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addHealthTrackingMutation.isPending ? 'Saving...' : 'Save Health Data'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Message Dialog */}
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
              </DialogHeader>
              <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To</label>
                  <p className="text-sm mt-1">{selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Select 
                    onValueChange={(value) => messageForm.setValue('method', value)} 
                    defaultValue={messageForm.getValues('method')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    className="mt-1" 
                    {...messageForm.register('message')} 
                    placeholder="Type your message"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsMessageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={sendMessageMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid gap-4 p-4">
          {isLoading ? (
            <div className="text-center py-4">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-base font-semibold">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms" : "Get started by adding a new patient"}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{patient.first_name} {patient.last_name}</span>
                      <div className={`text-xs px-2 py-1 rounded-full border ${getRiskLevelColor(patient.risk_level)}`}>
                        {patient.risk_level ? patient.risk_level.charAt(0).toUpperCase() + patient.risk_level.slice(1) : 'Low'} Risk
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="text-sm font-medium">Code: {patient.code_number}</div>
                    {patient.condition && (
                      <div className="text-sm text-gray-600">Condition: {patient.condition}</div>
                    )}
                    
                    <div className="flex flex-col space-y-1 text-sm">
                      {patient.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {patient.phone}
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {patient.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddHealthTracking(patient)}
                        className="w-full"
                      >
                        Health Tracking
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddReward(patient)}
                        className="w-full"
                      >
                        Add Rewards
                      </Button>
                    </div>

                    <div className="flex flex-wrap pt-2 gap-1">
                      {patient.phone && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() => handleWhatsApp(patient.phone)}
                          >
                            <Phone className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() => handleSMS(patient.phone)}
                          >
                            <MessageCircle className="h-4 w-4 text-blue-600" />
                          </Button>
                        </>
                      )}
                      {patient.email && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => handleEmail(patient.email)}
                        >
                          <Mail className="h-4 w-4 text-purple-600" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 ml-auto"
                        onClick={() => handleSendMessage(patient)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className={isMobile ? "hidden" : "ml-1"}>Message</span>
                      </Button>
                    </div>
                    
                    <div className="flex justify-end space-x-1 pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPatient(patient)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className={isMobile ? "hidden" : "ml-1"}>Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className={isMobile ? "hidden" : "ml-1"}>Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
