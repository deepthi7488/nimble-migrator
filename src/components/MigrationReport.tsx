import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Shield, 
  FileCode2,
  TestTube,
  Zap,
  Info
} from 'lucide-react';
import { MigrationReport as ReportType, CompatibilityIssue } from '@/types/migration';
import { getMigrationPath } from '@/lib/migration-paths';
import { cn } from '@/lib/utils';

interface MigrationReportProps {
  report: ReportType;
}

export function MigrationReport({ report }: MigrationReportProps) {
  const migrationPath = getMigrationPath(report.migrationPath);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getComplexityBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: CompatibilityIssue['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info': return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{migrationPath?.icon}</span>
              <h2 className="text-xl font-semibold">{migrationPath?.name} Migration</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.originalFile.name} • {report.originalFile.loc.toLocaleString()} LOC
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn(
              "rounded-full px-3 py-1 text-sm font-medium capitalize",
              getComplexityBg(report.complexity)
            )}>
              {report.complexity} Complexity
            </span>
            {report.canRollback && (
              <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm text-success">
                <Shield className="h-3.5 w-3.5" />
                Rollback Available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Effort Estimate</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{report.effortHours}h</p>
          <p className="text-xs text-muted-foreground">estimated work</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Risk Level</span>
          </div>
          <p className={cn("mt-2 text-2xl font-bold capitalize", getRiskColor(report.riskLevel))}>
            {report.riskLevel}
          </p>
          <p className="text-xs text-muted-foreground">migration risk</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TestTube className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Test Coverage</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-success">{report.testCoverage}%</p>
          <p className="text-xs text-muted-foreground">
            {report.testsPasssing}/{report.testsGenerated} passing
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Performance</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">+{report.performanceGain}%</p>
          <p className="text-xs text-muted-foreground">faster rendering</p>
        </div>
      </div>

      {/* Deprecated Patterns */}
      {report.deprecatedPatterns.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCode2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Deprecated Patterns Identified</h3>
          </div>
          
          <div className="space-y-3">
            {report.deprecatedPatterns.map((pattern, index) => (
              <div 
                key={index}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <code className="rounded bg-code-bg px-2 py-1 font-mono text-sm text-destructive">
                    {pattern.pattern}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    {pattern.instances} instance{pattern.instances !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">→</span>
                  <code className="rounded bg-success/10 px-2 py-1 font-mono text-sm text-success">
                    {pattern.replacement}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compatibility Issues */}
      {report.compatibilityIssues.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold">Compatibility Issues</h3>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                {report.compatibilityIssues.filter(i => i.severity === 'critical').length} Critical
              </span>
              <span className="flex items-center gap-1 text-warning">
                <span className="h-2 w-2 rounded-full bg-warning" />
                {report.compatibilityIssues.filter(i => i.severity === 'warning').length} Warning
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {report.compatibilityIssues.map((issue) => (
              <div 
                key={issue.id}
                className={cn(
                  "rounded-lg border p-4",
                  issue.severity === 'critical' 
                    ? "border-destructive/30 bg-destructive/5"
                    : issue.severity === 'warning'
                    ? "border-warning/30 bg-warning/5"
                    : "border-border bg-secondary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{issue.title}</h4>
                      {issue.line && (
                        <span className="text-xs text-muted-foreground">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-primary">{issue.suggestion}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Summary */}
      <div className="glass-card flex items-center gap-4 p-6 bg-success/5 border-success/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-success">Migration Complete</h3>
          <p className="text-sm text-muted-foreground">
            Code successfully converted with {report.testsPasssing} tests passing. 
            Original code preserved for rollback.
          </p>
        </div>
      </div>
    </div>
  );
}
