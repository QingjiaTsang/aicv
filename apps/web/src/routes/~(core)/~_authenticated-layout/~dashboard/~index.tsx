import { DocumentStatus } from "@aicv-app/api/schema";
import { SpinLoader } from "@/web/components/spin-loader";
import useConfirm from "@/web/hooks/use-confirm";
import queryClient from "@/web/lib/query-client";
import { cn } from "@/web/lib/utils";
import { DashboardHero } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/hero-section";
import { ResumeList } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/resume-list";
import { useCreateDocumentMutation, useDeleteAllDocumentsMutation, useDeleteDocumentMutation } from "@/web/services/documents/mutations";
import { documentsQueryOptionsFn } from "@/web/services/documents/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatedNumber } from "@/web/components/animated-number";
import { DocumentFilters } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/document-filters";

export const Route = createFileRoute('/(core)/_authenticated-layout/dashboard/')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: search.status as DocumentStatus | undefined,
      search: (search.search as string) || "",
    };
  },
  loaderDeps: ({ search: { status, search } }) => ({
    status,
    search,
  }),
  loader: ({ deps: { status, search } }) => {
    return queryClient.ensureQueryData(documentsQueryOptionsFn({ 
      page: 1, 
      pageSize: 100,
      status,
      search,
    }));
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { status, search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  
  const { data: preloadedData, isPending: isPreloading } = useSuspenseQuery(
    documentsQueryOptionsFn({ 
      page: 1, 
      pageSize: 100,
      status,
      search,
    })
  );
  
  const { mutate: deleteDocument } = useDeleteDocumentMutation({
    onSuccess: () => {
      toast.success('Resume deleted')
    },
    onError: () => {
      toast.error("Failed to delete resume")
    }
  });
  const { mutate: createDocument, isPending: isCreatingDocument } = useCreateDocumentMutation();
  const { mutate: deleteAllDocuments, isPending: isDeletingAllDocuments } = useDeleteAllDocumentsMutation({
    onSuccess: async () => {
      toast.success("All resumes deleted");
    },
    onError: () => {
      toast.error("Failed to delete all resumes. Please try again.")
    }
  });

  const [DeleteResumeConfirmDialog, confirmDeleteResume] = useConfirm({
    title: "Delete Resume",
    message: "Are you sure you want to delete this resume?",
  }) as [() => JSX.Element, () => Promise<boolean>];

  const [DeleteAllResumeConfirmDialog, confirmDeleteAllResume] = useConfirm({
    title: "Delete All Resumes",
    message: "Are you sure you want to delete all resumes?",
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

  const handleDeleteAll = async () => {
    const confirmed = await confirmDeleteAllResume();
    if (!confirmed) {
      return;
    }
    deleteAllDocuments();
  };

  const handleStatusChange = (newStatus: DocumentStatus | undefined) => {
    navigate({
      search: (prev) => ({ ...prev, status: newStatus })
    });
  };

  const handleSearchChange = (newSearch: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: newSearch })
    });
  };

  return (
    <>
      <DeleteResumeConfirmDialog />
      <DeleteAllResumeConfirmDialog />

      {isDeletingAllDocuments && <SpinLoader />}

      <div className="flex flex-col gap-8">
        <DashboardHero isPending={isPreloading || isCreatingDocument} onCreate={handleCreate} />

        <div className="container mx-auto w-full max-w-6xl px-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <span>All Resumes</span>
                  <AnimatedNumber
                    value={preloadedData.total}
                    className={cn(
                      "size-6 inline-flex items-center justify-center",
                      "bg-gray-100/50 dark:bg-gray-800/30",
                      "shadow-sm border border-gray-200/50 dark:border-gray-700/50",
                      "rounded-md px-2",
                      "text-sm font-medium text-gray-500 dark:text-gray-400"
                    )}
                  />
                </h2>
                <button
                  onClick={handleDeleteAll}
                  disabled={preloadedData.data.length === 0}
                  className={cn(
                    "flex items-center gap-2 text-sm text-destructive hover:text-destructive/80",
                    preloadedData.data.length === 0 && "opacity-50 cursor-not-allowed hover:text-destructive"
                  )}
                >
                  <Trash2 className="size-4 md:size-6" />
                  <span>Delete All</span>
                </button>
              </div>

              <DocumentFilters
                selectedStatus={status}
                searchValue={search}
                onStatusChange={handleStatusChange}
                onSearchChange={handleSearchChange}
              />
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
