
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
import { Badge } from '@/components/ui/badge';
import { Award, Search, Gift, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const rewardSchema = z.object({
  patient_id: z.string().uuid(),
  points: z.number().int().positive(),
  action: z.string().min(1, { message: 'Action description is required' }),
});

type Reward = z.infer<typeof rewardSchema> & {
  id: string;
  date: string;
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  code_number: string;
};

const RewardManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<z.infer<typeof rewardSchema>>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      patient_id: '',
      points: 10,
      action: '',
    },
  });

  const editForm = useForm<z.infer<typeof rewardSchema>>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      patient_id: '',
      points: 10,
      action: '',
    },
  });

  // Query rewards with patient details
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('date', { ascending: false });
      
      if (rewardsError) {
        toast({ title: "Error", description: rewardsError.message, variant: "destructive" });
        return { rewards: [], patients: [] };
      }
      
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, first_name, last_name, code_number');
      
      if (patientsError) {
        toast({ title: "Error", description: patientsError.message, variant: "destructive" });
        return { rewards: rewards || [], patients: [] };
      }
      
      return { 
        rewards: rewards as Reward[] || [], 
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
        .select('id, first_name, last_name, code_number');
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      
      return data as Patient[];
    }
  });

  // Add reward mutation
  const addRewardMutation = useMutation({
    mutationFn: async (newReward: z.infer<typeof rewardSchema>) => {
      const { data, error } = await supabase
        .from('rewards')
        .insert([newReward])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast({ title: "Success", description: "Reward added successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Edit reward mutation
  const editRewardMutation = useMutation({
    mutationFn: async (updatedReward: Reward) => {
      const { id, date, ...rewardData } = updatedReward;
      const { data, error } = await supabase
        .from('rewards')
        .update(rewardData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast({ title: "Success", description: "Reward updated successfully" });
      setIsEditDialogOpen(false);
      setEditingReward(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete reward mutation
  const deleteRewardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rewards').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast({ title: "Success", description: "Reward deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const onAddSubmit = (data: z.infer<typeof rewardSchema>) => {
    addRewardMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof rewardSchema>) => {
    if (editingReward) {
      editRewardMutation.mutate({ 
        ...data, 
        id: editingReward.id, 
        date: editingReward.date
      });
    }
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    editForm.reset({
      patient_id: reward.patient_id,
      points: reward.points,
      action: reward.action || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteReward = (id: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      deleteRewardMutation.mutate(id);
    }
  };

  const rewards = rewardsData?.rewards || [];
  const patientMap = new Map();
  (rewardsData?.patients || []).forEach(patient => {
    patientMap.set(patient.id, patient);
  });

  // Calculate total points per patient
  const patientPoints = new Map();
  rewards.forEach(reward => {
    const patientId = reward.patient_id;
    const currentPoints = patientPoints.get(patientId) || 0;
    patientPoints.set(patientId, currentPoints + (reward.points || 0));
  });

  const filteredRewards = rewards.filter(reward => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const patient = patientMap.get(reward.patient_id);
    
    return (
      (patient && patient.first_name.toLowerCase().includes(query)) ||
      (patient && patient.last_name.toLowerCase().includes(query)) ||
      (patient && patient.code_number.toLowerCase().includes(query)) ||
      reward.action?.toLowerCase().includes(query)
    );
  });

  const getPatientName = (patientId: string) => {
    const patient = patientMap.get(patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Rewards Management</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search rewards..." 
              className="pl-8 w-full sm:w-[260px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Award className="h-4 w-4 mr-2" />
                Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Reward</DialogTitle>
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
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of points" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="appointment_attended">Attended Appointment</SelectItem>
                              <SelectItem value="medication_adherence">Medication Adherence</SelectItem>
                              <SelectItem value="health_goal">Reached Health Goal</SelectItem>
                              <SelectItem value="referral">Patient Referral</SelectItem>
                              <SelectItem value="early_arrival">Early Arrival</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                      disabled={addRewardMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {addRewardMutation.isPending ? 'Adding...' : 'Add Reward'}
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
                <DialogTitle>Edit Reward</DialogTitle>
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
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of points" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="appointment_attended">Attended Appointment</SelectItem>
                              <SelectItem value="medication_adherence">Medication Adherence</SelectItem>
                              <SelectItem value="health_goal">Reached Health Goal</SelectItem>
                              <SelectItem value="referral">Patient Referral</SelectItem>
                              <SelectItem value="early_arrival">Early Arrival</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                      disabled={editRewardMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editRewardMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Top Patients with Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from(patientPoints.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([patientId, points]) => {
            const patient = patientMap.get(patientId);
            if (!patient) return null;
            return (
              <Card key={patientId} className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="font-semibold text-md">{patient?.first_name} {patient?.last_name}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-amber-600">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="text-xl font-bold">{points}</span>
                      </div>
                      <p className="text-xs text-gray-600">points earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          {rewardsLoading ? (
            <div className="text-center py-4">Loading rewards...</div>
          ) : filteredRewards.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-base font-semibold">No rewards found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms" : "Get started by adding a new reward"}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Award className="h-4 w-4 mr-2" />
                    Add Reward
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRewards.map(reward => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{getPatientName(reward.patient_id)}</span>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <Award className="mr-1 h-3 w-3" />
                        {reward.points} points
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Action: </span>
                      {reward.action === 'appointment_attended' ? 'Attended Appointment' :
                       reward.action === 'medication_adherence' ? 'Medication Adherence' : 
                       reward.action === 'health_goal' ? 'Reached Health Goal' : 
                       reward.action === 'referral' ? 'Patient Referral' : 
                       reward.action === 'early_arrival' ? 'Early Arrival' : 
                       reward.action}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Awarded on: {new Date(reward.date).toLocaleDateString()}
                    </div>
                    
                    <div className="flex justify-end space-x-1 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditReward(reward)}
                      >
                        <Edit className="h-4 w-4" />
                        {isMobile ? '' : <span className="ml-1">Edit</span>}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {isMobile ? '' : <span className="ml-1">Delete</span>}
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

export default RewardManagement;
