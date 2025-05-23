
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Patient } from './PatientCard';

interface HealthTrackingFormProps {
  patient: Patient | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const HealthTrackingForm = ({
  patient,
  onSubmit,
  isSubmitting,
  onCancel
}: HealthTrackingFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      weight: '',
      bloodPressure: '',
      glucoseLevel: '',
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Patient</label>
        <p className="text-sm mt-1">{patient ? `${patient.first_name} ${patient.last_name}` : 'N/A'}</p>
      </div>
      <div>
        <label className="text-sm font-medium">Weight (kg)</label>
        <Input 
          type="text" 
          className="mt-1" 
          {...register('weight')} 
          placeholder="e.g., 70.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Blood Pressure</label>
        <Input 
          type="text" 
          className="mt-1" 
          {...register('bloodPressure')} 
          placeholder="e.g., 120/80"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Glucose Level</label>
        <Input 
          type="text" 
          className="mt-1" 
          {...register('glucoseLevel')} 
          placeholder="e.g., 95"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea 
          className="mt-1" 
          {...register('notes')} 
          placeholder="Additional health notes"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save Health Data'}
        </Button>
      </div>
    </form>
  );
};
