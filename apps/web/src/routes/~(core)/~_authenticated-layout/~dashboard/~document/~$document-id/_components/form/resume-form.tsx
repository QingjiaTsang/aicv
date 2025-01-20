import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema";
import ExperienceForm from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/experience-form";
import PersonalInfoForm from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/personal-info-form";
import SkillsForm from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/skills-form";
import SummaryForm from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/summary-form";
import EducationForm from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/education-form";
import { useState } from "react";
import { Button } from "@/web/components/shadcn-ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { FORM_LABELS } from "@/web/lib/constants";

type ResumeFormProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function ResumeForm({ document }: ResumeFormProps) {
  const [currentForm, setCurrentForm] = useState<{
    index: number
  }>({
    index: 0,
  })

  const handleNextForm = () => {
    setCurrentForm((prev) => ({
      index: prev.index + 1,
    }))
  }

  const handlePreviousForm = () => {
    setCurrentForm((prev) => ({
      index: prev.index - 1,
    }))
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 ml-auto mr-2 my-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousForm}
          className="w-fit" disabled={currentForm.index === 0}
        >
          <ArrowLeftIcon className="size-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextForm}
          className="w-fit"
          disabled={currentForm.index === FORM_LABELS.length - 1}
        >
          <span>Next</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>

      <hr className="border-gray-200 dark:border-gray-800" />

      <div className="flex flex-col">
        <PersonalInfoForm
          document={document}
          className={`${currentForm.index === 0 ? 'block' : 'hidden'}`}
        />
        <SummaryForm
          document={document}
          className={`${currentForm.index === 1 ? 'block' : 'hidden'}`}
        />
        <ExperienceForm
          document={document}
          className={`${currentForm.index === 2 ? 'block' : 'hidden'}`}
        />
        <EducationForm
          document={document}
          className={`${currentForm.index === 3 ? 'block' : 'hidden'}`}
        />
        <SkillsForm
          document={document}
          className={`${currentForm.index === 4 ? 'block' : 'hidden'}`}
        />
      </div>
    </div>
  )
}
