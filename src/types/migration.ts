export type MigrationPath = 
  | 'jquery-react'
  | 'jquery-vue'
  | 'python2-python3'
  | 'angularjs-angular'
  | 'es5-es6'
  | 'react-class-hooks';

export interface MigrationPathInfo {
  id: MigrationPath;
  name: string;
  from: string;
  to: string;
  icon: string;
  description: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'file' | 'zip';
  size: number;
  content: string;
  language: string;
  framework?: string;
  loc: number;
}

export interface CompatibilityIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  line?: number;
  suggestion: string;
}

export interface MigrationReport {
  id: string;
  timestamp: Date;
  originalFile: UploadedFile;
  convertedCode: string;
  migrationPath: MigrationPath;
  complexity: 'low' | 'medium' | 'high';
  effortHours: number;
  riskLevel: 'low' | 'medium' | 'high';
  deprecatedPatterns: DeprecatedPattern[];
  compatibilityIssues: CompatibilityIssue[];
  testCoverage: number;
  performanceGain: number;
  testsGenerated: number;
  testsPasssing: number;
  canRollback: boolean;
}

export interface DeprecatedPattern {
  pattern: string;
  instances: number;
  replacement: string;
}

export interface MigrationState {
  step: 'upload' | 'select-path' | 'analyzing' | 'migrating' | 'review' | 'complete';
  progress: number;
  files: UploadedFile[];
  selectedPath: MigrationPath | null;
  currentReport: MigrationReport | null;
  history: MigrationReport[];
}
