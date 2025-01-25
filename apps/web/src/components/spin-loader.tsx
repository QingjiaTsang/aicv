import { cn } from "@/web/lib/utils";

type SpinLoaderProps = {
  className?: string;
};

export function SpinLoader({ className }: SpinLoaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-center fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
      className
    )}>
      <div className="animate-spin rounded-full size-8 md:size-10 border-4 border-violet-400 border-t-transparent" />
    </div>
  );
}
