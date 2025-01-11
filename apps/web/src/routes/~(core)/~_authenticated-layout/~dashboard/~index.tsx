import { DashboardHero } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/hero-section";
import { ResumeList } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/resume-list";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(core)/_authenticated-layout/dashboard/",
)({
  component: DashboardPage,
});

// 模拟数据，实际应该从 API 获取
const mockResumes = [
  {
    id: "1",
    title: "Software Engineer Resume",
    updatedAt: "2024-03-15T10:00:00Z",
    status: "public" as const,
  },
  {
    id: "2",
    title: "Product Manager Draft",
    updatedAt: "2024-03-14T15:30:00Z",
    status: "private" as const,
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate({ to: "/dashboard/document/$document-id/edit", params: { "document-id": id } });
  };

  const handleDelete = async (id: string) => {
    // 实现删除逻辑
    console.log("Delete resume:", id);
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardHero />

      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              All Resumes
            </h2>
          </div>

          <ResumeList
            resumes={mockResumes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}