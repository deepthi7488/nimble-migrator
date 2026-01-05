import { MigrationPathInfo } from '@/types/migration';

export const migrationPaths: MigrationPathInfo[] = [
  {
    id: 'jquery-react',
    name: 'jQuery → React',
    from: 'jQuery',
    to: 'React Hooks',
    icon: '⚛️',
    description: 'Convert jQuery DOM manipulation and events to React components with hooks and state management',
  },
  {
    id: 'jquery-vue',
    name: 'jQuery → Vue',
    from: 'jQuery',
    to: 'Vue 3',
    icon: '💚',
    description: 'Migrate jQuery code to Vue 3 Composition API with reactive state',
  },
  {
    id: 'python2-python3',
    name: 'Python 2 → Python 3',
    from: 'Python 2',
    to: 'Python 3',
    icon: '🐍',
    description: 'Upgrade Python 2 syntax, print statements, and deprecated methods to Python 3',
  },
  {
    id: 'angularjs-angular',
    name: 'AngularJS → Angular',
    from: 'AngularJS 1.x',
    to: 'Angular 17+',
    icon: '🅰️',
    description: 'Transform AngularJS controllers and directives to modern Angular components',
  },
  {
    id: 'es5-es6',
    name: 'ES5 → ES6+',
    from: 'JavaScript ES5',
    to: 'ES6+ / TypeScript',
    icon: '📜',
    description: 'Convert callbacks to Promises/async-await, var to const/let, and add modern syntax',
  },
  {
    id: 'react-class-hooks',
    name: 'React Class → Hooks',
    from: 'React Class Components',
    to: 'React Hooks',
    icon: '🪝',
    description: 'Migrate lifecycle methods and class state to functional components with hooks',
  },
];

export const getMigrationPath = (id: string): MigrationPathInfo | undefined => {
  return migrationPaths.find(p => p.id === id);
};
