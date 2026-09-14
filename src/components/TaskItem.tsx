import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useUserStore, useActivityStore } from '../stores';
import { Calendar, Flag, ChevronRight, MoreHorizontal, Trash2, Edit3, MessageSquare, Sparkles } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { useState } from 'react';
import type { Task } from '../data/mockData';
import AIBreakdown from './AIBreakdown';

const priorityColors = {
  1: 'text-priority-1',
  2: 'text-priority-2',
  3: 'text-priority-3',
  4: 'text-priority-4',
};

const priorityLabels = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4' };

function formatDueDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

interface TaskItemProps {
  task: Task;
  index: number;
  isSubtask?: boolean;
}

export default function TaskItem({ task, index, isSubtask }: TaskItemProps) {
  const { completeTask, deleteTask, updateTask, tasks } = useTaskStore();
  const { addKarma, addCoins } = useUserStore();
  const { addActivity } = useActivityStore();
  const [showActions, setShowActions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showAIBreakdown, setShowAIBreakdown] = useState(false);

  const subtasks = tasks.filter(t => t.parentId === task.id);
  const completedSubtasks = subtasks.filter(t => t.completed).length;
  const dueDate = formatDueDate(task.dueDate);
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;

  const handleComplete = () => {
    if (task.completed) return;
    setIsCompleting(true);
    setTimeout(() => {
      completeTask(task.id);
      addKarma(10);
      addCoins(5);
      addActivity({
        id: `a-${Date.now()}`,
        userId: 'u1',
        userName: 'You',
        action: 'completed',
        taskTitle: task.title,
        timestamp: new Date().toISOString(),
        avatar: '👤',
      });
      setIsCompleting(false);
    }, 600);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
      className={`group relative ${isSubtask ? 'ml-8' : ''}`}
    >
      {/* Completion ripple effect */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 rounded-xl bg-aurum-gold/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-white/5 transition-all ${
          task.completed ? 'opacity-50' : ''
        } ${task.priority === 1 && !task.completed ? 'border-l-2 border-l-priority-1' : ''}`}
      >
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleComplete}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed || isCompleting
              ? 'border-aurum-gold bg-aurum-gold'
              : task.priority === 1
                ? 'border-priority-1 hover:bg-priority-1/20 animate-gold-pulse'
                : task.priority === 2
                  ? 'border-priority-2 hover:bg-priority-2/20'
                  : task.priority === 3
                    ? 'border-priority-3 hover:bg-priority-3/20'
                    : 'border-aurum-muted hover:bg-white/10'
          }`}
        >
          <AnimatePresence>
            {(task.completed || isCompleting) && (
              <motion.svg
                initial={{ scale: 0, pathLength: 0 }}
                animate={{ scale: 1, pathLength: 1 }}
                exit={{ scale: 0 }}
                className="w-3 h-3 text-black"
                viewBox="0 0 12 12"
                fill="none"
              >
                <motion.path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              className="w-full bg-white/5 border border-aurum-gold/30 rounded-lg px-2 py-1 text-sm text-aurum-text focus:outline-none"
            />
          ) : (
            <motion.p
              animate={task.completed ? { opacity: 0.5 } : { opacity: 1 }}
              className={`text-sm leading-snug ${task.completed ? 'line-through text-aurum-muted' : 'text-aurum-text'}`}
            >
              {task.title}
            </motion.p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {dueDate && (
              <span className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-aurum-error' : 'text-aurum-muted'
              }`}>
                <Calendar className="w-3 h-3" />
                {dueDate}
              </span>
            )}
            {task.labels.length > 0 && (
              <div className="flex gap-1">
                {task.labels.slice(0, 2).map(label => (
                  <span key={label} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-aurum-muted border border-white/5">
                    {label}
                  </span>
                ))}
              </div>
            )}
            {subtasks.length > 0 && (
              <span className="text-xs text-aurum-muted">
                {completedSubtasks}/{subtasks.length}
              </span>
            )}
            {task.description && (
              <span className="text-xs text-aurum-muted flex items-center gap-0.5">
                <MessageSquare className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Subtasks */}
          <AnimatePresence>
            {subtasks.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-1 space-y-0.5"
              >
                {subtasks.map((subtask, i) => (
                  <TaskItem key={subtask.id} task={subtask} index={i} isSubtask />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isSubtask && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAIBreakdown(true)}
              className="p-1.5 hover:bg-aurum-gold/10 rounded-lg"
              title="AI Breakdown"
            >
              <Sparkles className="w-3.5 h-3.5 text-aurum-gold" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-white/5 rounded-lg"
          >
            <Edit3 className="w-3.5 h-3.5 text-aurum-muted" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5 text-aurum-muted hover:text-aurum-error" />
          </motion.button>
        </div>

        {/* AI Breakdown Modal */}
        <AnimatePresence>
          {showAIBreakdown && (
            <AIBreakdown task={task} onClose={() => setShowAIBreakdown(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
