import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendValue,
  className,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subValue && (
        <p className="text-sm text-gray-500 mt-1">{subValue}</p>
      )}
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-2">
          <span className={cn(
            "text-sm font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-gray-500"
          )}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
