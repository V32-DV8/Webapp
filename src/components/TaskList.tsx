import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useUIStore, useProjectStore } from '../stores';
import TaskItem from './TaskItem';
import { Inbox, Calendar, CalendarDays, Filter, SortAsc } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { useState } from 'react';

const viewConfig = {
  inbox: { title: 'Inbox', icon: Inbox, description: 'All your tasks' },
  today: { title: 'Today', icon: Calendar, description: "What's due today" },
  upcoming: { title: 'Upcoming', icon: CalendarDays, description: 'Coming up' },
  project: { title: 'Project', icon: Inbox, description: '' },
};

export default function TaskList() {
  const { currentView, currentProjectId, searchQuery } = useUIStore();
  const { tasks, getTodayTasks, getUpcomingTasks } = useTaskStore();
  const { projects } = useProjectStore();
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [filterPriority, setFilterPriority] = useState<number | null>(null);

  let displayTasks = tasks.filter(t => !t.parentId);

  if (currentView === 'today') {
    displayTasks = getTodayTasks();
  } else if (currentView === 'upcoming') {
    displayTasks = getUpcomingTasks();
  } else if (currentView === 'project' && currentProjectId) {
    displayTasks = tasks.filter(t => t.projectId === currentProjectId && !t.parentId);
  }

  if (searchQuery) {
    displayTasks = displayTasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  if (filterPriority) {
    displayTasks = displayTasks.filter(t => t.priority === filterPriority);
  }

  displayTasks = [...displayTasks].sort((a, b) => {
    if (sortBy === 'priority') return a.priority - b.priority;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const config = viewConfig[currentView as keyof typeof viewConfig] || viewConfig.inbox;
  const project = currentProjectId ? projects.find(p => p.id === currentProjectId) : null;
  const title = project ? project.name : config.title;
  const Icon = project ? Inbox : config.icon;

  const activeTasks = displayTasks.filter(t => !t.completed);
  const completedTasks = displayTasks.filter(t => t.completed);

  return (
    <motion.div
      key={currentView + (currentProjectId || '')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-aurum-gold" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-aurum-text">{title}</h1>
          <p className="text-xs text-aurum-muted">{activeTasks.length} active tasks</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setFilterPriority(null)}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
            !filterPriority ? 'bg-aurum-gold/10 border-aurum-gold/30 text-aurum-gold' : 'bg-white/5 border-white/5 text-aurum-muted hover:text-aurum-secondary'
          }`}
        >
          All
        </motion.button>
        {[1, 2, 3, 4].map(p => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterPriority(filterPriority === p ? null : p)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
              filterPriority === p ? 'bg-white/10 border-white/20 text-aurum-text' : 'bg-white/5 border-white/5 text-aurum-muted hover:text-aurum-secondary'
            }`}
          >
            P{p}
          </motion.button>
        ))}
        <div className="flex-1" />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSortBy(sortBy === 'date' ? 'priority' : sortBy === 'priority' ? 'name' : 'date')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 text-aurum-muted hover:text-aurum-secondary"
        >
          <SortAsc className="w-3 h-3" />
          {sortBy === 'date' ? 'By date' : sortBy === 'priority' ? 'By priority' : 'By name'}
        </motion.button>
      </div>

      {/* Task List */}
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
          {activeTasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-3 px-3">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-aurum-muted font-medium">{completedTasks.length} completed</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="space-y-0.5">
            <AnimatePresence>
              {completedTasks.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {displayTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <Icon className="w-8 h-8 text-aurum-muted" />
          </div>
          <p className="text-aurum-muted text-sm">No tasks here yet</p>
          <p className="text-aurum-muted/50 text-xs mt-1">Press Q to add a new task</p>
        </motion.div>
      )}
    </motion.div>
  );
}
