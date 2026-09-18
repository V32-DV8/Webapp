import { motion } from 'framer-motion';
import { useHabitStore } from '../stores';
import { format, subDays } from 'date-fns';
import { Plus, Flame, Target } from 'lucide-react';
import { useState } from 'react';

export default function HabitTracker() {
  const { habits, toggleHabit } = useHabitStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Generate last 30 days for the grid
  const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
            <span className="text-lg">🔥</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-aurum-text">Habit Tracker</h1>
            <p className="text-xs text-aurum-muted">{habits.length} active habits</p>
          </div>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3 mb-8">
        {habits.map((habit, index) => {
          const isCompletedToday = habit.completedDates.includes(today);
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#080808] border border-white/5 rounded-2xl p-4"
            >
              <div className="flex items-center gap-4">
                {/* Completion button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleHabit(habit.id, today)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    isCompletedToday
                      ? 'bg-aurum-gold/20 border-2 border-aurum-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                      : 'bg-white/5 border-2 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isCompletedToday ? '✅' : habit.icon}
                </motion.button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-medium ${isCompletedToday ? 'text-aurum-gold' : 'text-aurum-text'}`}>
                      {habit.name}
                    </h3>
                    {habit.streak >= 7 && (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center gap-0.5 text-[10px] text-orange-500"
                      >
                        <Flame className="w-3 h-3" />
                        {habit.streak}
                      </motion.span>
                    )}
                  </div>

                  {/* Mini streak bar */}
                  <div className="flex gap-0.5 mt-2">
                    {last30Days.map(date => {
                      const isCompleted = habit.completedDates.includes(date);
                      return (
                        <motion.div
                          key={date}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-sm ${
                            isCompleted ? 'bg-aurum-gold' : 'bg-white/5'
                          }`}
                          title={`${date}: ${isCompleted ? 'Completed' : 'Missed'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold gold-text-gradient">{habit.streak}</div>
                  <div className="text-[10px] text-aurum-muted">day streak</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contribution Heatmap */}
      <div className="bg-[#080808] border border-white/5 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-aurum-text mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-aurum-gold" />
          Activity Overview
        </h3>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 91 }, (_, i) => {
            const date = format(subDays(new Date(), 90 - i), 'yyyy-MM-dd');
            const totalCompletions = habits.filter(h => h.completedDates.includes(date)).length;
            const intensity = totalCompletions / habits.length;
            return (
              <motion.div
                key={date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.005 }}
                className={`w-3 h-3 rounded-sm ${
                  intensity === 0 ? 'bg-white/5' :
                  intensity <= 0.25 ? 'bg-aurum-gold/20' :
                  intensity <= 0.5 ? 'bg-aurum-gold/40' :
                  intensity <= 0.75 ? 'bg-aurum-gold/60' :
                  'bg-aurum-gold'
                }`}
                title={`${date}: ${totalCompletions} habits`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-aurum-muted">Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-aurum-gold/20" />
          <div className="w-3 h-3 rounded-sm bg-aurum-gold/40" />
          <div className="w-3 h-3 rounded-sm bg-aurum-gold/60" />
          <div className="w-3 h-3 rounded-sm bg-aurum-gold" />
          <span className="text-[10px] text-aurum-muted">More</span>
        </div>
      </div>
    </motion.div>
  );
}
