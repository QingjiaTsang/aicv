import type { Message } from 'ai'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Sparkles, Send, Plus, CircleStop } from 'lucide-react'
import { cn } from '@/web/lib/utils'
import { Button } from '@/web/components/shadcn-ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/web/components/shadcn-ui/avatar'
import { MarkdownRenderer } from '@/web/components/markdown-renderer'
import { useSession } from '@hono/auth-js/react'
import { UploadResumeButton } from './resume-upload-button'
import { useTranslation } from 'react-i18next'


type ChatContentProps = {
  messages: Message[]
  input: string
  isStreaming: boolean
  section: "summary" | "experience" | "all"
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  handleAnalyzeResume: () => Promise<void>
  onNewChat: () => void
  onStopStreaming: () => void
  handleUploadedResume: (fileTextContent: string) => Promise<void>
}

export function ChatContent({ 
  messages,
  input,
  isStreaming,
  section,
  handleInputChange,
  handleSubmit,
  handleAnalyzeResume,
  onNewChat,
  onStopStreaming,
  handleUploadedResume
}: ChatContentProps) {
  const { t } = useTranslation();
  const session = useSession();
  const userAvatar = session.data?.user?.image || '/images/user-avatar.png'

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const isScrolledToBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10

    setUserScrolled(!isScrolledToBottom)
  }, [])


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isStreaming && input.trim()) {
        handleSubmit(e)
      }
    }
  }

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll)
      return () => chatContainer.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (isStreaming && !userScrolled) {
      scrollToBottom()
    }
  }, [messages, isStreaming, userScrolled, scrollToBottom])

  return (
    <div className="flex h-[600px] flex-col flex-1">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 sm:gap-4"
      >
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 md:gap-3",
              message.role === 'assistant' ? 'mr-auto' : 'ml-auto flex-row-reverse',
              "max-w-[85%] sm:max-w-[calc(100%-4rem)]"
            )}
          >
            <Avatar className="size-6 md:size-8 shrink-0">
              <AvatarImage 
                src={message.role === 'assistant' ? '/images/ai-avatar.png' : userAvatar} 
                alt={message.role === 'assistant' ? t('chat.message.assistant') : t('chat.message.user')} 
              />
              <AvatarFallback>
                {message.role === 'assistant' ? t('chat.message.assistant') : t('chat.message.user')}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "rounded-lg p-2 md:p-3 text-sm md:text-base",
                message.role === 'assistant' 
                  ? "bg-violet-50 dark:bg-violet-950/50" 
                  : "bg-violet-500 dark:bg-violet-400 text-white"
              )}
            >
              <MarkdownRenderer content={message.content} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleAnalyzeResume}
                disabled={isStreaming}
              >
                <Sparkles className="size-4" />
                {section === 'all' 
                  ? t('optimize.analyzeResume')
                  : section === 'summary' 
                    ? t('optimize.optimizeSummary')
                    : t('optimize.optimizeExperience')
                }
              </Button>
              
              {section === 'all' && (
                <UploadResumeButton
                  onUploadSuccess={handleUploadedResume}
                  disabled={isStreaming}
                />
              )}
            </div>
          )}
           {messages.length > 0 && (
            <Button
              onClick={onNewChat}
              disabled={isStreaming}
              className={cn(
                "w-full",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "transition-colors duration-200"
              )}
            >
              <Plus className="mr-2 size-4" />
              {t('optimize.newChat')}
            </Button>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.input.placeholder')}
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/40",
                "placeholder:text-muted-foreground",
                "min-h-[45px] max-h-[200px]",
                "transition-shadow duration-200",
                "overflow-y-auto"
              )}
            />
            <Button 
              type="button"
              size="icon"
              onClick={isStreaming ? onStopStreaming : handleSubmit}
              disabled={!input.trim() && !isStreaming}
              className={cn(
                "shrink-0 size-11 rounded-md",
                isStreaming 
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              {isStreaming ? (
                <>
                  <CircleStop className="size-6" />
                  <span className="sr-only">{t('chat.input.stop')}</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span className="sr-only">{t('chat.input.send')}</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 