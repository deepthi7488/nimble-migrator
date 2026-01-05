import { Header } from '@/components/Header';
import { Features } from '@/components/Features';
import { MigrationWizard } from '@/components/MigrationWizard';
import { migrationPaths } from '@/lib/migration-paths';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[hsl(199,89%,48%)]/10 blur-3xl" />
        </div>
        
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Enterprise-Ready Migration Tool
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Migrate Legacy Code with{' '}
              <span className="gradient-text">Confidence</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your codebase from jQuery to React, Python 2 to 3, and more. 
              Automated analysis, conversion, testing, and validation in one powerful tool.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {migrationPaths.slice(0, 4).map((path) => (
                <div 
                  key={path.id}
                  className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"
                >
                  <span>{path.icon}</span>
                  <span className="text-muted-foreground">{path.from}</span>
                  <ArrowRight className="h-3 w-3 text-primary" />
                  <span>{path.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Migration Tool */}
      <main className="container py-12">
        <div className="glass-card p-6 md:p-8 lg:p-10">
          <MigrationWizard />
        </div>
        
        <Features />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 CodeMigrate. Built for enterprise code modernization.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">API Reference</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
