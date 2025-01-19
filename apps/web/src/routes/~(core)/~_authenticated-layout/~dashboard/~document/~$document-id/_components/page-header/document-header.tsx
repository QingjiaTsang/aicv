import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { DocumentHeaderTitle } from './document-header-title'
import { DocumentHeaderActions } from './document-header-actions'

type DocumentHeaderProps = {
  document: SelectDocumentWithRelationsSchema
}

export function DocumentHeader({ document }: DocumentHeaderProps) {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <DocumentHeaderTitle document={document} />
      {/* TODO: add actions */}
      <DocumentHeaderActions
        document={document}
        onThemeChange={() => { }}
        onPreview={() => { }}
        onDelete={() => { }}
        onShare={() => { }}
        onDownload={() => { }}
      />
    </div>
  )
}