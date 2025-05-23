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
import { useToast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, Clock, Search, X, Calendar, Edit, Trash2, MessageCircle, Phone, Mail as MailIcon, Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Define types that match the database schema
type AppointmentFromDB = {
  id: string;
  patient_id: string | null;
  date: string; // Format: YYYY-MM-DD
  created_at: string;
  time: string;
  type: string | null;
  status: string | null;
};

const appointmentSchema = z.object({
  patient_id: z.string().uuid(),
  date: z.date(),
  time: z.string().min(1, { message: 'Time is required' }),
  type: z.string().min(1, { message: 'Appointment type is required' }),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  medication: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

type Appointment = AppointmentFromDB & {
  medication?: string;
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  code_number: string;
  risk_level?: string;
  phone?: string;
  email?: string;
};

const AppointmentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create form for appointment
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: '',
      date: new Date(),
      time: '',
      type: '',
      status: 'pending',
      medication: '',
    },
  });

  // Create form for editing appointment
  const editForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: '',
      date: new Date(),
      time: '',
      type: '',
      status: 'pending',
      medication: '',
    },
  });

  // Form for medication
  const medicationForm = useForm({
    defaultValues: {
      medication: '',
    },
  });

  // Form for sending messages
  const messageForm = useForm({
    defaultValues: {
      message: '',
      method: 'all', // 'sms', 'whatsapp', 'email', 'all'
    },
  });

  // Form for sending reminders
  const reminderForm = useForm({
    defaultValues: {
      message: 'This is a reminder for your upcoming appointment.',
      sendTo: 'all', // 'high-risk', 'upcoming', 'all'
    },
  });

  // Query appointments with patient details
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');
      
      if (appointmentsError) {
        toast({ title: "Error", description: appointmentsError.message, variant: "destructive" });
        return { appointments: [], patients: [] };
      }
      
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, first_name, last_name, code_number, risk_level, phone, email');
      
      if (patientsError) {
        toast({ title: "Error", description: patientsError.message, variant: "destructive" });
        return { appointments: appointments || [], patients: [] };
      }
      
      return { 
        appointments: appointments as AppointmentFromDB[] || [], 
        patients: patients as Patient[] || []
      };
    }
  });

  // Query patients for selection
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, code_number, risk_level, phone, email');
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      
      return data as Patient[];
    }
  });

  // Add appointment mutation
  const addAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: AppointmentFormData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: newAppointment.patient_id,
          date: format(newAppointment.date, 'yyyy-MM-dd'),
          time: newAppointment.time,
          type: newAppointment.type,
          status: newAppointment.status,
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Success", description: "Appointment scheduled successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Edit appointment mutation
  const editAppointmentMutation = useMutation({
    mutationFn: async (updatedAppointment: AppointmentFormData & { id: string }) => {
      const { id, date, ...rest } = updatedAppointment;
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...rest,
          date: format(date, 'yyyy-MM-dd'),
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Success", description: "Appointment updated successfully" });
      setIsEditDialogOpen(false);
      setEditingAppointment(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Success", description: "Appointment deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ patientId, message, method }: { patientId: string, message: string, method: string }) => {
      // In a production app, this would connect to a messaging service API
      // For now, we'll simulate success
      console.log(`Sending message via ${method} to patient ${patientId}: ${message}`);
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

  const sendBulkRemindersMutation = useMutation({
    mutationFn: async ({ message, sendTo }: { message: string, sendTo: string }) => {
      // In a production app, this would connect to an SMS/WhatsApp API
      // For now, we'll simulate success
      console.log(`Sending bulk ${sendTo} reminders: ${message}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Reminders sent successfully" });
      setIsReminderDialogOpen(false);
      reminderForm.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to send reminders", variant: "destructive" });
    }
  });

  const onAddSubmit = (data: AppointmentFormData) => {
    addAppointmentMutation.mutate(data);
  };

  const onEditSubmit = (data: AppointmentFormData) => {
    if (editingAppointment) {
      editAppointmentMutation.mutate({ ...data, id: editingAppointment.id });
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    editForm.reset({
      patient_id: appointment.patient_id || '',
      date: appointment.date ? parse(appointment.date, 'yyyy-MM-dd', new Date()) : new Date(),
      time: appointment.time,
      type: appointment.type || '',
      status: (appointment.status || 'pending') as 'pending' | 'completed' | 'cancelled',
      medication: appointment.medication,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const handleSendMessage = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMessageDialogOpen(true);
  };

  const handleAddMedication = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    medicationForm.reset({ medication: appointment.medication || '' });
    setIsMedicationDialogOpen(true);
  };

  const onMessageSubmit = (data: any) => {
    if (selectedAppointment?.patient_id) {
      sendMessageMutation.mutate({
        patientId: selectedAppointment.patient_id,
        message: data.message,
        method: data.method,
      });
    }
  };

  const onMedicationSubmit = (data: any) => {
    if (selectedAppointment) {
      // In a real app, you would store this in the database
      // For now, we'll just show a success toast
      toast({ title: "Success", description: "Medication information updated" });
      setIsMedicationDialogOpen(false);
      medicationForm.reset();
    }
  };

  const onReminderSubmit = (data: any) => {
    sendBulkRemindersMutation.mutate({
      message: data.message,
      sendTo: data.sendTo,
    });
  };

  const appointments = appointmentsData?.appointments || [];
  const patientMap = new Map<string, Patient>();
  (appointmentsData?.patients || []).forEach(patient => {
    patientMap.set(patient.id, patient);
  });

  const filteredAppointments = appointments.filter(appointment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const patient = appointment.patient_id ? patientMap.get(appointment.patient_id) : null;
    
    return (
      (patient && patient.first_name.toLowerCase().includes(query)) ||
      (patient && patient.last_name.toLowerCase().includes(query)) ||
      (patient && patient.code_number.toLowerCase().includes(query)) ||
      (appointment.type && appointment.type.toLowerCase().includes(query)) ||
      (appointment.status && appointment.status.toLowerCase().includes(query)) ||
      (appointment.date && appointment.date.includes(query))
    );
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPatientName = (patientId: string | null) => {
    if (!patientId) return 'Unknown Patient';
    const patient = patientMap.get(patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  const getPatientContact = (patientId: string | null, type: 'phone' | 'email') => {
    if (!patientId) return null;
    const patient = patientMap.get(patientId);
    return patient ? patient[type] : null;
  };

  const groupAppointmentsByDate = () => {
    const grouped = new Map<string, Appointment[]>();
    
    filteredAppointments.forEach(appointment => {
      if (!grouped.has(appointment.date)) {
        grouped.set(appointment.date, []);
      }
      grouped.get(appointment.date)?.push(appointment);
    });
    
    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate();
  const sortedDates = Array.from(groupedAppointments.keys()).sort();

  const handleEmergencyContact = (patientId: string | null) => {
    if (!patientId) {
      toast({ title: "Error", description: "No patient associated with this appointment", variant: "destructive" });
      return;
    }

    const patient = patientMap.get(patientId);
    if (!patient || !patient.phone) {
      toast({ title: "Error", description: "No phone number available for emergency contact", variant: "destructive" });
      return;
    }

    // In a real app, this would trigger an emergency protocol
    // For demo purposes, we'll just show a success toast
    toast({
      title: "Emergency Contact Triggered",
      description: `Emergency services have been notified about patient ${patient.first_name} ${patient.last_name}`,
    });
  };

  const handleWhatsApp = (phone: string | undefined) => {
    if (!phone) {
      toast({ title: "Error", description: "No phone number available", variant: "destructive" });
      return;
    }
    
    // Remove any non-numeric characters from phone
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleSMS = (phone: string | undefined) => {
    if (!phone) {
      toast({ title: "Error", description: "No phone number available", variant: "destructive" });
      return;
    }
    
    window.location.href = `sms:${phone}`;
  };

  const handleEmail = (email: string | undefined) => {
    if (!email) {
      toast({ title: "Error", description: "No email available", variant: "destructive" });
      return;
    }
    
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search appointments..." 
              className="pl-8 w-full sm:w-[260px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patient_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(patients || []).map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} ({patient.code_number})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 14:30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="checkup">Regular Checkup</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter medication instructions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      disabled={addAppointmentMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {addAppointmentMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Reminders
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Bulk Reminders</DialogTitle>
              </DialogHeader>
              <form onSubmit={reminderForm.handleSubmit(onReminderSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Recipients</label>
                    <Select 
                      onValueChange={(value) => reminderForm.setValue('sendTo', value)} 
                      defaultValue={reminderForm.getValues('sendTo')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        <SelectItem value="high-risk">High Risk Patients</SelectItem>
                        <SelectItem value="upcoming">Upcoming Appointments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea 
                      placeholder="Enter reminder message" 
                      className="mt-1"
                      {...reminderForm.register('message')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsReminderDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={sendBulkRemindersMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {sendBulkRemindersMutation.isPending ? 'Sending...' : 'Send Reminders'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Appointment</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="patient_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(patients || []).map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} ({patient.code_number})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 14:30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="checkup">Regular Checkup</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter medication instructions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      disabled={editAppointmentMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editAppointmentMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Medication Dialog */}
          <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Medication Management</DialogTitle>
              </DialogHeader>
              <form onSubmit={medicationForm.handleSubmit(onMedicationSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Patient</label>
                  <p className="text-sm mt-1">{selectedAppointment ? getPatientName(selectedAppointment.patient_id) : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Appointment Date</label>
                  <p className="text-sm mt-1">
                    {selectedAppointment ? `${selectedAppointment.date} at ${selectedAppointment.time}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Medication Instructions</label>
                  <Textarea 
                    placeholder="Enter medication details, dosage, and instructions" 
                    className="mt-1"
                    {...medicationForm.register('medication')}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsMedicationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Medication Information
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
                  <p className="text-sm mt-1">{selectedAppointment ? getPatientName(selectedAppointment.patient_id) : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Select 
                    onValueChange={(value) => messageForm.setValue('method', value)} 
                    defaultValue={messageForm.getValues('method')}
                  >
                    <SelectTrigger>
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
                    placeholder="Type your message" 
                    className="mt-1"
                    {...messageForm.register('message')}
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
        <div className="p-4">
          {appointmentsLoading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-base font-semibold">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms" : "Get started by scheduling a new appointment"}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-1 rounded">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{date}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {groupedAppointments.get(date)?.map((appointment: Appointment) => {
                      const patient = appointment.patient_id ? patientMap.get(appointment.patient_id) : null;
                      return (
                        <Card key={appointment.id} className="overflow-hidden">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg flex justify-between items-center">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                <span>{appointment.time}</span>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Pending'}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-2">
                            <div className="text-sm font-medium flex justify-between items-center">
                              <span>{getPatientName(appointment.patient_id)}</span>
                              {patient && patient.risk_level === 'high' && (
                                <Badge variant="outline" className="ml-2 text-xs bg-red-50 border-red-300 text-red-700">
                                  High Risk
                                </Badge>
                              )}
                            </div>
                            
                            {appointment.type && (
                              <div className="text-sm text-gray-600">Type: {appointment.type}</div>
                            )}
                            
                            {appointment.medication && (
                              <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                                <span className="font-medium">Medication:</span> {appointment.medication}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleAddMedication(appointment)}
                              >
                                Medication
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleSendMessage(appointment)}
                              >
                                Message
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                onClick={() => handleEmergencyContact(appointment.patient_id)}
                              >
                                Emergency
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap pt-2 gap-1">
                              {patient?.phone && (
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
                              {patient?.email && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2"
                                  onClick={() => handleEmail(patient.email)}
                                >
                                  <MailIcon className="h-4 w-4 text-purple-600" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="flex justify-end space-x-1 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                onClick={() => {
                                  editAppointmentMutation.mutate({ 
                                    id: appointment.id, 
                                    patient_id: appointment.patient_id || '', 
                                    date: appointment.date ? parse(appointment.date, 'yyyy-MM-dd', new Date()) : new Date(),
                                    time: appointment.time,
                                    type: appointment.type || '',
                                    status: 'completed',
                                  });
                                }}
                                disabled={appointment.status === 'completed'}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {isMobile ? '' : 'Complete'}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditAppointment(appointment)}
                              >
                                <Edit className="h-4 w-4" />
                                {isMobile ? '' : <span className="ml-1">Edit</span>}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteAppointment(appointment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                {isMobile ? '' : <span className="ml-1">Delete</span>}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
