import { ArrowRight, Check } from 'lucide-react';
import { MigrationPath } from '@/types/migration';
import { migrationPaths } from '@/lib/migration-paths';
import { cn } from '@/lib/utils';

interface MigrationPathSelectorProps {
  selectedPath: MigrationPath | null;
  onSelectPath: (path: MigrationPath) => void;
  detectedFramework?: string;
}

export function MigrationPathSelector({
  selectedPath,
  onSelectPath,
  detectedFramework,
}: MigrationPathSelectorProps) {
  const getRecommended = (pathId: MigrationPath): boolean => {
    if (!detectedFramework) return false;
    
    const recommendations: Record<string, MigrationPath[]> = {
      'jQuery': ['jquery-react', 'jquery-vue'],
      'AngularJS': ['angularjs-angular'],
      'React Class': ['react-class-hooks'],
    };
    
    return recommendations[detectedFramework]?.includes(pathId) || false;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Select Migration Path</h2>
        <p className="mt-1 text-muted-foreground">
          Choose the target framework or language for your code
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {migrationPaths.map((path) => {
          const isSelected = selectedPath === path.id;
          const isRecommended = getRecommended(path.id);
          
          return (
            <button
              key={path.id}
              onClick={() => onSelectPath(path.id)}
              className={cn(
                "group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              {isRecommended && (
                <span className="absolute -top-2 right-3 rounded-full bg-success px-2 py-0.5 text-[10px] font-medium text-success-foreground">
                  Recommended
                </span>
              )}
              
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl">{path.icon}</span>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{path.from}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{path.to}</span>
              </div>
              
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {path.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
