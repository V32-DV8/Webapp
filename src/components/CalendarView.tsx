import { motion } from 'framer-motion';
import { useTaskStore } from '../stores';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { useState } from 'react';

export default function CalendarView() {
  const { tasks } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(t => t.dueDate === dateStr && !t.parentId);
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
            <span className="text-lg">📅</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-aurum-text">Calendar</h1>
            <p className="text-xs text-aurum-muted">{format(currentMonth, 'MMMM yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-aurum-secondary" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-aurum-secondary hover:bg-white/10"
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4 text-aurum-secondary" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Calendar Grid */}
        <div className="bg-[#080808] border border-white/5 rounded-2xl p-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-aurum-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <motion.button
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative transition-all ${
                    isSelected
                      ? 'bg-aurum-gold/10 border border-aurum-gold/30'
                      : isTodayDate
                        ? 'bg-white/5 border border-aurum-gold/20'
                        : 'hover:bg-white/5 border border-transparent'
                  } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <span className={`text-xs font-medium ${
                    isTodayDate ? 'text-aurum-gold' : isSelected ? 'text-aurum-text' : 'text-aurum-secondary'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div
                          key={t.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.completed ? 'bg-aurum-gold/50' :
                            t.priority === 1 ? 'bg-priority-1' :
                            t.priority === 2 ? 'bg-priority-2' : 'bg-priority-3'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="bg-[#080808] border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-aurum-text mb-3">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
          </h3>
          {selectedDate && (
            <div className="space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-xs text-aurum-muted text-center py-8">No tasks for this day</p>
              ) : (
                selectedTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-2.5 rounded-lg border ${
                      task.completed ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/[0.03] border-white/5'
                    }`}
                  >
                    <p className={`text-xs ${task.completed ? 'line-through text-aurum-muted' : 'text-aurum-text'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === 1 ? 'bg-priority-1' :
                        task.priority === 2 ? 'bg-priority-2' :
                        task.priority === 3 ? 'bg-priority-3' : 'bg-priority-4'
                      }`} />
                      <span className="text-[10px] text-aurum-muted">P{task.priority}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
