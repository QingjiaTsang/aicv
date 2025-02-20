import { SelectDocumentWithRelationsSchema, UpdateBasicDocumentSchema, updateBasicDocumentSchema } from "@aicv-app/api/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/web/components/shadcn-ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/web/components/shadcn-ui/form"
import { FileText } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import { cn } from "@/web/lib/utils"
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations"
import { toast } from "sonner"
import Editor from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/editor"
import { SectionOptimizeButton } from "./section-optimize-button"
import { useTranslation } from 'react-i18next'

type SummaryFormProps = {
  document: SelectDocumentWithRelationsSchema
  className?: string
}

export default function SummaryForm({ document, className }: SummaryFormProps) {
  const { t } = useTranslation()
  const { personalInfo, experience, education, skills, ...basic } = document

  const form = useForm<UpdateBasicDocumentSchema>({
    resolver: zodResolver(updateBasicDocumentSchema),
    defaultValues: {
      ...basic,
      summary: document.summary || "",
      thumbnail: document.thumbnail || "",
    }
  })

  const { mutate: updateDocumentByTypeMutation, isPending: isUpdatingDocumentByType } = useUpdateDocumentByTypeMutation({
    onSuccess: () => {
      toast.success(t('document.personalInfo.toast.updateSuccess'))
    }
  })


  const onSubmit = () => {
    const formData = form.getValues()

    updateDocumentByTypeMutation({
      id: document.id,
      document: {
        data: formData,
        type: 'document'
      }
    })
  }

  const handleSummaryChange = (summary: string) => {
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        summary
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          form.handleSubmit(onSubmit, (errors) => {
            console.error('errors', errors)
          })
        }
        className={className}
      >
        <Card className="p-6 border-0 shadow-none bg-transparent">
          <CardHeader className="p-0">
            <div className="flex flex-col gap-2">
              <div>
                <CardTitle>{t('resume.editor.sections.summary')}</CardTitle>
                <CardDescription className="mt-1.5">
                  {t('document.personalInfo.description')}
                </CardDescription>
              </div>
              <SectionOptimizeButton document={document} section="summary" className="w-24 self-end" />
            </div>
          </CardHeader>

          <div className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-4">
                      <FileText className="size-4 mt-2 flex-shrink-0" />
                      <Editor
                        value={field.value || ''}
                        onChange={(value: string) => {
                          field.onChange(value)
                          handleSummaryChange(value)
                        }}
                        placeholder={t('document.form.placeholders.summary')}
                        className="[&_.ql-editor]:min-h-[350px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              disabled={isUpdatingDocumentByType}
              className={cn(
                "bg-gradient-to-r from-violet-600 to-purple-600",
                "hover:from-violet-700 hover:to-purple-700",
                "text-white shadow-lg hover:shadow-primary/25",
                "transition-all duration-300"
              )}
            >
              {t('common.save')}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  )
}
