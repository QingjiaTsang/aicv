import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema";
import ExperienceForm from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/experience-form";
import PersonalInfoForm from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/personal-info-form";
import SkillsForm from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/skills-form";
import SummaryForm from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/summary-form";
import EducationForm from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/education-form";
import { Button } from "@/web/components/shadcn-ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { FORM_LABELS } from "@/web/lib/constants";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const currentFormPositionAtom = atom<number | null>(null)

type ResumeFormProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function ResumeForm({ document }: ResumeFormProps) {
  const [currentFormPosition, setCurrentFormPosition] = useAtom(currentFormPositionAtom)

  const handleNextForm = () => {
    setCurrentFormPosition((prev) => (prev === null ? 1 : prev + 1))
  }

  const handlePreviousForm = () => {
    setCurrentFormPosition((prev) => (prev === null ? 0 : prev - 1))
  }

  const isFirstForm = currentFormPosition === 0
  const isLastForm = currentFormPosition === FORM_LABELS.length - 1

  useEffect(() => {
    if (currentFormPosition === null) {
      setCurrentFormPosition(document.currentPosition || 0)
    }
  }, [document.currentPosition])

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 ml-auto mr-2 my-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousForm}
          disabled={isFirstForm}
          className="w-fit"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextForm}
          disabled={isLastForm}
          className="w-fit"
        >
          <span>Next</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>

      <hr className="border-gray-200 dark:border-gray-800" />

      <div className="flex flex-col">
        <PersonalInfoForm
          document={document}
          className={`${currentFormPosition === 0 ? 'block' : 'hidden'}`}
        />
        <SummaryForm
          document={document}
          className={`${currentFormPosition === 1 ? 'block' : 'hidden'}`}
        />
        <ExperienceForm
          document={document}
          className={`${currentFormPosition === 2 ? 'block' : 'hidden'}`}
        />
        <EducationForm
          document={document}
          className={`${currentFormPosition === 3 ? 'block' : 'hidden'}`}
        />
        <SkillsForm
          document={document}
          className={`${currentFormPosition === 4 ? 'block' : 'hidden'}`}
        />
      </div>
    </div>
  )
}
