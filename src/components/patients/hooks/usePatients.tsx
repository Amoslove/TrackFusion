
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '../PatientCard';
import { PatientFormData } from '../PatientForm';

export const usePatients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

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
      // We need to ensure all required fields are present according to the schema
      const patientToAdd = {
        first_name: newPatient.first_name,
        last_name: newPatient.last_name,
        code_number: newPatient.code_number,
        phone: newPatient.phone || null,
        email: newPatient.email || null,
        condition: newPatient.condition || null,
        risk_level: newPatient.risk_level || 'low'
      };
      
      const { data, error } = await supabase.from('patients').insert(patientToAdd).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: "Success", description: "Patient added successfully" });
    },
    onError: (error: Error) => {
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
    },
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Add reward mutation
  const addRewardMutation = useMutation({
    mutationFn: async ({ patientId, points, action }: { patientId: string, points: number, action: string }) => {
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
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "Failed to add reward", variant: "destructive" });
    }
  });

  // Add health tracking mutation
  const addHealthTrackingMutation = useMutation({
    mutationFn: async (data: any) => {
      // In a production app, this would save health tracking data to a health_records table
      console.log('Health tracking data:', data);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Health data recorded successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "Failed to save health data", variant: "destructive" });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ patientId, message, method }: { patientId: string, message: string, method: string }) => {
      // In a production app, this would connect to a messaging service API
      console.log(`Sending ${method} message to patient ${patientId}: ${message}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Message sent successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  });

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

  return {
    patients,
    filteredPatients,
    isLoading,
    searchQuery,
    setSearchQuery,
    addPatientMutation,
    editPatientMutation,
    deletePatientMutation,
    addRewardMutation,
    addHealthTrackingMutation,
    sendMessageMutation
  };
};
