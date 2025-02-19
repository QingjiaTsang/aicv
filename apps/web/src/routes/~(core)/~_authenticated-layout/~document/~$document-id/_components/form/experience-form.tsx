import { SelectDocumentWithRelationsSchema, UpdateExperienceSchema, updateExperienceSchema } from "@aicv-app/api/schema"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/web/components/shadcn-ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/web/components/shadcn-ui/form"
import { Input } from "@/web/components/shadcn-ui/input"
import { Briefcase, CalendarIcon, MapPin, Plus, Trash2 } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import useConfirm from "@/web/hooks/use-confirm";
import { z } from "node_modules/zod/lib"
import { cn } from "@/web/lib/utils"
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations"
import { Checkbox } from "@/web/components/shadcn-ui/checkbox"
import { toast } from "sonner"
import Editor from "./editor"
import { useSortableItems } from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/hooks/use-sortable-items"
import { SectionOptimizeButton } from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/section-optimize-button"

type ExperienceFormProps = {
  document: SelectDocumentWithRelationsSchema
  className?: string
}

type FormValues = {
  experiences: UpdateExperienceSchema
}

export default function ExperienceForm({ document, className }: ExperienceFormProps) {
  const { didSortFlag } = useSortableItems(document.id, 'experience')

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      experiences: updateExperienceSchema
    })),
    defaultValues: {
      experiences: document.experience.filter((exp) => exp !== null)
    }
  })

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Experience",
    message: "Are you sure you want to delete this experience?"
  }) as [() => JSX.Element, () => Promise<boolean>]

  const { mutate: updateDocumentByTypeMutation, isPending: isUpdatingDocumentByType } = useUpdateDocumentByTypeMutation({
    onSuccess: () => {
      toast.success("Experience section updated")
    }
  })

  const onSubmit = () => {
    const formData = form.getValues('experiences')

    const experiences = formData.map(exp => {
      // Remove the to-be-inserted id as it's not the real id in the db for the existed record and it needs to be inserted instead of updated
      if (exp?.id?.startsWith('to-be-inserted')) {
        return {
          ...exp,
          id: undefined
        }
      }

      return exp
    })

    updateDocumentByTypeMutation({
      id: document.id,
      document: {
        data: experiences,
        type: 'experience'
      }
    })
  }

  const handleAddExperience = () => {
    const experiences = form.getValues('experiences')
    form.setValue('experiences', [...experiences, {
      id: `to-be-inserted-${crypto.randomUUID()}`,
      title: '',
      companyName: '',
      state: '',
      city: '',
      isCurrentlyEmployed: false,
      workSummary: '',
      displayOrder: experiences.length,
      startDate: '',
      endDate: ''
    }])
  }

  const handleRemoveExperience = async (index: number) => {
    const confirmed = await confirm()
    if (!confirmed) {
      return
    }

    const experiences = form.getValues('experiences').filter((_, i) => i !== index)
    form.setValue('experiences', experiences)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        experience: experiences
      }
    })
  }

  const handleFieldChange = (index: number, field: keyof UpdateExperienceSchema[0], value: string | number | boolean) => {
    const experiences = [...form.getValues('experiences')]

    experiences[index] = {
      ...experiences[index],
      [field]: value
    }

    form.setValue('experiences', experiences)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        experience: experiences
      }
    })
  }

  // Note: after experiences order changed by drag and drop in the resume preview section, update the form order accordingly
  useEffect(() => {
    const latestDocument = queryClient.getQueryData(documentKeys.LIST_DOCUMENT(document.id)) as SelectDocumentWithRelationsSchema
    form.reset({
      experiences: latestDocument?.experience as UpdateExperienceSchema
    })
  }, [didSortFlag])

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
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add your work experience to showcase your career progression
                </CardDescription>
              </div>
              <SectionOptimizeButton document={document} section="experience" className="w-24 self-end" />
            </div>
          </CardHeader>

          <div className="space-y-6 mt-4">
            {form.watch('experiences')?.map((exp, index) => (
              <div
                key={`experience-${index}-${exp?.id}`}
                className={cn(
                  "relative space-y-6 p-6 border rounded-lg",
                  "hover:border-primary/30 dark:hover:border-primary/40",
                  "transition-all duration-200"
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExperience(index)}
                  className="absolute right-4 top-4"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="size-4" />
                          <span>Position</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Senior Frontend Engineer"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'title', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.companyName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="size-4" />
                          <span>Company</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Ant Group"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'companyName', e.target.value)
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
                    name={`experiences.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span>State</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. California"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'state', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span>City</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. San Francisco"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'city', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.startDate`}
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
                              value={field.value ?? ''}
                              onChange={e => {
                                const date = e.target.value
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
                      name={`experiences.${index}.endDate`}
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
                              disabled={form.watch(`experiences.${index}.isCurrentlyEmployed`)}
                              value={field.value ?? ''}
                              onChange={e => {
                                const date = e.target.value
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
                    name={`experiences.${index}.isCurrentlyEmployed`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              handleFieldChange(index, 'isCurrentlyEmployed', checked)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal leading-none cursor-pointer">I currently work here</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.workSummary`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="size-4" />
                        <span>Work Summary</span>
                      </FormLabel>
                      <FormControl>
                        <Editor
                          // When the experience order changes, ensure the editor is re-rendered
                          key={`experience-${index}-${exp?.id}`}
                          value={field.value || ''}
                          onChange={(value: string) => {
                            field.onChange(value)
                            handleFieldChange(index, 'workSummary', value)
                          }}
                          placeholder="Describe your main responsibilities, achievements, and work content..."
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
              onClick={handleAddExperience}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Experience
            </Button>

            <Button
              type="submit"
              disabled={isUpdatingDocumentByType}
              className={cn(
                "text-white shadow-lg transition-all duration-300",
                "bg-gradient-to-r from-violet-600 to-purple-600",
                "hover:from-violet-700 hover:to-purple-700",
                "hover:shadow-primary/25"
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
