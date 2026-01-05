import { useState, useCallback } from 'react';
import { Upload, File, FileArchive, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@/types/migration';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
}

const detectLanguage = (filename: string, content: string): { language: string; framework?: string } => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    html: 'html',
    css: 'css',
    vue: 'vue',
  };

  const language = languageMap[ext] || 'unknown';
  let framework: string | undefined;

  if (content.includes('$(' ) || content.includes('jQuery')) {
    framework = 'jQuery';
  } else if (content.includes('angular.module')) {
    framework = 'AngularJS';
  } else if (content.includes('@angular/core')) {
    framework = 'Angular';
  } else if (content.includes('React.Component') || content.includes('extends Component')) {
    framework = 'React Class';
  } else if (content.includes('useState') || content.includes('useEffect')) {
    framework = 'React Hooks';
  } else if (content.includes('createApp') || content.includes('defineComponent')) {
    framework = 'Vue 3';
  }

  return { language, framework };
};

const countLOC = (content: string): number => {
  return content.split('\n').filter(line => line.trim().length > 0).length;
};

export function FileUpload({ onFilesUploaded, uploadedFiles }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: globalThis.File): Promise<UploadedFile> => {
    const content = await file.text();
    const { language, framework } = detectLanguage(file.name, content);
    
    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.name.endsWith('.zip') ? 'zip' : 'file',
      size: file.size,
      content,
      language,
      framework,
      loc: countLOC(content),
    };
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const processedFiles = await Promise.all(files.map(processFile));
    onFilesUploaded([...uploadedFiles, ...processedFiles]);
  }, [uploadedFiles, onFilesUploaded, processFile]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const processedFiles = await Promise.all(files.map(processFile));
    onFilesUploaded([...uploadedFiles, ...processedFiles]);
  }, [uploadedFiles, onFilesUploaded, processFile]);

  const removeFile = useCallback((id: string) => {
    onFilesUploaded(uploadedFiles.filter(f => f.id !== id));
  }, [uploadedFiles, onFilesUploaded]);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
          isDragging ? "bg-primary/20 scale-110" : "bg-secondary"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">
            {isDragging ? "Drop files here" : "Drag & drop your code files"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse • Supports .js, .ts, .py, .html, .vue, .zip
          </p>
        </div>

        <input
          type="file"
          multiple
          accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.vue,.zip"
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {['jQuery', 'Python 2', 'AngularJS', 'ES5', 'React Class'].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilesUploaded([])}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          </div>
          
          <div className="grid gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="glass-card flex items-center justify-between p-3 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  {file.type === 'zip' ? (
                    <FileArchive className="h-5 w-5 text-warning" />
                  ) : (
                    <File className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.loc} LOC</span>
                      {file.framework && (
                        <>
                          <span>•</span>
                          <span className="text-primary">{file.framework}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
