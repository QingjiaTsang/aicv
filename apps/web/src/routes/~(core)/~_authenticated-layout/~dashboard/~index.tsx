import useConfirm from "@/web/hooks/useConfirm";
import queryClient from "@/web/lib/query-client";
import { DashboardHero } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/hero-section";
import { ResumeList } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/resume-list";
import { useCreateDocumentMutation, useDeleteDocumentMutation } from "@/web/services/documents/mutations";
import { documentsQueryOptionsFn } from "@/web/services/documents/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/(core)/_authenticated-layout/dashboard/",
)({
  component: DashboardPage,
  loader: () => queryClient.ensureQueryData(documentsQueryOptionsFn({ page: 1, pageSize: 100 })),
});

function DashboardPage() {
  const { data: preloadedData, isPending: isPreloading } = useSuspenseQuery(documentsQueryOptionsFn({ page: 1, pageSize: 100 }));
  const { mutate: deleteDocument } = useDeleteDocumentMutation({
    onSuccess: () => {
      toast.success('Resume deleted')
    },
    onError: () => {
      toast.error("Failed to delete resume")
    }
  });
  const { mutate: createDocument, isPending: isCreatingDocument } = useCreateDocumentMutation();

  const [DeleteResumeConfirmDialog, confirmDeleteResume] = useConfirm({
    title: "Delete Resume",
    message: "Are you sure you want to delete this resume?",
  }) as [() => JSX.Element, () => Promise<boolean>];

  const handleCreate = () => {
    createDocument({ title: "Untitled Resume" });
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDeleteResume();
    if (!confirmed) {
      return;
    }
    deleteDocument(id);
  };

  return (
    <>
      <DeleteResumeConfirmDialog />
      <div className="flex flex-col gap-8">
        <DashboardHero isPending={isPreloading || isCreatingDocument} onCreate={handleCreate} />

        <div className="container mx-auto w-full max-w-6xl px-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                All Resumes
              </h2>
            </div>

            <ResumeList
              isLoading={isPreloading}
              resumes={preloadedData.data}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
}
