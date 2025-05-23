
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';

interface EmptyPatientStateProps {
  hasSearchQuery: boolean;
  onAddPatient: () => void;
}

export const EmptyPatientState = ({ hasSearchQuery, onAddPatient }: EmptyPatientStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <Plus className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-2 text-base font-semibold">No patients found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasSearchQuery ? "Try adjusting your search terms" : "Get started by adding a new patient"}
      </p>
      {!hasSearchQuery && (
        <div className="mt-6">
          <Button onClick={onAddPatient}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      )}
    </div>
  );
};
