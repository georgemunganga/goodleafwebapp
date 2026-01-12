import { useNetwork } from '@/contexts/NetworkContext';
import { AlertCircle, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const { isOffline } = useNetwork();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 flex items-center gap-2 animate-pulse">
      <AlertCircle className="w-5 h-5" />
      <span className="text-sm font-medium">You are offline. Some features may not work.</span>
    </div>
  );
}
