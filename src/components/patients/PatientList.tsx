
import { Patient, PatientCard } from './PatientCard';
import { EmptyPatientState } from './EmptyPatientState';
import { useToast } from '@/hooks/use-toast';

interface PatientListProps {
  patients: Patient[];
  isLoading: boolean;
  searchQuery: string;
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onAddReward: (patient: Patient) => void;
  onAddHealthTracking: (patient: Patient) => void;
  onSendMessage: (patient: Patient) => void;
}

export const PatientList = ({
  patients,
  isLoading,
  searchQuery,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
  onAddReward,
  onAddHealthTracking,
  onSendMessage
}: PatientListProps) => {
  const { toast } = useToast();
  
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

  if (isLoading) {
    return <div className="text-center py-4">Loading patients...</div>;
  }

  if (patients.length === 0) {
    return <EmptyPatientState hasSearchQuery={!!searchQuery} onAddPatient={onAddPatient} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard 
          key={patient.id}
          patient={patient}
          onEdit={onEditPatient}
          onDelete={onDeletePatient}
          onAddReward={onAddReward}
          onAddHealthTracking={onAddHealthTracking}
          onSendMessage={onSendMessage}
          onWhatsApp={handleWhatsApp}
          onSMS={handleSMS}
          onEmail={handleEmail}
        />
      ))}
    </div>
  );
};
