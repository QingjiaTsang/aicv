import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/web/lib/utils'

type MarkdownRendererProps = {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg',
        'prose-p:text-sm prose-li:text-sm',
        'prose-code:bg-muted prose-code:p-1 prose-code:rounded',
        "break-words whitespace-pre-wrap overflow-hidden",
        className
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  )
}