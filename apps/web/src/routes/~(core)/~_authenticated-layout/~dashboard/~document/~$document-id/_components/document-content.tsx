import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { cn } from '@/web/lib/utils';
import PersonalInfo from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/personal-info";
import Summary from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/summary";
import Experience from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/experience";
import Education from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/education";
import Skills from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/skills";

type DocumentContentProps = {
  document: SelectDocumentWithRelationsSchema
}

export function DocumentContent({ document }: DocumentContentProps) {
  console.log(document.themeColor)
  return (
    <div className="p-4 flex md:flex-row flex-col gap-4">
      {/* edit form */}
      <div className="flex-1">
        edit form
      </div>

      {/* preview */}
      <div
        className={`flex-1 w-full p-10 shadow-lg border-t-[12px] dark:border`}
        style={{ borderTop: `12px solid ${document.themeColor}` }}
      >
        <div>
          <PersonalInfo document={document} />

          <Summary document={document} />

          <Experience document={document} />

          <Education document={document} />

          <Skills document={document} />
        </div>
      </div>

    </div >
  )
}