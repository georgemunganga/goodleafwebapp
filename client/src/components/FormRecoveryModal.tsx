/**
 * Form Recovery Modal Component
 * 
 * Displays "Resume your application?" dialog when saved form state is detected
 * Shows timestamp of last save and options to continue or start fresh
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FormRecoveryModalProps {
  open: boolean;
  formName: string;
  savedTimestamp?: number;
  onResume: () => void;
  onStartFresh: () => void;
  isLoading?: boolean;
}

export function FormRecoveryModal({
  open,
  formName,
  savedTimestamp,
  onResume,
  onStartFresh,
  isLoading = false,
}: FormRecoveryModalProps) {
  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return 'recently';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const timeAgo = getTimeAgo(savedTimestamp);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Prevent closing by clicking outside
      if (!isOpen) return;
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Resume Your Application?</DialogTitle>
              <DialogDescription>
                We found a saved {formName} from {timeAgo}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Your progress has been automatically saved</span>
          </div>

          <p className="text-sm text-gray-600">
            Would you like to continue where you left off, or start fresh?
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onStartFresh}
            disabled={isLoading}
            className="flex-1"
          >
            Start Fresh
          </Button>
          <Button
            onClick={onResume}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Resuming...' : 'Resume'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
