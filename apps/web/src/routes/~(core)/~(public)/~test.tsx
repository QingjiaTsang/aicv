import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/web/components/shadcn-ui/button";
import { Textarea } from "@/web/components/shadcn-ui/textarea";
import { experimental_useObject } from '@ai-sdk/react';
import { aiSuggestionSchema, AiSuggestion } from '@aicv-app/ai-core';
import SuggestionCard from './suggestion-card';
import { cn } from '@/web/lib/utils';
import { useChat } from '@ai-sdk/react';
import { toast } from "sonner"
import { MarkdownRenderer } from '@/web/components/markdown-renderer';

export const Route = createFileRoute('/(core)/(public)/test')({
  component: OptimizeStreamTextPage,
})

export function OptimizeStreamObjectPage() {
  const [jobDescription, setJobDescription] = useState("熟练掌握 Html、CSS、JavaScript/ES6，Bootsrap 等开发框架");
  const [currentContent, setCurrentContent] = useState("精通 Vue2/Vue3 等前端开发框架");
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  
  const { object, submit, isLoading, error } = experimental_useObject({
    api: '/api/ai/optimize/streamObject',
    schema: aiSuggestionSchema,
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription || !currentContent) {
      return;
    }

    submit({
      jobDescription: {
        content: jobDescription,
      },
      currentContent,
    });
  }, [submit, jobDescription, currentContent]);

  useEffect(() => {
    if (object && object.type && object.content && object.confidence) {
      const suggestion: AiSuggestion = {
        type: object.type,
        content: object.content,
        confidence: object.confidence,
        reason: object.reason
      }
      setSuggestions(prev => [...prev, suggestion])
    }
  }, [object])

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">目标职位描述</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="请输入目标职位描述..."
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">当前简历内容</label>
          <Textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="请输入当前简历内容..."
            className="h-32"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading || !jobDescription || !currentContent}
          className="w-full"
        >
          {isLoading ? "AI 正在分析..." : "开始优化"}
        </Button>
      </form>

      <div className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <SuggestionCard
            key={i}
            suggestion={suggestion}
          />
        ))}
      </div>
    </div>
  );
}

export function OptimizeStreamTextPage() {
  const [jobDescription, setJobDescription] = useState("熟练掌握 Html、CSS、JavaScript/ES6，Bootsrap 等开发框架");
  const [currentContent, setCurrentContent] = useState("精通 Vue2/Vue3 等前端开发框架");

  const { messages, status, error, append } = useChat({
    streamProtocol: 'text',
    api: '/api/ai/optimize/streamText',
    id: 'resume-optimization',
    body: {
      jobDescription: {
        content: jobDescription,
      },
      currentContent,
    },
    onResponse: (response) => {
      if (!response.ok) {
        throw new Error('优化请求失败');
      }
    },
    onError: (error) => {
      console.error('优化失败:', error);
      toast.error(`优化失败：${error.message || '请稍后重试'}`);
    }
  });
  const isStreaming = status === 'streaming'

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription || !currentContent) {
      return;
    }

    try {
      await append({
        role: 'user',
        content: '请帮我优化简历内容',
      });
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请重试');
    }
  }, [append, jobDescription, currentContent]);

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">目标职位描述</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="请输入目标职位描述..."
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">当前简历内容</label>
          <Textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="请输入当前简历内容..."
            className="h-32"
          />
        </div>

        <Button 
          type="submit"
          disabled={isStreaming || !jobDescription || !currentContent}
          className={cn(
            "w-full",
            "bg-gradient-to-r from-violet-600 to-purple-600",
            "hover:from-violet-700 hover:to-purple-700",
            "text-white shadow-lg hover:shadow-primary/25",
            "transition-all duration-300"
          )}
        >
          {isStreaming ? "AI 正在分析..." : "开始优化"}
        </Button>
      </form>

      <div className="space-y-4">
        {messages.map((message) => (
          message.role === 'assistant' && (
            <div 
              key={message.id}
              className={cn(
                "p-4 rounded-lg border bg-card text-card-foreground shadow-sm",
                "animate-in fade-in-50 duration-500"
              )}
            >
              <MarkdownRenderer content={message.content} />
            </div>
          )
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          <p className="text-sm">分析出错：{error.message}</p>
        </div>
      )}

    </div>
  );
}
