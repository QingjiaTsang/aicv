import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"

type PersonalInfoProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function PersonalInfo({ document }: PersonalInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1 mb-3">
        <div className="text-2xl font-bold max-w-[280px] text-center break-words" style={{ color: document.themeColor }}>
          {document.personalInfo?.firstName || "First Name"} {document.personalInfo?.lastName || "Last Name"}
        </div>
        <div className="text-sm font-medium tracking-wide mt-0.5 dark:text-slate-300 max-w-[240px] text-center break-words">
          {document.personalInfo?.jobTitle || "Job Title"}
        </div>
        <div className="text-sm font-normal tracking-wide text-slate-600 dark:text-slate-400 max-w-[200px] text-center break-words">
          {document.personalInfo?.state} {document.personalInfo?.city}
          {(!document.personalInfo?.state && !document.personalInfo?.city) && "state or city"}
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="text-sm dark:text-slate-300 max-w-[160px] truncate">
          {document.personalInfo?.phone || "Tel"}
        </div>
        <div className="text-sm dark:text-slate-300 max-w-[220px] truncate">
          {document.personalInfo?.email || "Email"}
        </div>
      </div>

      <div className="my-2 border-b-[3px]" style={{ borderColor: document.themeColor }} />
    </div>
  )
}

export function PersonalInfoSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-8 w-[280px] mb-1" />
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[200px] mt-1" />
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}