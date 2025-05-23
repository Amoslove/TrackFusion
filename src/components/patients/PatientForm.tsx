
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const patientSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  code_number: z.string().min(1, { message: 'Patient code is required' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  condition: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high']).default('low'),
});

export type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  defaultValues?: PatientFormData;
  onSubmit: (data: PatientFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
  cancelAction?: () => void;
}

export const PatientForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  cancelAction
}: PatientFormProps) => {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: defaultValues || {
      first_name: '',
      last_name: '',
      code_number: '',
      phone: '',
      email: '',
      condition: '',
      risk_level: 'low',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          {cancelAction && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={cancelAction}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Processing...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
