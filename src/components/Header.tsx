import { Code2, GitBranch, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] shadow-lg shadow-primary/25">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              <span className="gradient-text">CodeMigrate</span>
            </h1>
            <p className="text-xs text-muted-foreground">Intelligent Migration Assistant</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#paths" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Migration Paths
          </a>
          <a href="#docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground md:flex">
            <GitBranch className="h-3.5 w-3.5" />
            <span>v1.0.0</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs text-success">
            <Zap className="h-3.5 w-3.5" />
            <span>Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
