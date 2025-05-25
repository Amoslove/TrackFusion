import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus, FileText, Pill, Bell, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PatientForm, PatientFormData } from './patients/PatientForm';
import { PatientList } from './patients/PatientList';
import { MessageForm } from './patients/MessageForm';
import { RewardForm } from './patients/RewardForm';
import { HealthTrackingForm } from './patients/HealthTrackingForm';
import { SurveyForm } from './patients/SurveyForm';
import { MedicationScheduleForm } from './patients/MedicationScheduleForm';
import { NotificationScheduleForm } from './patients/NotificationScheduleForm';
import { usePatients } from './patients/hooks/usePatients';
import { usePatientEngagement } from './patients/hooks/usePatientEngagement';
import { Patient } from './patients/PatientCard';

const PatientManagement = () => {
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [isHealthTrackingDialogOpen, setIsHealthTrackingDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [surveyType, setSurveyType] = useState<'pre_appointment' | 'post_appointment' | 'general_health'>('general_health');

  const {
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
  } = usePatients();

  const {
    createSurveyMutation,
    createMedicationScheduleMutation,
    createNotificationMutation,
    createHealthTrackingMutation
  } = usePatientEngagement();

  const handleAddPatient = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
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

  const handleCreateSurvey = (patient: Patient, type: 'pre_appointment' | 'post_appointment' | 'general_health') => {
    setSelectedPatient(patient);
    setSurveyType(type);
    setIsSurveyDialogOpen(true);
  };

  const handleAddMedication = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsMedicationDialogOpen(true);
  };

  const handleScheduleNotification = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsNotificationDialogOpen(true);
  };

  const onAddSubmit = (data: PatientFormData) => {
    addPatientMutation.mutate(data);
    setIsAddDialogOpen(false);
  };

  const onEditSubmit = (data: PatientFormData) => {
    if (editingPatient) {
      editPatientMutation.mutate({ ...data, id: editingPatient.id });
      setIsEditDialogOpen(false);
      setEditingPatient(null);
    }
  };

  const onRewardSubmit = (data: any) => {
    if (selectedPatient) {
      addRewardMutation.mutate({
        patientId: selectedPatient.id,
        points: Number(data.points),
        action: data.action,
      });
      setIsRewardDialogOpen(false);
    }
  };

  const onHealthTrackingSubmit = (data: any) => {
    if (selectedPatient) {
      addHealthTrackingMutation.mutate({
        patientId: selectedPatient.id,
        ...data,
      });
      setIsHealthTrackingDialogOpen(false);
    }
  };

  const onMessageSubmit = (data: any) => {
    if (selectedPatient) {
      sendMessageMutation.mutate({
        patientId: selectedPatient.id,
        message: data.message,
        method: data.method,
      });
      setIsMessageDialogOpen(false);
    }
  };

  const onSurveySubmit = (data: any) => {
    createSurveyMutation.mutate(data);
    setIsSurveyDialogOpen(false);
  };

  const onMedicationSubmit = (data: any) => {
    createMedicationScheduleMutation.mutate(data);
    setIsMedicationDialogOpen(false);
  };

  const onNotificationSubmit = (data: any) => {
    createNotificationMutation.mutate(data);
    setIsNotificationDialogOpen(false);
  };

  const onPatientHealthTrackingSubmit = (data: any) => {
    if (selectedPatient) {
      createHealthTrackingMutation.mutate({
        patient_id: selectedPatient.id,
        tracking_type: data.tracking_type,
        value: data.value,
        notes: data.notes
      });
      setIsHealthTrackingDialogOpen(false);
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
              <PatientForm
                onSubmit={onAddSubmit}
                isSubmitting={addPatientMutation.isPending}
                submitLabel="Add Patient"
                cancelAction={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid gap-4 p-4">
          <PatientList 
            patients={filteredPatients}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
            onAddReward={handleAddReward}
            onAddHealthTracking={handleAddHealthTracking}
            onSendMessage={handleSendMessage}
            onCreateSurvey={handleCreateSurvey}
            onAddMedication={handleAddMedication}
            onScheduleNotification={handleScheduleNotification}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <PatientForm
              defaultValues={{
                first_name: editingPatient.first_name,
                last_name: editingPatient.last_name,
                code_number: editingPatient.code_number,
                phone: editingPatient.phone || '',
                email: editingPatient.email || '',
                condition: editingPatient.condition || '',
                risk_level: (editingPatient.risk_level || 'low') as 'low' | 'medium' | 'high',
              }}
              onSubmit={onEditSubmit}
              isSubmitting={editPatientMutation.isPending}
              submitLabel="Save Changes"
              cancelAction={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reward Dialog */}
      <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Reward Points</DialogTitle>
          </DialogHeader>
          <RewardForm
            patient={selectedPatient}
            onSubmit={onRewardSubmit}
            isSubmitting={addRewardMutation.isPending}
            onCancel={() => setIsRewardDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Health Tracking Dialog */}
      <Dialog open={isHealthTrackingDialogOpen} onOpenChange={setIsHealthTrackingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Health Tracking</DialogTitle>
          </DialogHeader>
          <HealthTrackingForm
            patient={selectedPatient}
            onSubmit={onHealthTrackingSubmit}
            isSubmitting={addHealthTrackingMutation.isPending}
            onCancel={() => setIsHealthTrackingDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <MessageForm
            patient={selectedPatient}
            onSubmit={onMessageSubmit}
            isSubmitting={sendMessageMutation.isPending}
            onCancel={() => setIsMessageDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Survey Dialog */}
      <Dialog open={isSurveyDialogOpen} onOpenChange={setIsSurveyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Patient Survey</DialogTitle>
          </DialogHeader>
          <SurveyForm
            patient={selectedPatient}
            surveyType={surveyType}
            onSubmit={onSurveySubmit}
            isSubmitting={createSurveyMutation.isPending}
            onCancel={() => setIsSurveyDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Medication Dialog */}
      <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Medication Schedule</DialogTitle>
          </DialogHeader>
          <MedicationScheduleForm
            patient={selectedPatient}
            onSubmit={onMedicationSubmit}
            isSubmitting={createMedicationScheduleMutation.isPending}
            onCancel={() => setIsMedicationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Notification</DialogTitle>
          </DialogHeader>
          <NotificationScheduleForm
            patient={selectedPatient}
            onSubmit={onNotificationSubmit}
            isSubmitting={createNotificationMutation.isPending}
            onCancel={() => setIsNotificationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;
