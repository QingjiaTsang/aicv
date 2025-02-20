import { DocumentStatus } from "@aicv-app/api/schema";
import { SpinLoader } from "@/web/components/spin-loader";
import useConfirm from "@/web/hooks/use-confirm";
import { cn } from "@/web/lib/utils";
import { DashboardHero } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/hero-section";
import { ResumeList } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/resume-list";
import { useCreateDocumentMutation, useDeleteAllDocumentsMutation, useDeleteDocumentMutation } from "@/web/services/documents/mutations";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatedNumber } from "@/web/components/animated-number";
import { DocumentFilters } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/document-filters";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { infiniteDocumentsQueryOptionsFn } from "@/web/services/documents/queries";
import { useTranslation } from 'react-i18next';

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
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const { status, search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus
  } = useInfiniteQuery(
    infiniteDocumentsQueryOptionsFn({ 
      status, 
      search,
      pageSize: 12
    })
  );

  const { mutate: deleteDocument } = useDeleteDocumentMutation({
    onSuccess: () => {
      toast.success(t('dashboard.toast.deleteSuccess'))
    },
    onError: () => {
      toast.error(t('dashboard.toast.deleteError'))
    }
  });
  const { mutate: createDocument, isPending: isCreatingDocument } = useCreateDocumentMutation();
  const { mutate: deleteAllDocuments, isPending: isDeletingAllDocuments } = useDeleteAllDocumentsMutation({
    onSuccess: async () => {
      toast.success(t('dashboard.toast.deleteAllSuccess'));
    },
    onError: () => {
      toast.error(t('dashboard.toast.deleteAllError'))
    }
  });

  const [DeleteResumeConfirmDialog, confirmDeleteResume] = useConfirm({
    title: t('dashboard.deleteConfirm.title'),
    message: t('dashboard.deleteConfirm.message'),
  }) as [() => JSX.Element, () => Promise<boolean>];

  const [DeleteAllResumeConfirmDialog, confirmDeleteAllResume] = useConfirm({
    title: t('dashboard.deleteAllConfirm.title'),
    message: t('dashboard.deleteAllConfirm.message'),
  }) as [() => JSX.Element, () => Promise<boolean>];

  const handleCreate = () => {
    createDocument({ title: t('dashboard.untitledResume') });
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

  const allResumes = data?.pages.flatMap(page => page.data) ?? [];
  const totalResumes = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      <DeleteResumeConfirmDialog />
      <DeleteAllResumeConfirmDialog />

      {isDeletingAllDocuments && <SpinLoader />}

      <div className="flex flex-col gap-8">
        <DashboardHero isPending={queryStatus === 'pending' || isCreatingDocument} onCreate={handleCreate} />

        <div className="container mx-auto w-full max-w-6xl px-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <span>{t('dashboard.title')}</span>
                  <AnimatedNumber
                    value={totalResumes}
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
                  disabled={allResumes.length === 0}
                  className={cn(
                    "flex items-center gap-2 text-sm text-destructive hover:text-destructive/80",
                    allResumes.length === 0 && "opacity-50 cursor-not-allowed hover:text-destructive"
                  )}
                >
                  <Trash2 className="size-4 md:size-6" />
                  <span>{t('dashboard.deleteAll')}</span>
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
              isLoading={queryStatus === 'pending'}
              resumes={allResumes}
              onDelete={handleDelete}
            />

            {hasNextPage && (
              <div 
                ref={loadMoreRef}
                className="flex justify-center py-4"
              >
                {isFetchingNextPage && (
                  <div className="animate-spin rounded-full size-6 border-2 border-violet-400 border-t-transparent" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
