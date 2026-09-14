import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useUIStore } from '../stores';
import { useState } from 'react';
import { Plus, X, Calendar, Flag, Hash } from 'lucide-react';
import { format, addDays, parse } from 'date-fns';
import type { Task } from '../data/mockData';

export default function QuickAdd() {
  const { quickAddOpen, setQuickAddOpen, currentProjectId } = useUIStore();
  const { addTask, tasks } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const parseNaturalLanguage = (input: string) => {
    let parsedTitle = input;
    let parsedDate = '';
    let parsedPriority: 1 | 2 | 3 | 4 = 4;
    let parsedLabels: string[] = [];

    // Parse dates
    const today = new Date();
    if (input.toLowerCase().includes('today')) {
      parsedDate = format(today, 'yyyy-MM-dd');
      parsedTitle = parsedTitle.replace(/today/i, '').trim();
    } else if (input.toLowerCase().includes('tomorrow')) {
      parsedDate = format(addDays(today, 1), 'yyyy-MM-dd');
      parsedTitle = parsedTitle.replace(/tomorrow/i, '').trim();
    } else if (input.toLowerCase().includes('next week')) {
      parsedDate = format(addDays(today, 7), 'yyyy-MM-dd');
      parsedTitle = parsedTitle.replace(/next week/i, '').trim();
    }

    // Parse priority
    if (input.includes('p1') || input.toLowerCase().includes('urgent')) {
      parsedPriority = 1;
      parsedTitle = parsedTitle.replace(/p1|urgent/i, '').trim();
    } else if (input.includes('p2')) {
      parsedPriority = 2;
      parsedTitle = parsedTitle.replace(/p2/i, '').trim();
    } else if (input.includes('p3')) {
      parsedPriority = 3;
      parsedTitle = parsedTitle.replace(/p3/i, '').trim();
    }

    // Parse labels (#tag)
    const labelMatches = input.match(/#(\w+)/g);
    if (labelMatches) {
      parsedLabels = labelMatches.map(l => l.slice(1).charAt(0).toUpperCase() + l.slice(2));
      parsedTitle = parsedTitle.replace(/#\w+/g, '').trim();
    }

    return { title: parsedTitle, date: parsedDate, priority: parsedPriority, labels: parsedLabels };
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const parsed = parseNaturalLanguage(title);
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: parsed.title || title.trim(),
      description,
      completed: false,
      priority: parsed.priority || priority,
      projectId: currentProjectId || 'p1',
      labels: parsed.labels.length > 0 ? parsed.labels : labels,
      dueDate: parsed.date || dueDate || undefined,
      createdAt: new Date().toISOString(),
      subtasks: [],
      order: tasks.length,
      status: 'todo',
    };
    addTask(newTask);
    setTitle('');
    setDescription('');
    setPriority(4);
    setDueDate('');
    setLabels([]);
    setQuickAddOpen(false);
  };

  return (
    <AnimatePresence>
      {quickAddOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={() => setQuickAddOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl z-[70] shadow-[0_0_60px_rgba(255,215,0,0.1)]"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-aurum-text">Quick Add Task</h3>
                <button onClick={() => setQuickAddOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg">
                  <X className="w-4 h-4 text-aurum-muted" />
                </button>
              </div>

              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder='Try: "Review PRs tomorrow p1 #work"'
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-aurum-text placeholder:text-aurum-muted focus:outline-none focus:border-aurum-gold/30"
              />

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full mt-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-aurum-text placeholder:text-aurum-muted focus:outline-none focus:border-aurum-gold/20"
              />

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 text-aurum-muted hover:text-aurum-secondary"
                >
                  <Calendar className="w-3 h-3" />
                  {dueDate ? format(new Date(dueDate), 'MMM d') : 'Due date'}
                </motion.button>

                <div className="flex items-center gap-1">
                  {([1, 2, 3, 4] as const).map(p => (
                    <motion.button
                      key={p}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPriority(p)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium border transition-all ${
                        priority === p
                          ? p === 1 ? 'bg-priority-1/20 border-priority-1 text-priority-1'
                            : p === 2 ? 'bg-priority-2/20 border-priority-2 text-priority-2'
                            : p === 3 ? 'bg-priority-3/20 border-priority-3 text-priority-3'
                            : 'bg-white/10 border-white/20 text-aurum-text'
                          : 'bg-white/5 border-white/5 text-aurum-muted'
                      }`}
                    >
                      P{p}
                    </motion.button>
                  ))}
                </div>
              </div>

              {showDatePicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 flex gap-2"
                >
                  <button onClick={() => { setDueDate(format(new Date(), 'yyyy-MM-dd')); setShowDatePicker(false); }} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 text-aurum-secondary hover:bg-white/10">Today</button>
                  <button onClick={() => { setDueDate(format(addDays(new Date(), 1), 'yyyy-MM-dd')); setShowDatePicker(false); }} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 text-aurum-secondary hover:bg-white/10">Tomorrow</button>
                  <button onClick={() => { setDueDate(format(addDays(new Date(), 7), 'yyyy-MM-dd')); setShowDatePicker(false); }} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 text-aurum-secondary hover:bg-white/10">Next week</button>
                </motion.div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setQuickAddOpen(false)} className="px-4 py-2 rounded-xl text-sm text-aurum-muted hover:text-aurum-secondary hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl text-sm font-medium gold-gradient text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                >
                  Add Task
                </motion.button>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-white/5">
              <p className="text-[10px] text-aurum-muted">
                💡 Tip: Use natural language — "tomorrow p1 #work" auto-parses date, priority & label
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
