import { SelectDocumentWithRelationsSchema, UpdateExperienceSchema, updateExperienceSchema } from "@aicv-app/api/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/web/components/shadcn-ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/web/components/shadcn-ui/form"
import { Input } from "@/web/components/shadcn-ui/input"
import { Textarea } from "@/web/components/shadcn-ui/textarea"
import { Briefcase, CalendarIcon, MapPin, Plus, Trash2 } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import useConfirm from "@/web/hooks/useConfirm";
import { z } from "node_modules/zod/lib"
import { cn } from "@/web/lib/utils"


type ExperienceFormProps = {
  document: SelectDocumentWithRelationsSchema
  isLoading: boolean
  className?: string
}

type FormValues = {
  experiences: UpdateExperienceSchema
}

export default function ExperienceForm({ document, isLoading, className }: ExperienceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      experiences: z.array(updateExperienceSchema)
    })),
    defaultValues: {
      experiences: document.experience?.map(exp => ({
        ...exp,
        startDate: exp?.startDate ? new Date(exp.startDate).getTime() : null,
        endDate: exp?.endDate ? new Date(exp.endDate).getTime() : null,
        createdAt: exp?.createdAt,
        updatedAt: exp?.updatedAt,
      })) || []
    }
  })

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Experience",
    message: "Are you sure you want to delete this experience?"
  }) as [() => JSX.Element, () => Promise<boolean>]

  const onSubmit = async () => {
    // TODO: Save work experience
    console.log('form', form.getValues())
  }

  const handleAddExperience = () => {
    const experiences = form.getValues('experiences')
    form.setValue('experiences', [...experiences, {
      id: crypto.randomUUID(),
      title: '',
      companyName: '',
      state: '',
      city: '',
      isCurrentlyEmployed: false,
      workSummary: '',
      startDate: Date.now(),
      endDate: Date.now()
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        <Card className="p-6 border-0 shadow-none bg-transparent">
          <CardHeader className="p-0 mb-6">
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>
              Add your work experience to showcase your career progression
            </CardDescription>
          </CardHeader>

          <div className="space-y-8">
            {form.watch('experiences')?.map((_, index) => (
              <div
                key={index}
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
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
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
                        <Briefcase className="w-4 h-4" />
                        <span>Company</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Tech Company"
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

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>State/Province</span>
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
                          <MapPin className="w-4 h-4" />
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

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
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
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
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
                  name={`experiences.${index}.workSummary`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Work Summary</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your main responsibilities, achievements, and duties..."
                          className="min-h-[120px] resize-none"
                          value={field.value || ''}
                          onChange={e => {
                            field.onChange(e.target.value)
                            handleFieldChange(index, 'workSummary', e.target.value)
                          }}
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
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
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
