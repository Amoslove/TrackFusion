
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Patient } from './PatientCard';

interface SurveyFormProps {
  patient: Patient | null;
  surveyType: 'pre_appointment' | 'post_appointment' | 'general_health';
  appointmentId?: string;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const SurveyForm = ({ 
  patient, 
  surveyType, 
  appointmentId,
  onSubmit, 
  isSubmitting, 
  onCancel 
}: SurveyFormProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const surveyQuestions = {
    pre_appointment: [
      { id: 'pain_level', type: 'radio', question: 'How would you rate your current pain level?', options: ['1', '2', '3', '4', '5'] },
      { id: 'symptoms', type: 'textarea', question: 'Please describe any symptoms you are experiencing:' },
      { id: 'medications', type: 'textarea', question: 'List any medications you are currently taking:' },
      { id: 'concerns', type: 'textarea', question: 'What specific concerns would you like to discuss?' }
    ],
    post_appointment: [
      { id: 'satisfaction', type: 'radio', question: 'How satisfied were you with your appointment?', options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] },
      { id: 'understanding', type: 'radio', question: 'How well did you understand the treatment plan?', options: ['Not at all', 'Slightly', 'Moderately', 'Well', 'Very Well'] },
      { id: 'follow_up', type: 'textarea', question: 'Any additional questions or concerns?' },
      { id: 'improvement', type: 'radio', question: 'Do you feel your condition has improved?', options: ['Much Worse', 'Worse', 'No Change', 'Better', 'Much Better'] }
    ],
    general_health: [
      { id: 'overall_health', type: 'radio', question: 'How would you rate your overall health?', options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] },
      { id: 'exercise', type: 'radio', question: 'How often do you exercise?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'] },
      { id: 'sleep', type: 'radio', question: 'How would you rate your sleep quality?', options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
      { id: 'stress', type: 'radio', question: 'How would you rate your stress level?', options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] }
    ]
  };

  const questions = surveyQuestions[surveyType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      patient_id: patient?.id,
      survey_type: surveyType,
      appointment_id: appointmentId,
      questions: questions,
      responses: responses
    });
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const getSurveyTitle = () => {
    switch (surveyType) {
      case 'pre_appointment': return 'Pre-Appointment Survey';
      case 'post_appointment': return 'Post-Appointment Survey';
      case 'general_health': return 'General Health Survey';
      default: return 'Health Survey';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSurveyTitle()}</CardTitle>
        {patient && <p className="text-sm text-gray-600">For: {patient.first_name} {patient.last_name}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className="text-sm font-medium">{question.question}</Label>
              
              {question.type === 'radio' && question.options && (
                <RadioGroup
                  value={responses[question.id] || ''}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                      <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {question.type === 'textarea' && (
                <Textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder="Please provide your response..."
                  rows={3}
                />
              )}
              
              {question.type === 'input' && (
                <Input
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder="Please provide your response..."
                />
              )}
            </div>
          ))}
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
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
