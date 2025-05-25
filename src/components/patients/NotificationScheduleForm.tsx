
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from './PatientCard';

interface NotificationScheduleFormProps {
  patient: Patient | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const NotificationScheduleForm = ({ 
  patient, 
  onSubmit, 
  isSubmitting, 
  onCancel 
}: NotificationScheduleFormProps) => {
  const [formData, setFormData] = useState({
    notification_type: '',
    scheduled_time: '',
    message_content: '',
    delivery_method: 'sms'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      patient_id: patient?.id
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Notification</CardTitle>
        {patient && <p className="text-sm text-gray-600">For: {patient.first_name} {patient.last_name}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="notification_type">Notification Type</Label>
            <Select value={formData.notification_type} onValueChange={(value) => handleInputChange('notification_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
                <SelectItem value="medication_reminder">Medication Reminder</SelectItem>
                <SelectItem value="survey_reminder">Survey Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="delivery_method">Delivery Method</Label>
            <Select value={formData.delivery_method} onValueChange={(value) => handleInputChange('delivery_method', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduled_time">Scheduled Time</Label>
            <Input
              id="scheduled_time"
              type="datetime-local"
              value={formData.scheduled_time}
              onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message_content">Message Content</Label>
            <Textarea
              id="message_content"
              value={formData.message_content}
              onChange={(e) => handleInputChange('message_content', e.target.value)}
              placeholder="Enter the notification message..."
              rows={4}
              required
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Notification'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
