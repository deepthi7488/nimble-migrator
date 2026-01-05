import { useState } from 'react';
import { Copy, Check, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CodeComparisonProps {
  originalCode: string;
  convertedCode: string;
  originalLanguage: string;
  convertedLanguage: string;
  onRollback?: () => void;
  canRollback?: boolean;
}

export function CodeComparison({
  originalCode,
  convertedCode,
  originalLanguage,
  convertedLanguage,
  onRollback,
  canRollback = true,
}: CodeComparisonProps) {
  const [copiedSide, setCopiedSide] = useState<'original' | 'converted' | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const copyToClipboard = async (code: string, side: 'original' | 'converted') => {
    await navigator.clipboard.writeText(code);
    setCopiedSide(side);
    toast.success(`${side === 'original' ? 'Original' : 'Converted'} code copied to clipboard`);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  const highlightSyntax = (code: string, language: string) => {
    // Simple syntax highlighting
    const keywords = language === 'python' 
      ? ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'raise', 'with', 'as', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'print', 'range', 'async', 'await']
      : ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'super', 'static', 'interface', 'type', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'];

    return code.split('\n').map((line, lineIndex) => {
      let processedLine = line;
      
      // Highlight strings
      processedLine = processedLine.replace(
        /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-success">$&</span>'
      );
      
      // Highlight comments
      if (language === 'python') {
        processedLine = processedLine.replace(
          /(#.*)$/,
          '<span class="text-muted-foreground italic">$1</span>'
        );
      } else {
        processedLine = processedLine.replace(
          /(\/\/.*)$/,
          '<span class="text-muted-foreground italic">$1</span>'
        );
      }
      
      // Highlight keywords
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        processedLine = processedLine.replace(
          regex,
          '<span class="text-primary font-medium">$1</span>'
        );
      });

      // Highlight numbers
      processedLine = processedLine.replace(
        /\b(\d+)\b/g,
        '<span class="text-warning">$1</span>'
      );

      return (
        <div key={lineIndex} className="flex">
          <span className="mr-4 w-8 flex-shrink-0 select-none text-right text-muted-foreground/50">
            {lineIndex + 1}
          </span>
          <span 
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: processedLine || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'split' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Split View
          </Button>
          <Button
            variant={viewMode === 'unified' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('unified')}
          >
            Unified
          </Button>
        </div>
        
        {canRollback && onRollback && (
          <Button variant="outline" size="sm" onClick={onRollback}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Rollback
          </Button>
        )}
      </div>

      <div className={cn(
        "grid gap-4",
        viewMode === 'split' ? "lg:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Original Code */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="text-sm font-medium">Original</span>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {originalLanguage}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(originalCode, 'original')}
              className="h-8"
            >
              {copiedSide === 'original' ? (
                <Check className="mr-2 h-4 w-4 text-success" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy
            </Button>
          </div>
          <div className="code-block max-h-[500px] overflow-auto p-4 scrollbar-thin">
            <pre className="text-sm leading-relaxed">
              {highlightSyntax(originalCode, originalLanguage)}
            </pre>
          </div>
        </div>

        {/* Converted Code */}
        <div className="glass-card overflow-hidden glow-primary">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm font-medium">Converted</span>
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {convertedLanguage}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(convertedCode, 'converted')}
              className="h-8"
            >
              {copiedSide === 'converted' ? (
                <Check className="mr-2 h-4 w-4 text-success" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy
            </Button>
          </div>
          <div className="code-block max-h-[500px] overflow-auto p-4 scrollbar-thin">
            <pre className="text-sm leading-relaxed">
              {highlightSyntax(convertedCode, convertedLanguage)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
