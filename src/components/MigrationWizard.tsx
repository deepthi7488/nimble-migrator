import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from './FileUpload';
import { MigrationPathSelector } from './MigrationPathSelector';
import { CodeComparison } from './CodeComparison';
import { MigrationReport } from './MigrationReport';
import { ProgressIndicator } from './ProgressIndicator';
import { 
  MigrationState, 
  MigrationPath, 
  UploadedFile, 
  MigrationReport as ReportType 
} from '@/types/migration';
import { codeExamples } from '@/lib/code-examples';
import { getMigrationPath } from '@/lib/migration-paths';
import { toast } from 'sonner';

const STEPS = [
  { id: 'upload', label: 'Upload' },
  { id: 'select-path', label: 'Select Path' },
  { id: 'analyzing', label: 'Analyzing' },
  { id: 'migrating', label: 'Migrating' },
  { id: 'review', label: 'Review' },
];

const generateMockReport = (file: UploadedFile, path: MigrationPath): ReportType => {
  const example = codeExamples[path];
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    originalFile: file,
    convertedCode: example.converted,
    migrationPath: path,
    complexity: file.loc > 1000 ? 'high' : file.loc > 300 ? 'medium' : 'low',
    effortHours: Math.ceil(file.loc / 100),
    riskLevel: file.loc > 1000 ? 'medium' : 'low',
    deprecatedPatterns: getDeprecatedPatterns(path),
    compatibilityIssues: getCompatibilityIssues(path),
    testCoverage: 87,
    performanceGain: 35,
    testsGenerated: 12,
    testsPasssing: 12,
    canRollback: true,
  };
};

const getDeprecatedPatterns = (path: MigrationPath) => {
  const patterns: Record<MigrationPath, { pattern: string; instances: number; replacement: string }[]> = {
    'jquery-react': [
      { pattern: '$.ajax()', instances: 12, replacement: 'fetch/axios' },
      { pattern: '$(selector).click()', instances: 28, replacement: 'onClick handler' },
      { pattern: '$(selector).html()', instances: 45, replacement: 'React state/JSX' },
    ],
    'jquery-vue': [
      { pattern: '$.ajax()', instances: 8, replacement: 'fetch/axios' },
      { pattern: '$(selector).val()', instances: 15, replacement: 'v-model' },
    ],
    'python2-python3': [
      { pattern: 'print "..."', instances: 34, replacement: 'print(...)' },
      { pattern: '.iteritems()', instances: 12, replacement: '.items()' },
      { pattern: 'xrange()', instances: 8, replacement: 'range()' },
    ],
    'angularjs-angular': [
      { pattern: '$scope', instances: 45, replacement: 'component properties' },
      { pattern: '$http', instances: 18, replacement: 'HttpClient' },
      { pattern: 'ng-click', instances: 22, replacement: '(click)' },
    ],
    'es5-es6': [
      { pattern: 'var', instances: 89, replacement: 'const/let' },
      { pattern: 'function()', instances: 34, replacement: 'arrow functions' },
      { pattern: 'callback', instances: 12, replacement: 'async/await' },
    ],
    'react-class-hooks': [
      { pattern: 'componentDidMount', instances: 8, replacement: 'useEffect' },
      { pattern: 'this.state', instances: 24, replacement: 'useState' },
      { pattern: 'this.setState', instances: 18, replacement: 'setState' },
    ],
  };
  
  return patterns[path] || [];
};

const getCompatibilityIssues = (path: MigrationPath) => {
  const issues: Record<MigrationPath, { id: string; severity: 'critical' | 'warning' | 'info'; title: string; description: string; line?: number; suggestion: string }[]> = {
    'jquery-react': [
      { id: '1', severity: 'critical', title: 'Direct DOM Manipulation', description: 'jQuery direct DOM changes conflict with React virtual DOM', line: 45, suggestion: 'Use React refs or state instead' },
      { id: '2', severity: 'warning', title: 'jQuery Plugin Dependency', description: 'Custom jQuery plugin detected that needs manual conversion', line: 78, suggestion: 'Find React equivalent or wrap in useEffect' },
      { id: '3', severity: 'warning', title: 'Event Delegation Pattern', description: 'jQuery event delegation needs restructuring', line: 102, suggestion: 'Use React event handlers on components' },
      { id: '4', severity: 'info', title: 'Animation Library', description: 'jQuery animations can be replaced with CSS or Framer Motion', line: 156, suggestion: 'Consider using framer-motion for animations' },
    ],
    'jquery-vue': [
      { id: '1', severity: 'critical', title: 'Direct DOM Manipulation', description: 'jQuery DOM manipulation conflicts with Vue reactivity', line: 32, suggestion: 'Use Vue refs and reactive state' },
      { id: '2', severity: 'warning', title: 'Ajax Calls', description: 'Replace $.ajax with fetch or axios', line: 67, suggestion: 'Use Composition API with async/await' },
    ],
    'python2-python3': [
      { id: '1', severity: 'critical', title: 'Print Statement Syntax', description: 'Python 2 print statement must be converted to function', line: 12, suggestion: 'Use print() function syntax' },
      { id: '2', severity: 'warning', title: 'Dictionary Iteration', description: 'iteritems() removed in Python 3', line: 45, suggestion: 'Use items() instead' },
      { id: '3', severity: 'info', title: 'Integer Division', description: 'Division behavior changed in Python 3', line: 78, suggestion: 'Use // for integer division' },
    ],
    'angularjs-angular': [
      { id: '1', severity: 'critical', title: 'Scope Binding', description: '$scope is not available in modern Angular', line: 23, suggestion: 'Use component class properties' },
      { id: '2', severity: 'critical', title: 'Dependency Injection', description: 'DI syntax changed significantly', line: 34, suggestion: 'Use constructor injection' },
      { id: '3', severity: 'warning', title: 'Template Syntax', description: 'ng-* directives need conversion', line: 89, suggestion: 'Use new Angular syntax' },
    ],
    'es5-es6': [
      { id: '1', severity: 'warning', title: 'Callback Pattern', description: 'Callback hell detected, consider refactoring', line: 56, suggestion: 'Convert to Promise/async-await' },
      { id: '2', severity: 'info', title: 'Variable Hoisting', description: 'var hoisting may cause unexpected behavior', line: 12, suggestion: 'Use const/let with block scoping' },
    ],
    'react-class-hooks': [
      { id: '1', severity: 'warning', title: 'Lifecycle Method', description: 'componentWillMount is deprecated', line: 34, suggestion: 'Move logic to useEffect or useState initializer' },
      { id: '2', severity: 'info', title: 'this Binding', description: 'Arrow functions or bind patterns can be simplified', line: 67, suggestion: 'Use functional components with hooks' },
    ],
  };
  
  return issues[path] || [];
};

export function MigrationWizard() {
  const [state, setState] = useState<MigrationState>({
    step: 'upload',
    progress: 0,
    files: [],
    selectedPath: null,
    currentReport: null,
    history: [],
  });

  const [originalCode, setOriginalCode] = useState<string>('');

  const handleFilesUploaded = useCallback((files: UploadedFile[]) => {
    setState(prev => ({ ...prev, files }));
  }, []);

  const handleSelectPath = useCallback((path: MigrationPath) => {
    setState(prev => ({ ...prev, selectedPath: path }));
  }, []);

  const handleStartMigration = useCallback(async () => {
    if (!state.selectedPath || state.files.length === 0) return;

    // Use demo code if no real file content
    const example = codeExamples[state.selectedPath];
    const fileContent = state.files[0].content.trim() || example.original;
    setOriginalCode(fileContent);

    // Simulate analysis
    setState(prev => ({ ...prev, step: 'analyzing', progress: 0 }));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 150));
      setState(prev => ({ ...prev, progress: i }));
    }

    // Simulate migration
    setState(prev => ({ ...prev, step: 'migrating', progress: 0 }));
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 100));
      setState(prev => ({ ...prev, progress: i }));
    }

    // Generate report
    const report = generateMockReport(
      { ...state.files[0], content: fileContent },
      state.selectedPath
    );
    
    setState(prev => ({ 
      ...prev, 
      step: 'review', 
      currentReport: report,
      history: [...prev.history, report],
    }));

    toast.success('Migration completed successfully!');
  }, [state.files, state.selectedPath]);

  const handleRollback = useCallback(() => {
    if (!state.currentReport) return;
    
    setState(prev => ({
      ...prev,
      step: 'select-path',
      currentReport: null,
    }));
    
    toast.info('Rolled back to original code');
  }, [state.currentReport]);

  const handleReset = useCallback(() => {
    setState({
      step: 'upload',
      progress: 0,
      files: [],
      selectedPath: null,
      currentReport: null,
      history: state.history,
    });
    setOriginalCode('');
  }, [state.history]);

  const handleDownloadReport = useCallback(() => {
    if (!state.currentReport) return;
    
    const report = state.currentReport;
    const content = `
Migration Report
================
Date: ${report.timestamp.toISOString()}
File: ${report.originalFile.name}
LOC: ${report.originalFile.loc}
Migration: ${getMigrationPath(report.migrationPath)?.name}

Complexity: ${report.complexity}
Effort: ${report.effortHours} hours
Risk: ${report.riskLevel}

Test Coverage: ${report.testCoverage}%
Tests: ${report.testsPasssing}/${report.testsGenerated} passing
Performance Gain: +${report.performanceGain}%

Deprecated Patterns:
${report.deprecatedPatterns.map(p => `- ${p.pattern} (${p.instances}x) → ${p.replacement}`).join('\n')}

Compatibility Issues:
${report.compatibilityIssues.map(i => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.description}`).join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded');
  }, [state.currentReport]);

  const getCompletedSteps = (): string[] => {
    const stepOrder = ['upload', 'select-path', 'analyzing', 'migrating', 'review'];
    const currentIndex = stepOrder.indexOf(state.step);
    return stepOrder.slice(0, currentIndex);
  };

  const canProceed = () => {
    switch (state.step) {
      case 'upload': return state.files.length > 0;
      case 'select-path': return state.selectedPath !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    switch (state.step) {
      case 'upload':
        setState(prev => ({ ...prev, step: 'select-path' }));
        break;
      case 'select-path':
        handleStartMigration();
        break;
    }
  };

  const handleBack = () => {
    switch (state.step) {
      case 'select-path':
        setState(prev => ({ ...prev, step: 'upload' }));
        break;
      case 'review':
        handleReset();
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <ProgressIndicator 
        steps={STEPS} 
        currentStep={state.step}
        completedSteps={getCompletedSteps()}
      />

      {/* Content */}
      <div className="min-h-[400px]">
        {state.step === 'upload' && (
          <div className="animate-fade-in">
            <FileUpload 
              onFilesUploaded={handleFilesUploaded}
              uploadedFiles={state.files}
            />
          </div>
        )}

        {state.step === 'select-path' && (
          <div className="animate-fade-in">
            <MigrationPathSelector
              selectedPath={state.selectedPath}
              onSelectPath={handleSelectPath}
              detectedFramework={state.files[0]?.framework}
            />
          </div>
        )}

        {(state.step === 'analyzing' || state.step === 'migrating') && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-secondary">
                <div 
                  className="h-full w-full rounded-full border-4 border-primary border-t-transparent animate-spin"
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% ${state.progress}%, 0 ${state.progress}%)` 
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <h2 className="mt-6 text-xl font-semibold">
              {state.step === 'analyzing' ? 'Analyzing Code...' : 'Converting Code...'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {state.step === 'analyzing' 
                ? 'Detecting patterns, dependencies, and compatibility issues'
                : 'Transforming code to modern standards'
              }
            </p>
            <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <span className="mt-2 text-sm text-muted-foreground">{state.progress}%</span>
          </div>
        )}

        {state.step === 'review' && state.currentReport && state.selectedPath && (
          <div className="space-y-8 animate-fade-in">
            <CodeComparison
              originalCode={originalCode || codeExamples[state.selectedPath].original}
              convertedCode={state.currentReport.convertedCode}
              originalLanguage={codeExamples[state.selectedPath].language}
              convertedLanguage={codeExamples[state.selectedPath].convertedLanguage}
              onRollback={handleRollback}
              canRollback={state.currentReport.canRollback}
            />
            
            <MigrationReport report={state.currentReport} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={state.step === 'upload' || state.step === 'analyzing' || state.step === 'migrating'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {state.step === 'review' ? 'Start Over' : 'Back'}
        </Button>

        <div className="flex items-center gap-3">
          {state.step === 'review' && (
            <>
              <Button variant="outline" onClick={handleRollback}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Rollback
              </Button>
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </>
          )}
          
          {state.step !== 'review' && state.step !== 'analyzing' && state.step !== 'migrating' && (
            <Button 
              variant="gradient"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {state.step === 'select-path' ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Migration
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
