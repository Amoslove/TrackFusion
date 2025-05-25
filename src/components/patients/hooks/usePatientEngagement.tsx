
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePatientEngagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query surveys
  const { data: surveys, isLoading: surveysLoading } = useQuery({
    queryKey: ['patient_surveys'],
    queryFn: async () => {
      const { data, error } = await supabase.from('patient_surveys').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data;
    }
  });

  // Query medication schedules
  const { data: medicationSchedules, isLoading: medicationsLoading } = useQuery({
    queryKey: ['medication_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('medication_schedules').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data;
    }
  });

  // Query notification schedules
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notification_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notification_schedules').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data;
    }
  });

  // Query health tracking
  const { data: healthTracking, isLoading: healthTrackingLoading } = useQuery({
    queryKey: ['health_tracking'],
    queryFn: async () => {
      const { data, error } = await supabase.from('health_tracking').select('*');
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return [];
      }
      return data;
    }
  });

  // Create survey mutation
  const createSurveyMutation = useMutation({
    mutationFn: async (surveyData: any) => {
      const { data, error } = await supabase.from('patient_surveys').insert(surveyData).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient_surveys'] });
      toast({ title: "Success", description: "Survey created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Submit survey response mutation
  const submitSurveyResponseMutation = useMutation({
    mutationFn: async ({ surveyId, responses }: { surveyId: string, responses: any }) => {
      const { data, error } = await supabase
        .from('patient_surveys')
        .update({ 
          responses,
          completed_at: new Date().toISOString()
        })
        .eq('id', surveyId)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient_surveys'] });
      toast({ title: "Success", description: "Survey submitted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Create medication schedule mutation
  const createMedicationScheduleMutation = useMutation({
    mutationFn: async (medicationData: any) => {
      const { data, error } = await supabase.from('medication_schedules').insert(medicationData).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication_schedules'] });
      toast({ title: "Success", description: "Medication schedule created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Create notification schedule mutation
  const createNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      const { data, error } = await supabase.from('notification_schedules').insert(notificationData).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification_schedules'] });
      toast({ title: "Success", description: "Notification scheduled successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Create health tracking mutation
  const createHealthTrackingMutation = useMutation({
    mutationFn: async (healthData: any) => {
      const { data, error } = await supabase.from('health_tracking').insert(healthData).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health_tracking'] });
      toast({ title: "Success", description: "Health data recorded successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    surveys,
    medicationSchedules,
    notifications,
    healthTracking,
    surveysLoading,
    medicationsLoading,
    notificationsLoading,
    healthTrackingLoading,
    createSurveyMutation,
    submitSurveyResponseMutation,
    createMedicationScheduleMutation,
    createNotificationMutation,
    createHealthTrackingMutation
  };
};
