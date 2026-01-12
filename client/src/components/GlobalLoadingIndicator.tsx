import { useNetwork } from '@/contexts/NetworkContext';
import { Loader2 } from 'lucide-react';

export function GlobalLoadingIndicator() {
  const { isLoading } = useNetwork();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse">
      <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
    </div>
  );
}
