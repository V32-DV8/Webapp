import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tasks as mockTasks, projects as mockProjects, habits as mockHabits, activities as mockActivities, type Task, type Project, type Habit, type Activity } from '../data/mockData';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id && t.parentId !== id)
      })),
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString(), status: 'done' as const } : t)
      })),
      reorderTasks: (tasks) => set({ tasks }),
      getTasksByProject: (projectId) => get().tasks.filter(t => t.projectId === projectId && !t.parentId),
      getTasksByStatus: (status) => get().tasks.filter(t => t.status === status && !t.parentId),
      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(t => t.dueDate === today && !t.parentId);
      },
      getUpcomingTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(t => t.dueDate && t.dueDate > today && !t.completed && !t.parentId);
      },
    }),
    { name: 'aurumtask-tasks' }
  )
);

interface ProjectStore {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: mockProjects,
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
    }),
    { name: 'aurumtask-projects' }
  )
);

interface UserStore {
  karma: number;
  level: string;
  coins: number;
  streak: number;
  lastActiveDate: string;
  addKarma: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  getLevelProgress: () => number;
}

const getLevelFromKarma = (karma: number): string => {
  if (karma >= 5000) return 'Grandmaster';
  if (karma >= 3000) return 'Master';
  if (karma >= 1500) return 'Expert';
  if (karma >= 800) return 'Advanced';
  if (karma >= 400) return 'Intermediate';
  if (karma >= 100) return 'Apprentice';
  return 'Beginner';
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      karma: 847,
      level: 'Advanced',
      coins: 234,
      streak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      addKarma: (amount) => set((state) => {
        const newKarma = state.karma + amount;
        return { karma: newKarma, level: getLevelFromKarma(newKarma) };
      }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1, lastActiveDate: new Date().toISOString().split('T')[0] })),
      getLevelProgress: () => {
        const karma = get().karma;
        if (karma >= 5000) return 100;
        if (karma >= 3000) return ((karma - 3000) / 2000) * 100;
        if (karma >= 1500) return ((karma - 1500) / 1500) * 100;
        if (karma >= 800) return ((karma - 800) / 700) * 100;
        if (karma >= 400) return ((karma - 400) / 400) * 100;
        if (karma >= 100) return ((karma - 100) / 300) * 100;
        return (karma / 100) * 100;
      },
    }),
    { name: 'aurumtask-user' }
  )
);

interface HabitStore {
  habits: Habit[];
  toggleHabit: (id: string, date: string) => void;
  addHabit: (habit: Habit) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: mockHabits,
      toggleHabit: (id, date) => set((state) => ({
        habits: state.habits.map(h => {
          if (h.id !== id) return h;
          const isCompleted = h.completedDates.includes(date);
          const completedDates = isCompleted
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date];
          const streak = isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;
          return { ...h, completedDates, streak };
        })
      })),
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
    }),
    { name: 'aurumtask-habits' }
  )
);

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set) => ({
      activities: mockActivities,
      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities].slice(0, 50)
      })),
    }),
    { name: 'aurumtask-activities' }
  )
);

interface UIStore {
  sidebarOpen: boolean;
  currentView: 'inbox' | 'today' | 'upcoming' | 'project' | 'kanban' | 'calendar' | 'habits' | 'analytics' | 'pomodoro';
  currentProjectId: string | null;
  searchQuery: string;
  quickAddOpen: boolean;
  shortcutsOpen: boolean;
  selectedTaskId: string | null;
  toggleSidebar: () => void;
  setView: (view: UIStore['currentView']) => void;
  setCurrentProject: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setQuickAddOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  setSelectedTask: (id: string | null) => void;
}

export const useUIStore = create<UIStore>()(
  (set) => ({
    sidebarOpen: true,
    currentView: 'inbox',
    currentProjectId: null,
    searchQuery: '',
    quickAddOpen: false,
    shortcutsOpen: false,
    selectedTaskId: null,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setView: (view) => set({ currentView: view }),
    setCurrentProject: (id) => set({ currentProjectId: id }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setQuickAddOpen: (open) => set({ quickAddOpen: open }),
    setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
    setSelectedTask: (id) => set({ selectedTaskId: id }),
  })
);
