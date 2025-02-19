import { cn } from "@/web/lib/utils";

type SuggestionLevel = 'Strongly Recommended' | 'Recommended' | 'For Reference';

type SuggestionTheme = {
  bg: string;
  border: string;
  icon: string;
};

const SUGGESTION_THEMES: Record<SuggestionLevel, SuggestionTheme> = {
  'Strongly Recommended': {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: '🎯'
  },
  'Recommended': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: '💡'
  },
  'For Reference': {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    icon: '💭'
  }
};

const getSuggestionLevel = (confidence: number): SuggestionLevel => {
  if (confidence >= 0.8) {
    return 'Strongly Recommended';
  }
  if (confidence >= 0.5) {
    return 'Recommended';
  }
  return 'For Reference';
};

type SuggestionCardProps = {
  suggestion: {
    type: string;
    content: string;
    confidence: number;
    reason?: string;
  };
  className?: string;
};

const SuggestionCard = ({ suggestion, className }: SuggestionCardProps) => {
  const level = getSuggestionLevel(suggestion.confidence);
  const theme = SUGGESTION_THEMES[level];

  return (
    <div
      className={cn(
        'rounded-lg p-4 border transition-colors',
        theme.bg, 
        theme.border,
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{theme.icon}</span>
            <span className="text-sm font-medium capitalize">
              {suggestion.type}
            </span>
          </div>
          <span className="text-sm text-muted-foreground px-2 py-1 rounded-full bg-black/5 dark:bg-white/5">
            {level}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {suggestion.content}
          </p>
        </div>

        {suggestion.reason && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5">ℹ️</span>
              <p className="flex-1">{suggestion.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionCard;