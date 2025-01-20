import { DocumentStatus, DOCUMENT_STATUS } from "@aicv-app/api/schema";
import { LockOpen, Archive, Lock } from "lucide-react";

export const getStatusIcon = (status: DocumentStatus) => {
  const statusIcons = {
    [DOCUMENT_STATUS.PUBLIC]: <LockOpen className="size-3 sm:size-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />,
    [DOCUMENT_STATUS.PRIVATE]: <Lock className="size-3 sm:size-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />,
    [DOCUMENT_STATUS.ARCHIVED]: <Archive className="size-3 sm:size-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
  };

  return statusIcons[status];
};