import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { X, Sparkles, Minus } from 'lucide-react'
import { cn } from '@/web/lib/utils'
import { Button } from '@/web/components/shadcn-ui/button'
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { useMediaQuery } from '@/web/hooks/use-media-query'
import { useChat } from '@ai-sdk/react'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/web/components/shadcn-ui/drawer"
import { Resizable } from 'react-resizable';
import { ChatContent } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/actions/resume-optimizer-chatbox/chat-content'
import { useTranslation } from 'react-i18next'

type OptimizeResumeChatProps = {
  document: SelectDocumentWithRelationsSchema
  section: "summary" | "experience" | "all"
  isOpen: boolean
  onClose: () => void
}

export function OptimizeResumeChat({ document, section, isOpen, onClose }: OptimizeResumeChatProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isMinimized, setIsMinimized] = useState(false)
  const [size, setSize] = useState({ width: 400, height: 600 })
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 620 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const { t } = useTranslation()

  const resumeContent = useMemo(() => {
    const sections = [
      {
        type: 'summary',
        content: document.summary || ''
      },
      ...(document.experience?.filter((exp): exp is NonNullable<typeof exp> => exp !== null)
        .map(exp => ({
          type: 'experience' as const,
          content: `${exp.companyName || ''} - ${exp.title || ''}\n${exp.workSummary || ''}`
        })) || []),
      ...(document.education?.filter((edu): edu is NonNullable<typeof edu> => edu !== null)
        .map(edu => ({
          type: 'education' as const,
          content: `${edu.universityName || ''} - ${edu.major || ''}\n${edu.description || ''}`
        })) || []),
      ...(document.skills?.filter((skill): skill is NonNullable<typeof skill> => skill !== null)
        .map(skill => ({
          type: 'skills' as const,
          content: `${skill.name || ''} (${skill.rating}/5)`
        })) || [])
    ];

    const resumeContent = sections.map(section => `${section.type.toUpperCase()}: ${section.content}`).join('\n');

    return resumeContent
  }, [document])

  const resumeContextRef = useRef<{
    sections: {
      content: string
    } | null,
    uploadedResume: {
      content: string
    } | null
  }>({
    sections: {
      content: resumeContent
    },
    uploadedResume: null
  })


  const { 
    messages, 
    append, 
    status,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    setMessages,
    stop
  } = useChat({
    streamProtocol: 'text',
    api: '/api/ai/optimize/streamText',
    id: `resume-optimization-${document.id}-${section}`,
    body: { resumeContext: resumeContextRef.current },
    onError: (_error) => {
      toast.error(t('prompts.error.streaming'))
    }
  })
  const isStreaming = status === 'streaming'

  const handleAnalyzeResume = useCallback(async () => {
    if (isStreaming) {
      return
    }

    try {
      resumeContextRef.current = {
        sections: {
          content: resumeContent
        },
        uploadedResume: null
      }

      const promptMap = {
        summary: t('prompts.analyze.summary'),
        experience: t('prompts.analyze.experience'),
        all: t('prompts.analyze.all')
      }

      await append({
        role: 'user',
        content: promptMap[section],
      })
    } catch (error) {
      toast.error(t('prompts.error.analysis'))
    }
  }, [append, isStreaming])

  const handleNewChat = useCallback(() => {
    setMessages([])
    reload()
    // reset resume context
    resumeContextRef.current = {
      sections: {
        content: resumeContent
      },
      uploadedResume: null
    }
  }, [setMessages, reload])

  const handleStopStreaming = useCallback(() => {
    stop()
  }, [stop])

  const handleUploadedResume = useCallback(async (fileTextContent: string) => {
    if (isStreaming) {
      return
    }
    
    try {
      resumeContextRef.current = {
        sections: null,
        uploadedResume: {
          content: fileTextContent
        }
      }

      await append({
        role: 'user',
        content: t('upload.prompt'),
      });
    } catch (error) {
      toast.error(t('upload.error'))
    }
  }, [append, isStreaming])

  const handleResize = (_e: React.SyntheticEvent, { size: newSize }: { size: { width: number; height: number } }) => {
    const maxWidth = window.innerWidth - position.x - 20
    const maxHeight = window.innerHeight - position.y - 20
    
    setSize({
      width: Math.min(newSize.width, maxWidth),
      height: Math.min(newSize.height, maxHeight)
    })
  }

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) {
      return
    }

    const newX = e.clientX - dragStartPos.current.x
    const newY = e.clientY - dragStartPos.current.y

    // Keep within screen bounds
    const boundedX = Math.min(Math.max(20, newX), window.innerWidth - size.width - 20)
    const boundedY = Math.min(Math.max(20, newY), window.innerHeight - size.height - 20)

    setPosition({ x: boundedX, y: boundedY })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isDragging])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const newX = Math.min(Math.max(20, prev.x), window.innerWidth - size.width - 20)
        const newY = Math.min(Math.max(20, prev.y), window.innerHeight - size.height - 20)
        return { x: newX, y: newY }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [size])

  if (!isOpen) {
    return null
  }

  // Mobile version
  if (!isDesktop) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent  className="h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <DrawerDescription className='hidden'>
                {t('drawer.description', { title: document.title })}
              </DrawerDescription>
              <Sparkles className="size-4 text-violet-500" />
              <span>{t('drawer.title')}</span>
            </DrawerTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 hover:text-violet-500"
              aria-label={t('drawer.close')}
            >
              <X className="size-4" />
              <span className="sr-only">{t('drawer.close')}</span>
            </Button>
          </DrawerHeader>
          
          <div data-lenis-stop className="flex flex-col h-[calc(100%-4rem)]">
            <ChatContent 
              messages={messages}
              input={input}
              isStreaming={isStreaming}
              section={section}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleAnalyzeResume={handleAnalyzeResume}
              onNewChat={handleNewChat}
              onStopStreaming={handleStopStreaming}
              handleUploadedResume={handleUploadedResume}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop version
  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      minConstraints={[300, 400]}
      maxConstraints={[
        window.innerWidth - position.x - 20,
        window.innerHeight - position.y - 20
      ]}
      handle={
        <div className={cn(
          "absolute right-0 bottom-0 w-4 h-4 cursor-se-resize",
          "after:content-[''] after:absolute after:right-1 after:bottom-1",
          "after:w-2 after:h-2 after:border-r-2 after:border-b-2",
          "after:border-violet-500/50",
          isMinimized && "hidden"
        )} />
      }
    >
      <div 
        role="dialog"
        aria-labelledby="optimize-chat-title"
        aria-modal="true"
        style={{
          position: 'fixed',
          left: position.x,
          top: isMinimized ? position.y + size.height - 48 : position.y,
          width: size.width,
          height: isMinimized ? 48 : size.height,
        }}
        className={cn(
          "rounded-lg border shadow-lg",
          "bg-background",
          "transition-all duration-300 ease-in-out",
          "z-50",
          isMinimized && "rounded-b-none",
        )}
      >
        <div 
          className={cn(
            "flex items-center justify-between",
            "px-4 h-12 border-b",
            "bg-violet-50 dark:bg-violet-950/50",
            "cursor-move select-none",
          )}
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-violet-500" />
            <h2 id="optimize-chat-title" className="text-sm font-medium">
              {section === 'all' 
                ? t('section.optimize.title')
                : section === 'summary'
                  ? t('section.optimize.summary')
                  : t('section.optimize.experience')
              }
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 hover:text-violet-500"
              aria-label={isMinimized ? t('drawer.expand') : t('drawer.minimize')}
            >
              <Minus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:text-violet-500"
              aria-label={t('drawer.close')}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div data-lenis-stop className="h-[calc(100%-3rem)] flex flex-col">
            <ChatContent 
              messages={messages}
              input={input}
              isStreaming={isStreaming}
              section={section}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleAnalyzeResume={handleAnalyzeResume}
              onNewChat={handleNewChat}
              onStopStreaming={handleStopStreaming}
              handleUploadedResume={handleUploadedResume}
            />
          </div>
        )}
      </div>
    </Resizable>
  )
}