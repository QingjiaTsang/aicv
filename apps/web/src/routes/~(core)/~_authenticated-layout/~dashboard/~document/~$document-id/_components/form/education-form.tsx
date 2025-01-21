import { SelectDocumentWithRelationsSchema, UpdateEducationSchema, updateEducationSchema } from "@aicv-app/api/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/web/components/shadcn-ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/web/components/shadcn-ui/form"
import { Input } from "@/web/components/shadcn-ui/input"
import { Textarea } from "@/web/components/shadcn-ui/textarea"
import { GraduationCap, CalendarIcon, Plus, Trash2 } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import useConfirm from "@/web/hooks/useConfirm"
import { z } from "zod"
import { cn } from "@/web/lib/utils"
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations"
import { toast } from "sonner"
import Editor from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/form/editor"


type EducationFormProps = {
  document: SelectDocumentWithRelationsSchema
  className?: string
}

type FormValues = {
  education: UpdateEducationSchema
}

export default function EducationForm({ document, className }: EducationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      education: updateEducationSchema
    })),
    defaultValues: {
      education: document.education?.map(edu => ({
        ...edu,
        startDate: edu?.startDate ? new Date(edu.startDate).getTime() : null,
        endDate: edu?.endDate ? new Date(edu.endDate).getTime() : null,
      })) || []
    }
  })

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Education",
    message: "Are you sure you want to delete this education entry?"
  }) as [() => JSX.Element, () => Promise<boolean>]

  const { mutate: updateDocumentByTypeMutation, isPending: isUpdatingDocumentByType } = useUpdateDocumentByTypeMutation({
    onSuccess: () => {
      toast.success("Education section updated")
    }
  })

  const onSubmit = () => {
    const formData = form.getValues()

    updateDocumentByTypeMutation({
      id: document.id,
      document: {
        data: formData.education,
        type: 'education'
      }
    })
  }

  const handleAddEducation = () => {
    const education = form.getValues('education')
    form.setValue('education', [...education, {
      id: crypto.randomUUID(),
      universityName: '',
      degree: '',
      major: '',
      description: '',
      startDate: Date.now(),
      endDate: Date.now()
    }])
  }

  const handleRemoveEducation = async (index: number) => {
    const confirmed = await confirm()
    if (!confirmed) {
      return
    }

    const education = form.getValues('education').filter((_, i) => i !== index)
    form.setValue('education', education)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        education
      }
    })
  }

  const handleFieldChange = (index: number, field: keyof UpdateEducationSchema[0], value: string | number) => {
    const education = [...form.getValues('education')]
    if (field === 'startDate' || field === 'endDate') {
      education[index] = {
        ...education[index],
        [field]: value ? new Date(value).getTime() : null
      }
    } else {
      education[index] = {
        ...education[index],
        [field]: value
      }
    }
    form.setValue('education', education)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        education
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
          <CardHeader className="p-0 mb-6">
            <CardTitle>Education</CardTitle>
            <CardDescription>
              Add your educational background and showcase your academic achievements
            </CardDescription>
          </CardHeader>

          <div className="space-y-8">
            {form.watch('education')?.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "relative space-y-6 p-6 rounded-lg border bg-card",
                  "hover:border-primary/30 dark:hover:border-primary/50",
                  "transition-all duration-200"
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEducation(index)}
                  className="absolute right-4 top-4"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>

                <FormField
                  control={form.control}
                  name={`education.${index}.universityName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GraduationCap className="size-4" />
                        <span>University Name</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Harvard University"
                          value={field.value || ''}
                          onChange={e => {
                            field.onChange(e.target.value)
                            handleFieldChange(index, 'universityName', e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="size-4" />
                          <span>Degree</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Bachelor's Degree"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'degree', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`education.${index}.major`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="size-4" />
                          <span>Major</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Computer Science"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'major', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`education.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="size-4" />
                          <span>Start Date</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={e => {
                              const date = new Date(e.target.value).getTime()
                              field.onChange(date)
                              handleFieldChange(index, 'startDate', date)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`education.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="size-4" />
                          <span>End Date</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={e => {
                              const date = new Date(e.target.value).getTime()
                              field.onChange(date)
                              handleFieldChange(index, 'endDate', date)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`education.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GraduationCap className="size-4" />
                        <span>Academic Experience</span>
                      </FormLabel>
                      <FormControl>
                        <Editor
                          value={field.value || ''}
                          onChange={(value: string) => {
                            console.log({
                              value,
                              cnt: value.length
                            })
                            field.onChange(value)
                            handleFieldChange(index, 'description', value)
                          }}
                          placeholder="Describe your key academic achievements, awards, projects participated in..."
                          className="[&_.ql-editor]:min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddEducation}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Education
            </Button>

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
              Save
            </Button>
          </div>
        </Card>
      </form>

      <ConfirmDialog />
    </Form>
  )
}
