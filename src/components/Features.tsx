import { 
  Upload, 
  Search, 
  RefreshCw, 
  Split, 
  TestTube, 
  Gauge, 
  RotateCcw, 
  FileText 
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Smart Upload',
    description: 'Upload single files or ZIP repositories with automatic language and framework detection',
  },
  {
    icon: Search,
    title: 'Deep Analysis',
    description: 'Identify deprecated APIs, complexity metrics, and risk areas with effort estimation',
  },
  {
    icon: RefreshCw,
    title: 'Auto Migration',
    description: 'Convert legacy code while preserving syntax and maintaining interoperability',
  },
  {
    icon: Split,
    title: 'Side-by-Side View',
    description: 'Compare original and converted code with clear visual highlighting',
  },
  {
    icon: TestTube,
    title: 'Test Generation',
    description: 'Automatically generate unit tests ensuring behavioral equivalence',
  },
  {
    icon: Gauge,
    title: 'Performance Metrics',
    description: 'Compare performance between legacy and modern implementations',
  },
  {
    icon: RotateCcw,
    title: 'Safe Rollback',
    description: 'Instantly restore original code with verification of full restoration',
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'Generate comprehensive migration reports with best practices documentation',
  },
];

export function Features() {
  return (
    <section id="features" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Enterprise-Grade <span className="gradient-text">Features</span>
        </h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to migrate legacy codebases safely and efficiently
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
