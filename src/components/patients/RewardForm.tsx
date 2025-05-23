
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from './PatientCard';

interface RewardFormProps {
  patient: Patient | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const RewardForm = ({
  patient,
  onSubmit,
  isSubmitting,
  onCancel
}: RewardFormProps) => {
  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      points: '10',
      action: 'appointment_attendance',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Patient</label>
        <p className="text-sm mt-1">{patient ? `${patient.first_name} ${patient.last_name}` : 'N/A'}</p>
      </div>
      <div>
        <label className="text-sm font-medium">Action</label>
        <Select 
          onValueChange={(value) => setValue('action', value)} 
          defaultValue={getValues('action')}
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
          {...register('points')} 
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
          {isSubmitting ? 'Adding...' : 'Add Points'}
        </Button>
      </div>
    </form>
  );
};
