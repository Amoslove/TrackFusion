
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from './PatientCard';

interface MessageFormProps {
  patient: Patient | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const MessageForm = ({
  patient,
  onSubmit,
  isSubmitting,
  onCancel
}: MessageFormProps) => {
  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      message: '',
      method: 'all', // sms, whatsapp, email, all
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">To</label>
        <p className="text-sm mt-1">{patient ? `${patient.first_name} ${patient.last_name}` : 'N/A'}</p>
      </div>
      <div>
        <label className="text-sm font-medium">Method</label>
        <Select 
          onValueChange={(value) => setValue('method', value)} 
          defaultValue={getValues('method')}
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
          {...register('message')} 
          placeholder="Type your message"
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
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};
