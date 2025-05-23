
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  code_number: string;
  phone: string | null;
  email: string | null;
  condition: string | null;
  risk_level: string | null;
  created_at: string;
}

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onAddReward: (patient: Patient) => void;
  onAddHealthTracking: (patient: Patient) => void;
  onSendMessage: (patient: Patient) => void;
  onWhatsApp: (phone: string | null) => void;
  onSMS: (phone: string | null) => void;
  onEmail: (email: string | null) => void;
}

export const PatientCard = ({
  patient,
  onEdit,
  onDelete,
  onAddReward,
  onAddHealthTracking,
  onSendMessage,
  onWhatsApp,
  onSMS,
  onEmail
}: PatientCardProps) => {
  const isMobile = useIsMobile();

  const getRiskLevelColor = (level: string | null) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{patient.first_name} {patient.last_name}</span>
          <div className={`text-xs px-2 py-1 rounded-full border ${getRiskLevelColor(patient.risk_level)}`}>
            {patient.risk_level ? patient.risk_level.charAt(0).toUpperCase() + patient.risk_level.slice(1) : 'Low'} Risk
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-sm font-medium">Code: {patient.code_number}</div>
        {patient.condition && (
          <div className="text-sm text-gray-600">Condition: {patient.condition}</div>
        )}
        
        <div className="flex flex-col space-y-1 text-sm">
          {patient.phone && (
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1 text-gray-400" />
              {patient.phone}
            </div>
          )}
          {patient.email && (
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1 text-gray-400" />
              {patient.email}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddHealthTracking(patient)}
            className="w-full"
          >
            Health Tracking
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddReward(patient)}
            className="w-full"
          >
            Add Rewards
          </Button>
        </div>

        <div className="flex flex-wrap pt-2 gap-1">
          {patient.phone && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={() => onWhatsApp(patient.phone)}
              >
                <Phone className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={() => onSMS(patient.phone)}
              >
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </Button>
            </>
          )}
          {patient.email && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => onEmail(patient.email)}
            >
              <Mail className="h-4 w-4 text-purple-600" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 ml-auto"
            onClick={() => onSendMessage(patient)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "ml-1"}>Message</span>
          </Button>
        </div>
        
        <div className="flex justify-end space-x-1 pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(patient)}
          >
            <Edit className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "ml-1"}>Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(patient.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "ml-1"}>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
