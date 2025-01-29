import { SelectDocumentWithRelationsSchema, selectSkillsSchema, updateSkillsSchema, UpdateSkillsSchema } from "@aicv-app/api/schema"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/web/components/shadcn-ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/web/components/shadcn-ui/form"
import { Input } from "@/web/components/shadcn-ui/input"
import { Plus, Star, Trash2 } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import useConfirm from "@/web/hooks/use-confirm"
import { z } from "zod"
import { cn } from "@/web/lib/utils"
import { toast } from "sonner"
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations"
import { useSortableItems } from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/hooks/use-sortable-items"

type SkillsFormProps = {
  document: SelectDocumentWithRelationsSchema
  className?: string
}

type FormValues = {
  skills: UpdateSkillsSchema
}

export default function SkillsForm({ document, className }: SkillsFormProps) {
  const { didSortFlag } = useSortableItems(document.id, 'skills')

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      skills: updateSkillsSchema
    })),
    defaultValues: {
      skills: document.skills?.map(skill => ({
        ...skill,
      })) || []
    }
  })

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Skill",
    message: "Are you sure you want to delete this skill?"
  }) as [() => JSX.Element, () => Promise<boolean>]

  const { mutate: updateDocumentByTypeMutation, isPending: isUpdatingDocumentByType } = useUpdateDocumentByTypeMutation({
    onSuccess: () => {
      toast.success("Skills section updated")
    }
  })

  const onSubmit = () => {
    const formData = form.getValues()

    const skills = formData.skills.map(skill => {
      if (skill?.id?.startsWith('to-be-inserted')) {
        return {
          ...skill,
          id: undefined
        }
      }

      return skill
    })

    updateDocumentByTypeMutation({
      id: document.id,
      document: {
        data: skills,
        type: 'skills'
      }
    })
  }

  const handleAddSkill = () => {
    const skills = form.getValues('skills')
    form.setValue('skills', [...skills, {
      id: `to-be-inserted-${crypto.randomUUID()}`,
      name: '',
      rating: 0,
      displayOrder: skills.length,
    }])
  }

  const handleRemoveSkill = async (index: number) => {
    const confirmed = await confirm()
    if (!confirmed) {
      return
    }

    const skills = form.getValues('skills').filter((_, i) => i !== index)
    form.setValue('skills', skills)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        skills
      }
    })
  }

  const handleFieldChange = (index: number, field: keyof z.infer<typeof selectSkillsSchema>, value: string | number) => {
    const skills = form.getValues('skills')
    skills[index] = {
      ...skills[index],
      [field]: value,
    }
    form.setValue('skills', skills)

    // Update preview
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        skills
      }
    })
  }

  useEffect(() => {
    const latestDocument = queryClient.getQueryData(documentKeys.LIST_DOCUMENT(document.id)) as SelectDocumentWithRelationsSchema
    form.reset({
      skills: latestDocument?.skills as UpdateSkillsSchema
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
          <CardHeader className="p-0 mb-6">
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>
              Add your professional skills and proficiency levels
            </CardDescription>
          </CardHeader>

          <div className="space-y-8">
            {form.watch('skills')?.map((skill, index) => (
              <div
                // Note: in order to ensure the order alignment, use index as key instead of skill?.id
                key={index}
                className={cn(
                  "relative p-7 border rounded-lg",
                  "hover:border-primary/30 dark:hover:border-primary/40",
                  "transition-all duration-200"
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSkill(index)}
                  className="absolute right-2 top-2"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Star className="size-4" />
                          <span>Skill Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            key={skill.id}
                            placeholder="e.g. React"
                            value={field.value || ''}
                            onChange={e => {
                              field.onChange(e.target.value)
                              handleFieldChange(index, 'name', e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`skills.${index}.rating`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Star className="size-4" />
                          <span>Proficiency (1-5)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            key={skill.id}
                            type="number"
                            min={0}
                            max={5}
                            placeholder="Rate 1-5"
                            value={field.value || ''}
                            onChange={e => {
                              const value = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                              field.onChange(value)
                              handleFieldChange(index, 'rating', value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Skill
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
