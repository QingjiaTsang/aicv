import { useEffect, useState } from "react";
import { Input } from "@/web/components/shadcn-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/web/components/shadcn-ui/select";
import { DOCUMENT_STATUS } from "@aicv-app/api/schema";
import { Search, X } from "lucide-react";
import { cn } from "@/web/lib/utils";
import { useDebounce } from 'use-debounce';
import { DocumentStatus } from "@aicv-app/api/schema";
import { useTranslation } from 'react-i18next';

type DocumentFiltersProps = {
  onStatusChange: (status: DocumentStatus | undefined) => void;
  onSearchChange: (search: string) => void;
  selectedStatus?: DocumentStatus;
  searchValue?: string;
};

export function DocumentFilters({
  onStatusChange,
  onSearchChange,
  selectedStatus,
  searchValue,
}: DocumentFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchValue || "");
  const [debouncedSearch] = useDebounce(localSearch, 500);
  const { t } = useTranslation();

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder={t('common.search')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-8 pr-8"
        />
        {!!localSearch && (
          <button
            onClick={handleClearSearch}
            className={cn(
              "absolute right-2 top-3",
              "hover:text-muted-foreground/80"
            )}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Select
        value={selectedStatus ?? "ALL"}
        onValueChange={(value) => onStatusChange(value === "ALL" ? undefined : value as DocumentStatus)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('dashboard.filters.all')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('dashboard.filters.all')}</SelectItem>
          <SelectItem value={DOCUMENT_STATUS.PUBLIC}>{t('dashboard.filters.public')}</SelectItem>
          <SelectItem value={DOCUMENT_STATUS.PRIVATE}>{t('dashboard.filters.private')}</SelectItem>
          <SelectItem value={DOCUMENT_STATUS.ARCHIVED}>{t('dashboard.filters.archived')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}