import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { useTranslation } from 'react-i18next'

type PersonalInfoProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function PersonalInfo({ document }: PersonalInfoProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1 mb-3">
        <div className="text-2xl font-bold max-w-[280px] text-center break-words" style={{ color: document.themeColor }}>
          {document.personalInfo?.firstName || t('document.personalInfo.placeholders.firstName')} {document.personalInfo?.lastName || t('document.personalInfo.placeholders.lastName')}
        </div>
        {document.personalInfo?.jobTitle ?
          (<div className="text-sm font-medium tracking-wide mt-0.5 dark:text-slate-300 max-w-[240px] text-center break-words">
            {document.personalInfo.jobTitle}
          </div>) :
          (<div className="text-sm font-medium tracking-wide mt-0.5 text-muted-foreground max-w-[240px] text-center break-words">
            {t('document.personalInfo.placeholders.jobTitle')}
          </div>) 
        }
        {(document.personalInfo?.state || document.personalInfo?.city) ? (
          <div className="text-sm font-normal tracking-wide dark:text-slate-300 max-w-[200px] text-center break-words">
            {document.personalInfo?.state} {document.personalInfo?.city}
          </div>
        ) : (
          <div className="text-sm font-normal tracking-wide text-muted-foreground max-w-[200px] text-center break-words">
            {t('document.personalInfo.placeholders.city')}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {document.personalInfo?.phone ? (
          <div className="text-sm dark:text-slate-300 max-w-[160px] truncate">
            {document.personalInfo.phone}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground max-w-[160px] truncate">
            {t('document.personalInfo.phone')}
          </div>
        )}
        {document.personalInfo?.email ? (
          <div className="text-sm dark:text-slate-300 max-w-[220px] truncate">
            {document.personalInfo.email}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground max-w-[220px] truncate">
            {t('document.personalInfo.email')}
          </div>
        )}
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