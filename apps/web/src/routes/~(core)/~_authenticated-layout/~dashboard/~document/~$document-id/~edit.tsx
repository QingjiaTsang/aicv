import queryClient from "@/web/lib/query-client";
import { documentQueryOptionsFn } from "@/web/services/documents/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, } from "@tanstack/react-router";
import { DocumentHeader } from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/page-header/document-header'

import PersonalInfo from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/personal-info";
import Summary from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/summary";
import Experience from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/experience";
import Education from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/education";
import Skills from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/skills";


export const Route = createFileRoute(
  "/(core)/_authenticated-layout/dashboard/document/$document-id/edit",
)({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(documentQueryOptionsFn(params["document-id"])),
});

function RouteComponent() {
  const params = useParams({ from: Route.id });
  const { data: document, isPending } = useSuspenseQuery(documentQueryOptionsFn(params["document-id"]));

  return (
    <div className="h-full w-full flex flex-col container mx-auto max-w-6xl">
      <DocumentHeader document={document} />

      <div className="flex-1">
        <div className="p-4 flex md:flex-row flex-col gap-4">
          {/* edit form */}
          <div className="flex-1">
            edit form
          </div>

          {/* preview */}
          <div
            className={`flex-1 w-full p-10 shadow-lg border-t-[12px] dark:border`}
            style={{ borderTop: `12px solid ${document.themeColor}` }}
          >
            <PersonalInfo document={document} isLoading={isPending} />

            <Summary document={document} isLoading={isPending} />

            <Experience document={document} isLoading={isPending} />

            <Education document={document} isLoading={isPending} />

            <Skills document={document} isLoading={isPending} />
          </div>
        </div >
      </div>
    </div>
  );

}
