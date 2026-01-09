import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function ProgressSteps({
  totalSteps,
  currentStep,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            index < currentStep ? "bg-primary" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export default ProgressSteps;
