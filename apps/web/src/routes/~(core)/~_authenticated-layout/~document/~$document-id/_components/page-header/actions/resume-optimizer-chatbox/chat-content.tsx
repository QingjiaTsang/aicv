import type { Message } from 'ai'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Sparkles, Send, Plus, CircleStop, Bot } from 'lucide-react'
import { cn } from '@/web/lib/utils'
import { Button } from '@/web/components/shadcn-ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/web/components/shadcn-ui/avatar'
import { MarkdownRenderer } from '@/web/components/markdown-renderer'
import { useSession } from '@hono/auth-js/react'
import { useLenis } from 'lenis/react'

type ChatContentProps = {
  messages: Message[]
  input: string
  isStreaming: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  handleAnalyzeResume: () => Promise<void>
  onNewChat: () => void
  onStopStreaming: () => void
}

export function ChatContent({ 
  messages,
  input,
  isStreaming,
  handleInputChange,
  handleSubmit,
  handleAnalyzeResume,
  onNewChat,
  onStopStreaming
}: ChatContentProps) {
  const session = useSession();
  const userAvatar = session.data?.user?.image || '/images/user-avatar.png'

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return

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
    <>
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
                alt={message.role === 'assistant' ? 'AI' : 'Me'} 
              />
              <AvatarFallback>
                {message.role === 'assistant' ? 'AI' : 'Me'}
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
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleAnalyzeResume}
              disabled={isStreaming}
            >
              <Sparkles className="mr-2 size-4" />
              Analyze Resume
            </Button>
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
              New Chat
            </Button>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/40",
                "placeholder:text-muted-foreground",
                "min-h-[45px] max-h-[200px]",
                "transition-shadow duration-200"
              )}
              style={{
                overflowY: 'auto'
              }}
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
                  <span className="sr-only">Stop streaming</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
} 