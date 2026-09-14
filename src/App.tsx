import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Sidebar, { Header } from './components/Layout';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import PomodoroTimer from './components/PomodoroTimer';
import HabitTracker from './components/HabitTracker';
import Analytics from './components/Analytics';
import QuickAdd from './components/QuickAdd';
import ShortcutsModal from './components/ShortcutsModal';
import ActivityFeed from './components/ActivityFeed';
import { useUIStore } from './stores';

function MainContent() {
  const { currentView } = useUIStore();

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
      case 'today':
      case 'upcoming':
      case 'project':
        return <TaskList />;
      case 'kanban':
        return <KanbanBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'habits':
        return <HabitTracker />;
      case 'analytics':
        return <Analytics />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Activity Feed Sidebar - visible on larger screens */}
      <aside className="hidden xl:block w-[300px] border-l border-white/5 bg-[#080808] overflow-y-auto p-4">
        <ActivityFeed />
      </aside>
    </div>
  );
}

export default function App() {
  const { setQuickAddOpen, setShortcutsOpen, setView, setCurrentProject } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setQuickAddOpen(true);
      }
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
      if (e.key === 'Escape') {
        setQuickAddOpen(false);
        setShortcutsOpen(false);
      }
      // G + key combinations
      if (e.key === 'g' || e.key === 'G') {
        // Wait for next key
        const handler = (e2: KeyboardEvent) => {
          switch (e2.key.toLowerCase()) {
            case 'i': setView('inbox'); setCurrentProject(null); break;
            case 't': setView('today'); setCurrentProject(null); break;
            case 'u': setView('upcoming'); setCurrentProject(null); break;
            case 'b': setView('kanban'); setCurrentProject(null); break;
            case 'c': setView('calendar'); setCurrentProject(null); break;
            case 'h': setView('habits'); setCurrentProject(null); break;
            case 'a': setView('analytics'); setCurrentProject(null); break;
            case 'f': setView('pomodoro'); setCurrentProject(null); break;
          }
          window.removeEventListener('keydown', handler);
        };
        window.addEventListener('keydown', handler, { once: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <MainContent />
      </div>
      <QuickAdd />
      <ShortcutsModal />
    </div>
  );
}
