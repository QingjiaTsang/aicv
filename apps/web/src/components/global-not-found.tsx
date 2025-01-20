import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/web/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/web/lib/utils";

type GlobalNotFoundProps = {
  className?: string;
};

export function GlobalNotFound({ className }: GlobalNotFoundProps) {
  return (
    <div className={cn(
      "h-[calc(100dvh-65px)] w-full flex items-center justify-center p-4",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-md mx-auto"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="flex justify-center"
        >
          <Search className="size-16 text-primary" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Page Not Found
        </h1>

        <p className="text-muted-foreground text-sm md:text-base">
          Sorry, the page you are looking for does not exist
        </p>

        <div className="pt-4">
          <Button
            variant="default"
            asChild
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            <Link to="/dashboard">
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 