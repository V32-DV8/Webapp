import { addDays, subDays, format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  projectId: string;
  sectionId?: string;
  labels: string[];
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  subtasks: string[];
  parentId?: string;
  order: number;
  status: 'todo' | 'doing' | 'done';
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  projectId: string;
  order: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedDates: string[];
  color: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  taskTitle?: string;
  timestamp: string;
  avatar: string;
}

export const labels = ['Work', 'Personal', 'Health', 'Finance', 'Learning', 'Creative', 'Urgent', 'Review'];

export const projects: Project[] = [
  { id: 'p1', name: 'Work Projects', color: '#FFD700', icon: 'Briefcase', order: 0, sections: [
    { id: 's1', name: 'Sprint 12', projectId: 'p1', order: 0 },
    { id: 's2', name: 'Backlog', projectId: 'p1', order: 1 },
  ]},
  { id: 'p2', name: 'Personal Goals', color: '#F59E0B', icon: 'Target', order: 1, sections: [
    { id: 's3', name: 'This Week', projectId: 'p2', order: 0 },
    { id: 's4', name: 'This Month', projectId: 'p2', order: 1 },
  ]},
  { id: 'p3', name: 'Health & Fitness', color: '#FBBF24', icon: 'Heart', order: 2, sections: [
    { id: 's5', name: 'Daily', projectId: 'p3', order: 0 },
  ]},
  { id: 'p4', name: 'Learning', color: '#FFD700', icon: 'BookOpen', order: 3, sections: [] },
  { id: 'p5', name: 'Finance', color: '#F59E0B', icon: 'Wallet', order: 4, sections: [] },
];

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

export const tasks: Task[] = [
  { id: 't1', title: 'Finalize Q4 presentation deck', description: 'Include revenue charts and team metrics', completed: false, priority: 1, projectId: 'p1', sectionId: 's1', labels: ['Work', 'Urgent'], dueDate: today, createdAt: subDays(new Date(), 3).toISOString(), subtasks: ['t1a', 't1b'], order: 0, status: 'doing' },
  { id: 't1a', title: 'Create revenue charts', description: '', completed: false, priority: 1, projectId: 'p1', labels: ['Work'], dueDate: today, createdAt: subDays(new Date(), 2).toISOString(), subtasks: [], parentId: 't1', order: 0, status: 'doing' },
  { id: 't1b', title: 'Add team performance metrics', description: '', completed: true, priority: 2, projectId: 'p1', labels: ['Work'], dueDate: today, createdAt: subDays(new Date(), 2).toISOString(), completedAt: yesterday, subtasks: [], parentId: 't1', order: 1, status: 'done' },
  { id: 't2', title: 'Review pull requests from team', description: '3 PRs pending review', completed: false, priority: 2, projectId: 'p1', sectionId: 's1', labels: ['Work'], dueDate: today, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 1, status: 'todo' },
  { id: 't3', title: 'Update API documentation', description: 'Document new endpoints for v2.1', completed: false, priority: 3, projectId: 'p1', sectionId: 's2', labels: ['Work'], dueDate: nextWeek, createdAt: subDays(new Date(), 5).toISOString(), subtasks: [], order: 2, status: 'todo' },
  { id: 't4', title: 'Schedule 1:1 with manager', description: 'Discuss promotion timeline', completed: false, priority: 2, projectId: 'p1', sectionId: 's1', labels: ['Work'], dueDate: tomorrow, createdAt: subDays(new Date(), 2).toISOString(), subtasks: [], order: 3, status: 'todo' },
  { id: 't5', title: 'Deploy staging environment', description: 'New feature branch ready for QA', completed: true, priority: 1, projectId: 'p1', sectionId: 's1', labels: ['Work', 'Urgent'], dueDate: yesterday, createdAt: subDays(new Date(), 4).toISOString(), completedAt: yesterday, subtasks: [], order: 4, status: 'done' },
  { id: 't6', title: 'Write unit tests for auth module', description: 'Cover edge cases for OAuth flow', completed: false, priority: 2, projectId: 'p1', sectionId: 's2', labels: ['Work'], dueDate: nextWeek, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 5, status: 'todo' },
  { id: 't7', title: 'Morning meditation - 15 min', description: 'Use Headspace guided session', completed: true, priority: 3, projectId: 'p3', sectionId: 's5', labels: ['Health'], dueDate: today, createdAt: subDays(new Date(), 10).toISOString(), completedAt: today, subtasks: [], order: 0, status: 'done' },
  { id: 't8', title: 'Gym workout - Upper body', description: 'Bench press, rows, shoulder press', completed: false, priority: 3, projectId: 'p3', sectionId: 's5', labels: ['Health'], dueDate: today, createdAt: subDays(new Date(), 7).toISOString(), subtasks: [], order: 1, status: 'todo' },
  { id: 't9', title: 'Prepare healthy meals for the week', description: 'Meal prep Sunday', completed: false, priority: 3, projectId: 'p3', labels: ['Health', 'Personal'], dueDate: tomorrow, createdAt: subDays(new Date(), 3).toISOString(), subtasks: [], order: 2, status: 'todo' },
  { id: 't10', title: 'Read 30 pages of "Atomic Habits"', description: 'Chapter 5-7', completed: false, priority: 4, projectId: 'p4', labels: ['Learning'], dueDate: today, createdAt: subDays(new Date(), 14).toISOString(), subtasks: [], order: 0, status: 'todo' },
  { id: 't11', title: 'Complete TypeScript advanced course', description: 'Module 8: Generics & Utility Types', completed: false, priority: 2, projectId: 'p4', labels: ['Learning'], dueDate: nextWeek, createdAt: subDays(new Date(), 7).toISOString(), subtasks: ['t11a', 't11b'], order: 1, status: 'doing' },
  { id: 't11a', title: 'Watch Module 8 videos', description: '', completed: true, priority: 2, projectId: 'p4', labels: ['Learning'], dueDate: nextWeek, createdAt: subDays(new Date(), 5).toISOString(), completedAt: yesterday, subtasks: [], parentId: 't11', order: 0, status: 'done' },
  { id: 't11b', title: 'Complete Module 8 exercises', description: '', completed: false, priority: 2, projectId: 'p4', labels: ['Learning'], dueDate: nextWeek, createdAt: subDays(new Date(), 5).toISOString(), subtasks: [], parentId: 't11', order: 1, status: 'todo' },
  { id: 't12', title: 'Review monthly budget', description: 'Check spending vs budget for November', completed: false, priority: 2, projectId: 'p5', labels: ['Finance'], dueDate: tomorrow, createdAt: subDays(new Date(), 2).toISOString(), subtasks: [], order: 0, status: 'todo' },
  { id: 't13', title: 'Set up automatic savings transfer', description: 'Move $500 to savings account', completed: false, priority: 3, projectId: 'p5', labels: ['Finance'], dueDate: nextWeek, createdAt: subDays(new Date(), 4).toISOString(), subtasks: [], order: 1, status: 'todo' },
  { id: 't14', title: 'Research investment options', description: 'Compare index funds vs ETFs', completed: false, priority: 4, projectId: 'p5', labels: ['Finance', 'Learning'], dueDate: nextWeek, createdAt: subDays(new Date(), 6).toISOString(), subtasks: [], order: 2, status: 'todo' },
  { id: 't15', title: 'Plan weekend hiking trip', description: 'Research trails, check weather', completed: false, priority: 4, projectId: 'p2', sectionId: 's3', labels: ['Personal'], dueDate: tomorrow, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 0, status: 'todo' },
  { id: 't16', title: 'Call dentist for appointment', description: 'Annual checkup', completed: true, priority: 3, projectId: 'p2', sectionId: 's3', labels: ['Personal', 'Health'], dueDate: yesterday, createdAt: subDays(new Date(), 5).toISOString(), completedAt: yesterday, subtasks: [], order: 1, status: 'done' },
  { id: 't17', title: 'Organize photo library', description: 'Sort and delete duplicates', completed: false, priority: 4, projectId: 'p2', sectionId: 's4', labels: ['Personal'], dueDate: nextWeek, createdAt: subDays(new Date(), 8).toISOString(), subtasks: [], order: 2, status: 'todo' },
  { id: 't18', title: 'Fix navigation bug on mobile', description: 'Hamburger menu not closing on route change', completed: true, priority: 1, projectId: 'p1', sectionId: 's1', labels: ['Work', 'Urgent'], dueDate: yesterday, createdAt: subDays(new Date(), 3).toISOString(), completedAt: yesterday, subtasks: [], order: 6, status: 'done' },
  { id: 't19', title: 'Design system component audit', description: 'Check all components for consistency', completed: false, priority: 3, projectId: 'p1', sectionId: 's2', labels: ['Work'], dueDate: nextWeek, createdAt: subDays(new Date(), 2).toISOString(), subtasks: [], order: 7, status: 'todo' },
  { id: 't20', title: 'Write blog post about React patterns', description: 'Cover compound components and render props', completed: false, priority: 4, projectId: 'p4', labels: ['Learning', 'Creative'], dueDate: nextWeek, createdAt: subDays(new Date(), 3).toISOString(), subtasks: [], order: 2, status: 'todo' },
  { id: 't21', title: 'Evening run - 5km', description: 'Target pace: 5:30/km', completed: false, priority: 3, projectId: 'p3', sectionId: 's5', labels: ['Health'], dueDate: today, createdAt: subDays(new Date(), 7).toISOString(), subtasks: [], order: 3, status: 'todo' },
  { id: 't22', title: 'Update resume with recent projects', description: 'Add AurumTask and analytics dashboard', completed: false, priority: 3, projectId: 'p2', sectionId: 's4', labels: ['Personal', 'Career'], dueDate: nextWeek, createdAt: subDays(new Date(), 5).toISOString(), subtasks: [], order: 3, status: 'todo' },
  { id: 't23', title: 'Refactor database queries', description: 'Optimize N+1 query problem in reports', completed: false, priority: 1, projectId: 'p1', sectionId: 's1', labels: ['Work', 'Urgent'], dueDate: today, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 7, status: 'doing' },
  { id: 't24', title: 'Set up CI/CD pipeline', description: 'GitHub Actions for auto deployment', completed: true, priority: 2, projectId: 'p1', sectionId: 's2', labels: ['Work'], dueDate: subDays(new Date(), 2).toISOString(), createdAt: subDays(new Date(), 10).toISOString(), completedAt: subDays(new Date(), 2).toISOString(), subtasks: [], order: 8, status: 'done' },
  { id: 't25', title: 'Learn Rust basics', description: 'Complete first 3 chapters of The Book', completed: false, priority: 4, projectId: 'p4', labels: ['Learning'], dueDate: nextWeek, createdAt: subDays(new Date(), 2).toISOString(), subtasks: [], order: 3, status: 'todo' },
  { id: 't26', title: 'Grocery shopping', description: 'Weekly groceries - check list', completed: false, priority: 3, projectId: 'p2', sectionId: 's3', labels: ['Personal'], dueDate: today, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 4, status: 'todo' },
  { id: 't27', title: 'Pay electricity bill', description: 'Due end of month', completed: true, priority: 2, projectId: 'p5', labels: ['Finance', 'Urgent'], dueDate: yesterday, createdAt: subDays(new Date(), 7).toISOString(), completedAt: yesterday, subtasks: [], order: 3, status: 'done' },
  { id: 't28', title: 'Clean workspace and organize desk', description: 'Deep clean including monitors and keyboard', completed: false, priority: 4, projectId: 'p2', sectionId: 's3', labels: ['Personal'], dueDate: tomorrow, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 5, status: 'todo' },
  { id: 't29', title: 'Team retrospective notes', description: 'Document action items from retro', completed: false, priority: 2, projectId: 'p1', sectionId: 's1', labels: ['Work'], dueDate: today, createdAt: subDays(new Date(), 1).toISOString(), subtasks: [], order: 8, status: 'todo' },
  { id: 't30', title: 'Practice piano - 30 min', description: 'Work on Chopin Nocturne', completed: false, priority: 4, projectId: 'p2', sectionId: 's4', labels: ['Personal', 'Creative'], dueDate: today, createdAt: subDays(new Date(), 14).toISOString(), subtasks: [], order: 6, status: 'todo' },
];

export const habits: Habit[] = [
  { id: 'h1', name: 'Meditation', icon: '🧘', streak: 12, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd'), format(subDays(new Date(), 2), 'yyyy-MM-dd'), format(subDays(new Date(), 3), 'yyyy-MM-dd'), format(subDays(new Date(), 4), 'yyyy-MM-dd')], color: '#FFD700' },
  { id: 'h2', name: 'Exercise', icon: '💪', streak: 7, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd'), format(subDays(new Date(), 2), 'yyyy-MM-dd'), format(subDays(new Date(), 4), 'yyyy-MM-dd'), format(subDays(new Date(), 5), 'yyyy-MM-dd')], color: '#F59E0B' },
  { id: 'h3', name: 'Reading', icon: '📚', streak: 21, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd'), format(subDays(new Date(), 2), 'yyyy-MM-dd'), format(subDays(new Date(), 3), 'yyyy-MM-dd'), format(subDays(new Date(), 4), 'yyyy-MM-dd'), format(subDays(new Date(), 5), 'yyyy-MM-dd'), format(subDays(new Date(), 6), 'yyyy-MM-dd')], color: '#FBBF24' },
  { id: 'h4', name: 'No Sugar', icon: '🚫', streak: 5, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd'), format(subDays(new Date(), 3), 'yyyy-MM-dd')], color: '#FFD700' },
  { id: 'h5', name: 'Journaling', icon: '✍️', streak: 3, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 2), 'yyyy-MM-dd')], color: '#F59E0B' },
  { id: 'h6', name: 'Hydration (8 glasses)', icon: '💧', streak: 15, completedDates: [format(subDays(new Date(), 0), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd'), format(subDays(new Date(), 2), 'yyyy-MM-dd'), format(subDays(new Date(), 3), 'yyyy-MM-dd'), format(subDays(new Date(), 4), 'yyyy-MM-dd'), format(subDays(new Date(), 5), 'yyyy-MM-dd')], color: '#FBBF24' },
];

export const activities: Activity[] = [
  { id: 'a1', userId: 'u1', userName: 'You', action: 'completed', taskTitle: 'Deploy staging environment', timestamp: new Date().toISOString(), avatar: '👤' },
  { id: 'a2', userId: 'u1', userName: 'You', action: 'created', taskTitle: 'Refactor database queries', timestamp: subDays(new Date(), 0).toISOString(), avatar: '👤' },
  { id: 'a3', userId: 'u2', userName: 'Sarah Chen', action: 'commented on', taskTitle: 'Finalize Q4 presentation deck', timestamp: subDays(new Date(), 0).toISOString(), avatar: '👩' },
  { id: 'a4', userId: 'u1', userName: 'You', action: 'completed', taskTitle: 'Fix navigation bug on mobile', timestamp: subDays(new Date(), 1).toISOString(), avatar: '👤' },
  { id: 'a5', userId: 'u3', userName: 'Alex Kim', action: 'assigned', taskTitle: 'Write unit tests for auth module', timestamp: subDays(new Date(), 1).toISOString(), avatar: '👨' },
  { id: 'a6', userId: 'u1', userName: 'You', action: 'completed', taskTitle: 'Set up CI/CD pipeline', timestamp: subDays(new Date(), 2).toISOString(), avatar: '👤' },
  { id: 'a7', userId: 'u1', userName: 'You', action: 'completed', taskTitle: 'Pay electricity bill', timestamp: subDays(new Date(), 1).toISOString(), avatar: '👤' },
  { id: 'a8', userId: 'u2', userName: 'Sarah Chen', action: 'completed', taskTitle: 'Team retrospective notes', timestamp: subDays(new Date(), 1).toISOString(), avatar: '👩' },
];

export const analyticsData = {
  weeklyCompletions: [
    { day: 'Mon', completed: 5, created: 3 },
    { day: 'Tue', completed: 8, created: 4 },
    { day: 'Wed', completed: 6, created: 7 },
    { day: 'Thu', completed: 9, created: 5 },
    { day: 'Fri', completed: 7, created: 6 },
    { day: 'Sat', completed: 3, created: 2 },
    { day: 'Sun', completed: 4, created: 3 },
  ],
  monthlyTrend: [
    { week: 'W1', karma: 120 },
    { week: 'W2', karma: 180 },
    { week: 'W3', karma: 150 },
    { week: 'W4', karma: 220 },
  ],
  productivityByHour: [
    { hour: '6am', tasks: 1 },
    { hour: '7am', tasks: 2 },
    { hour: '8am', tasks: 4 },
    { hour: '9am', tasks: 7 },
    { hour: '10am', tasks: 9 },
    { hour: '11am', tasks: 8 },
    { hour: '12pm', tasks: 3 },
    { hour: '1pm', tasks: 2 },
    { hour: '2pm', tasks: 6 },
    { hour: '3pm', tasks: 8 },
    { hour: '4pm', tasks: 7 },
    { hour: '5pm', tasks: 5 },
    { hour: '6pm', tasks: 3 },
    { hour: '7pm', tasks: 2 },
    { hour: '8pm', tasks: 1 },
  ],
  projectDistribution: [
    { name: 'Work', value: 45, color: '#FFD700' },
    { name: 'Personal', value: 25, color: '#F59E0B' },
    { name: 'Health', value: 15, color: '#FBBF24' },
    { name: 'Learning', value: 10, color: '#FFD700' },
    { name: 'Finance', value: 5, color: '#F59E0B' },
  ],
};

export const contributionData: Record<string, number> = {};
for (let i = 0; i < 365; i++) {
  const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
  contributionData[date] = Math.floor(Math.random() * 5);
}
