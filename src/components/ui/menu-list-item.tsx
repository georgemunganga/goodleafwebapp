import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuListItemProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  showArrow?: boolean;
  danger?: boolean;
  className?: string;
}

export function MenuListItem({
  icon: Icon,
  label,
  description,
  onClick,
  showArrow = true,
  danger = false,
  className,
}: MenuListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between py-4 px-4",
        "hover:bg-gray-50 active:bg-gray-100 transition-colors",
        "border-b border-gray-100 last:border-b-0",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          danger ? "bg-red-50" : "bg-gray-100"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            danger ? "text-red-500" : "text-gray-600"
          )} />
        </div>
        <div className="text-left">
          <span className={cn(
            "font-medium",
            danger ? "text-red-500" : "text-gray-900"
          )}>
            {label}
          </span>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {showArrow && !danger && (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
}

export default MenuListItem;
