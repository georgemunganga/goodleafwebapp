import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanCardProps {
  title: string;
  amount: string;
  date?: string;
  tenure?: string;
  status?: "active" | "completed" | "pending" | "overdue";
  statusText?: string;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

const statusColors = {
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
};

export function LoanCard({
  title,
  amount,
  date,
  tenure,
  status,
  statusText,
  progress,
  onClick,
  className,
}: LoanCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm",
        "active:bg-gray-50 transition-colors",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {status && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                statusColors[status]
              )}>
                {statusText || status}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{amount}</p>
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        {date && <span>{date}</span>}
        {tenure && <span>{tenure}</span>}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{progress}% paid</span>
            <span>{100 - progress}% remaining</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanCard;
