import { ChevronLeft, MoreVertical } from "lucide-react";
import { useLocation } from "wouter";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  rightContent?: React.ReactNode;
}

export function AppHeader({
  title,
  showBack = true,
  showMenu = false,
  onBack,
  onMenuClick,
  rightContent,
}: AppHeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-4 min-h-[60px]">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {rightContent}
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
