
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Patient } from './PatientCard';

interface MedicationScheduleFormProps {
  patient: Patient | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const MedicationScheduleForm = ({ 
  patient, 
  onSubmit, 
  isSubmitting, 
  onCancel 
}: MedicationScheduleFormProps) => {
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    start_date: '',
    end_date: '',
    notes: ''
  });
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [newReminderTime, setNewReminderTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      patient_id: patient?.id,
      reminder_times: reminderTimes
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReminderTime = () => {
    if (newReminderTime && !reminderTimes.includes(newReminderTime)) {
      setReminderTimes(prev => [...prev, newReminderTime]);
      setNewReminderTime('');
    }
  };

  const removeReminderTime = (timeToRemove: string) => {
    setReminderTimes(prev => prev.filter(time => time !== timeToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Medication Schedule</CardTitle>
        {patient && <p className="text-sm text-gray-600">For: {patient.first_name} {patient.last_name}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medication_name">Medication Name</Label>
            <Input
              id="medication_name"
              value={formData.medication_name}
              onChange={(e) => handleInputChange('medication_name', e.target.value)}
              placeholder="e.g., Metformin"
              required
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              placeholder="e.g., 500mg"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once_daily">Once Daily</SelectItem>
                <SelectItem value="twice_daily">Twice Daily</SelectItem>
                <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                <SelectItem value="as_needed">As Needed</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Reminder Times</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                placeholder="Add reminder time"
              />
              <Button type="button" onClick={addReminderTime} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {reminderTimes.map((time, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {time}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeReminderTime(time)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Medication'}
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
