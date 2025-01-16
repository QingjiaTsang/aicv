import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"

type PersonalInfoProps = {
  document: SelectDocumentWithRelationsSchema
  isLoading: boolean
}

export default function PersonalInfo({ document, isLoading }: PersonalInfoProps) {
  if (isLoading) {
    return <PersonalInfoSkeleton />
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1 mb-3">
        <div className="text-2xl font-bold" style={{ color: document.themeColor }}>
          {document.personalInfo?.firstName || "First Name"} {document.personalInfo?.lastName || "Last Name"}
        </div>
        <div className="text-sm font-medium tracking-wide mt-0.5 dark:text-slate-300">
          {document.personalInfo?.jobTitle || "Job Title"}
        </div>
        <div className="text-sm font-normal tracking-wide text-slate-600 dark:text-slate-400 text-center break-words">
          {document.personalInfo?.address || "Address"}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm dark:text-slate-300">
          {document.personalInfo?.phone || "Tel"}
        </div>
        <div className="text-sm dark:text-slate-300">
          {document.personalInfo?.email || "Email"}
        </div>
      </div>

      <hr className="my-2 border-b-2" style={{ borderColor: document.themeColor }} />
    </div>
  )
}


export function PersonalInfoSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-8 w-48 mb-1" />

        <Skeleton className="h-4 w-32" />

        <Skeleton className="h-4 w-40 mt-1" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-24" />

        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}