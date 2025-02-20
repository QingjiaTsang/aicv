import { SelectDocumentWithRelationsSchema, updatePersonalInfoSchema, UpdatePersonalInfoSchema } from "@aicv-app/api/schema"
import { useForm } from "react-hook-form"
import { Button } from "@/web/components/shadcn-ui/button"
import { Card, CardHeader, CardTitle, CardDescription, } from "@/web/components/shadcn-ui/card"
import { Input } from "@/web/components/shadcn-ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/web/components/shadcn-ui/form"
import { User, Briefcase, MapPin, Phone, Mail } from "lucide-react"
import queryClient from "@/web/lib/query-client"
import { documentKeys } from "@/web/services/documents/queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/web/lib/utils"
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations"
import { toast } from "sonner"
import { useTranslation } from 'react-i18next'

type PersonalInfoFormProps = {
  document: SelectDocumentWithRelationsSchema
  className?: string
}

export default function PersonalInfoForm({ document, className }: PersonalInfoFormProps) {
  const { t } = useTranslation();
  const form = useForm<UpdatePersonalInfoSchema>({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: {
      ...document.personalInfo,
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
        type: 'personalInfo'
      }
    })
  }

  const handleFieldChange = (field: keyof UpdatePersonalInfoSchema, value: string) => {
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(document.id), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        personalInfo: {
          ...oldData.personalInfo,
          [field]: value
        }
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
            <CardTitle>{t('document.personalInfo.title')}</CardTitle>
            <CardDescription>
              {t('document.personalInfo.description')}
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>{t('document.personalInfo.firstName')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.firstName')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('firstName', e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>{t('document.personalInfo.lastName')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.lastName')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('lastName', e.target.value)
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
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="size-4" />
                    <span>{t('document.personalInfo.jobTitle')}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('document.personalInfo.placeholders.jobTitle')}
                      value={field.value || ''}
                      onChange={e => {
                        field.onChange(e.target.value)
                        handleFieldChange('jobTitle', e.target.value)
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
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span>{t('document.personalInfo.state')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.state')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('state', e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span>{t('document.personalInfo.city')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.city')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('city', e.target.value)
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="size-4" />
                      <span>{t('document.personalInfo.phone')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.phone')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('phone', e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="size-4" />
                      <span>{t('document.personalInfo.email')}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('document.personalInfo.placeholders.email')}
                        value={field.value || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleFieldChange('email', e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              <span>{t('common.save')}</span>
            </Button>
          </div>
        </Card>
      </form >
    </Form>
  )
}
