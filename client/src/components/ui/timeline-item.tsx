import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TimelineItemProps {
  title: string;
  amount: string;
  date: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({
  title,
  amount,
  date,
  status,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn("relative pl-8", !isLast && "pb-6", className)}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200" />
      )}

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center",
          status === "completed" && "bg-primary",
          status === "current" && "bg-primary",
          status === "pending" && "bg-white border-2 border-gray-300"
        )}
      >
        {status === "completed" && (
          <Check className="w-3.5 h-3.5 text-white" />
        )}
        {status === "current" && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "font-medium",
            status === "pending" ? "text-gray-400" : "text-gray-900"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-lg font-bold",
            status === "pending" ? "text-gray-400" : "text-gray-900"
          )}>
            {amount}
          </p>
        </div>
        <span className={cn(
          "text-sm",
          status === "pending" ? "text-gray-400" : "text-gray-500"
        )}>
          {date}
        </span>
      </div>
    </div>
  );
}

export default TimelineItem;
