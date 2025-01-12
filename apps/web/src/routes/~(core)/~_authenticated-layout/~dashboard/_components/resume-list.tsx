import { motion } from "framer-motion";
import { FileText, MoreVertical, Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/web/components/shadcn-ui/button";
import { Card } from "@/web/components/shadcn-ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu";
import { Skeleton } from "@/web/components/shadcn-ui/skeleton";

type Resume = {
  id: string;
  title: string;
  updatedAt: string;
  status: "private" | "public";
  thumbnail?: string;
};

type ResumeListProps = {
  resumes: Resume[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ResumeList({ resumes, isLoading, onEdit, onDelete }: ResumeListProps) {
  if (isLoading) {
    return <ResumeListSkeleton />;
  }

  if (resumes.length === 0) {
    return <EmptyResumeList />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume, index) => (
        <motion.div
          key={resume.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ResumeCard
            resume={resume}
            onEdit={() => onEdit?.(resume.id)}
            onDelete={() => onDelete?.(resume.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

function ResumeCard({ resume, onEdit, onDelete }: { resume: Resume; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card className="group relative overflow-hidden shadow-sm hover:scale-105 border-violet-200/20 dark:border-violet-700/30 hover:border-violet-300 dark:hover:border-violet-600/50 transition-all duration-300 bg-white/50 dark:bg-gray-950/50 hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-400/5">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] to-purple-500/[0.08] dark:from-violet-500/[0.05] dark:to-purple-500/[0.05] group-hover:from-violet-500/[0.12] group-hover:to-purple-500/[0.12] transition-all duration-300" />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-violet-100/80 dark:bg-violet-900/80 p-2 ring-1 ring-violet-200/50 dark:ring-violet-700/50">
              <FileText className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-50">{resume.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-100/50 dark:hover:bg-violet-900/50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="text-xs px-2 py-1 rounded-full bg-violet-100/80 dark:bg-violet-900/80 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/50 dark:ring-violet-700/50">
            {resume.status}
          </div>
          {resume.status === "public" && (
            <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
          )}
        </div>
      </div>
    </Card>
  );
}

function EmptyResumeList() {
  return (
    <Card className="p-12 text-center shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-violet-100 dark:bg-violet-900/50 p-4">
          <FileText className="h-8 w-8 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">No resumes yet</h3>
          <p className="text-muted-foreground">Create your first resume to get started</p>
        </div>
      </div>
    </Card>
  );
}

function ResumeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 