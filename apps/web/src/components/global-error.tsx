import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/web/components/shadcn-ui/button";
import { cn } from "@/web/lib/utils";
import { useNavigate } from "node_modules/@tanstack/react-router/dist/esm/useNavigate";

type GlobalErrorProps = {
  error: Error;
  className?: string;
};

export function GlobalError({ error, className }: GlobalErrorProps) {
  const navigate = useNavigate()
  return (
    <div className={cn(
      "h-[calc(100dvh-97px)] w-full flex items-center justify-center",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-md mx-auto"
      >
        <motion.div
          animate={{
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="flex justify-center"
        >
          <AlertTriangle className="size-16 text-destructive" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Something went wrong
        </h1>

        <p className="text-muted-foreground text-sm md:text-base">
          {error.message || "An error occurred. Please try again later"}
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <Button
            variant="default"
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            Refresh Page
          </Button>
          <Button
            variant="default"
            onClick={() => navigate({ to: "/dashboard" })}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            Go to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 