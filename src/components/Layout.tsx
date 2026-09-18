import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useProjectStore, useUserStore } from '../stores';
import {
  Inbox, Calendar, CalendarDays, LayoutDashboard, Flame, BarChart3,
  Timer, Plus, Search, ChevronDown, ChevronRight, Menu, X,
  Sparkles, Trophy, Coins, Target, BookOpen, Briefcase, Heart, Wallet
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, any> = { Briefcase, Target, Heart, BookOpen, Wallet };

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentView, setView, setCurrentProject, currentProjectId, setQuickAddOpen } = useUIStore();
  const { projects } = useProjectStore();
  const { karma, level, coins, streak, getLevelProgress } = useUserStore();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['p1', 'p2']));

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const navItems = [
    { id: 'inbox' as const, icon: Inbox, label: 'Inbox', color: '#FFD700' },
    { id: 'today' as const, icon: Calendar, label: 'Today', color: '#F59E0B' },
    { id: 'upcoming' as const, icon: CalendarDays, label: 'Upcoming', color: '#FBBF24' },
  ];

  const viewItems = [
    { id: 'kanban' as const, icon: LayoutDashboard, label: 'Board' },
    { id: 'calendar' as const, icon: CalendarDays, label: 'Calendar' },
    { id: 'habits' as const, icon: Flame, label: 'Habits' },
    { id: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
    { id: 'pomodoro' as const, icon: Timer, label: 'Focus Timer' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-[280px] bg-[#080808] border-r border-white/5 z-50 flex flex-col overflow-hidden lg:static lg:!transform-none"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-black" />
            </motion.div>
            <span className="font-bold text-lg gold-text-gradient">v32 task</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5 text-aurum-secondary" />
          </button>
        </div>

        {/* Karma & Stats */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-aurum-gold" />
              <span className="text-sm font-medium text-aurum-text">{level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-aurum-amber" />
              <span className="text-xs text-aurum-secondary">{coins}</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getLevelProgress()}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full gold-gradient rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-aurum-muted">{karma} karma</span>
            <div className="flex items-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${streak > 5 ? 'text-orange-500 animate-fire' : 'text-aurum-muted'}`} />
              <span className="text-xs text-aurum-secondary">{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="p-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setQuickAddOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-black font-medium text-sm shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Add Task
            <span className="ml-auto text-xs opacity-70">Q</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-0.5">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setView(item.id); setCurrentProject(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id && !currentProjectId
                    ? 'bg-white/5 text-aurum-gold'
                    : 'text-aurum-secondary hover:text-aurum-text hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" style={{ color: currentView === item.id && !currentProjectId ? item.color : undefined }} />
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Projects */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-aurum-muted uppercase tracking-wider">Projects</span>
              <button className="p-1 hover:bg-white/5 rounded">
                <Plus className="w-3 h-3 text-aurum-muted" />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.map(project => {
                const Icon = iconMap[project.icon] || Target;
                const isExpanded = expandedProjects.has(project.id);
                const isActive = currentProjectId === project.id;
                return (
                  <div key={project.id}>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => { setView('project'); setCurrentProject(project.id); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'bg-white/5 text-aurum-gold' : 'text-aurum-secondary hover:text-aurum-text hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" style={{ color: project.color }} />
                      <span className="flex-1 text-left">{project.name}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); toggleProject(project.id); }}
                        className="p-0.5 hover:bg-white/10 rounded"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </motion.button>
                    </motion.button>
                    <AnimatePresence>
                      {isExpanded && project.sections.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {project.sections.map(section => (
                            <button
                              key={section.id}
                              className="w-full flex items-center gap-3 pl-10 pr-3 py-1.5 rounded-lg text-xs text-aurum-muted hover:text-aurum-secondary hover:bg-white/5 transition-colors"
                            >
                              {section.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Views */}
          <div className="mt-6">
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-aurum-muted uppercase tracking-wider">Views</span>
            </div>
            <div className="space-y-0.5">
              {viewItems.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setView(item.id); setCurrentProject(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentView === item.id ? 'bg-white/5 text-aurum-gold' : 'text-aurum-secondary hover:text-aurum-text hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </nav>
      </motion.aside>
    </>
  );
}

export function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery, setShortcutsOpen } = useUIStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 border-b border-aurum-gold/20 gold-gradient flex items-center px-4 gap-4 sticky top-0 z-30">
      <button onClick={toggleSidebar} className="p-2 hover:bg-black/10 rounded-lg lg:hidden">
        <Menu className="w-5 h-5 text-black" />
      </button>
      
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-black">v32 task</span>
      </div>

      <motion.div
        animate={{ width: searchFocused ? 400 : 280 }}
        className="relative hidden sm:block"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search tasks... (⌘K)"
          className="w-full pl-9 pr-4 py-2 bg-black/10 border border-black/20 rounded-xl text-sm text-black placeholder:text-black/60 focus:outline-none focus:border-black/40 focus:bg-black/15 transition-all"
        />
      </motion.div>

      <div className="flex-1" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShortcutsOpen(true)}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/10 border border-black/20 text-xs text-black/70 hover:text-black hover:bg-black/20 transition-colors"
      >
        <span>⌘</span><span>K</span>
      </motion.button>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-8 h-8 rounded-full bg-black flex items-center justify-center cursor-pointer"
      >
        <span className="text-xs font-bold text-aurum-gold">v32</span>
      </motion.div>
    </header>
  );
}
