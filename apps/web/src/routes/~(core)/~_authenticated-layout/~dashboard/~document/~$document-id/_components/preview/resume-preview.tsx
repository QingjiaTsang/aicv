import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema";

import PersonalInfo from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/personal-info";
import Summary from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/summary";
import Experience from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/experience";
import Education from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/education";
import Skills from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/skills";

type ResumePreviewProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function ResumePreview({ document }: ResumePreviewProps) {
  return (
    <>
      <PersonalInfo document={document} />

      <Summary document={document} />

      <Experience document={document} />

      <Education document={document} />

      <Skills document={document} />
    </>
  )
}
