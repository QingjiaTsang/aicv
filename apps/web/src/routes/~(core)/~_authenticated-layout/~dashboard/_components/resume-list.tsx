import { motion } from "framer-motion";
import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/web/components/shadcn-ui/button";
import { Card } from "@/web/components/shadcn-ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu";
import { Skeleton } from "@/web/components/shadcn-ui/skeleton";
import { SelectDocumentSchema } from "@aicv-app/api/schema";

import { format } from "date-fns"
import { zhCN } from 'date-fns/locale';
import { useRouter, Link } from '@tanstack/react-router';
import { getStatusIcon } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/utils/getStatusIcon";
import { useState } from "react";
import { ResumePreviewTooltip } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/resume-preview-tooltip";
import { useTranslation } from "react-i18next";

type ResumeListProps = {
  resumes: SelectDocumentSchema[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};
export function ResumeList({ resumes, isLoading, onDelete }: ResumeListProps) {
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
          transition={{ delay: index * 0.05 }}
        >
          <ResumeCard
            resume={resume}
            onDelete={() => onDelete?.(resume.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

type ResumeCardProps = {
  resume: SelectDocumentSchema;
  onDelete: () => void;
};
function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const { t, i18n } = useTranslation();
  
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false)

  // Prefetch data when hovering over the card
  const handleMouseEnter = () => {
    router.preloadRoute({
      to: "/document/$document-id/edit",
      params: { "document-id": resume.id }
    });
  };

  const formatDate = (date: Date) => {
    if (i18n.language === 'zh') {
      return format(date, "yyyy年MM月dd日 HH:mm", { locale: zhCN });
    }
    return format(date, "MMM dd, yyyy HH:mm");
  };

  return (
    <div className="relative">
      <ResumePreviewTooltip
        imageUrl={resume.thumbnail}
        isHovered={isHovered}
      />

      <Card
        onMouseEnter={() => {
          handleMouseEnter()
          setIsHovered(true)
        }}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full group relative overflow-hidden shadow-sm hover:scale-105 border-violet-200/20 dark:border-violet-700/30 hover:border-violet-300 dark:hover:border-violet-600/50 transition-all duration-300 bg-white/50 dark:bg-gray-950/50 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-violet-400/5"
      >

        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] to-purple-500/[0.08] dark:from-primary/[0.05] dark:to-purple-500/[0.05] group-hover:from-primary/[0.12] group-hover:to-purple-500/[0.12] transition-all duration-300" />

        <div className="w-full relative p-6">
          <div className="w-full flex items-start justify-between">
            <div className="w-full flex items-center gap-3">
              <div className="rounded-full bg-violet-100/80 dark:bg-violet-900/80 p-2 ring-1 ring-violet-200/50 dark:ring-violet-700/50">
                <FileText className="size-5 text-violet-600 dark:text-violet-300" />
              </div>
              <div>
                <h3 className="truncate max-w-[195px] font-medium text-lg text-gray-900 dark:text-gray-50">{resume.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {t('common.updatedAt', { date: formatDate(new Date(resume.updatedAt)) })}
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
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    to="/document/$document-id/edit"
                    params={{ "document-id": resume.id }}
                    className="w-full flex items-center gap-2"
                  >
                    <Pencil className="size-4" />
                    <span>{t('common.edit')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                  <div className="w-full flex items-center gap-2 cursor-pointer">
                    <Trash2 className="size-4" />
                    <span>{t('common.delete')}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="text-xs px-2 py-1 rounded-full bg-violet-100/80 dark:bg-violet-900/80 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/50 dark:ring-violet-700/50">
              <div className="flex items-center gap-1">
                {getStatusIcon(resume.status)}
                {t(`dashboard.filters.${resume.status.toLowerCase()}`)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function EmptyResumeList() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-violet-100 dark:bg-violet-900/50 p-4">
          <FileText className="size-8 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">{t('dashboard.noResumes')}</h3>
          <p className="text-muted-foreground">{t('dashboard.createResume')}</p>
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
            <Skeleton className="size-10 rounded-full" />
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

