import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, SkipForward } from 'lucide-react';

const FOCUS_DURATION = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durations = { focus: FOCUS_DURATION, shortBreak: SHORT_BREAK, longBreak: LONG_BREAK };
  const progress = 1 - timeLeft / durations[mode];
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus') {
        setSessions(prev => prev + 1);
        setMode(sessions > 0 && sessions % 4 === 0 ? 'longBreak' : 'shortBreak');
        setTimeLeft(sessions > 0 && sessions % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
      } else {
        setMode('focus');
        setTimeLeft(FOCUS_DURATION);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
          <span className="text-lg">⏱️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-aurum-text">Focus Timer</h1>
          <p className="text-xs text-aurum-muted">{sessions} sessions completed today</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[
          { id: 'focus' as const, label: 'Focus', icon: Brain },
          { id: 'shortBreak' as const, label: 'Short Break', icon: Coffee },
          { id: 'longBreak' as const, label: 'Long Break', icon: Coffee },
        ].map(m => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => switchMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
              mode === m.id
                ? 'bg-aurum-gold/10 border border-aurum-gold/30 text-aurum-gold'
                : 'bg-white/5 border border-white/5 text-aurum-muted hover:text-aurum-secondary'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </motion.button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={isRunning ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-72 h-72"
        >
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            <motion.circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={timeLeft}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-light text-aurum-text tracking-wider font-mono"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className="text-xs text-aurum-muted mt-2 capitalize">
              {mode === 'focus' ? '🧠 Deep Focus' : mode === 'shortBreak' ? '☕ Short Break' : '🌿 Long Break'}
            </span>
          </div>

          {/* Glow effect */}
          {isRunning && (
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 60px rgba(255, 215, 0, 0.15)' }}
            />
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setTimeLeft(durations[mode]); setIsRunning(false); }}
          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
        >
          <RotateCcw className="w-5 h-5 text-aurum-secondary" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-black" />
          ) : (
            <Play className="w-6 h-6 text-black ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (mode === 'focus') {
              setMode('shortBreak');
              setTimeLeft(SHORT_BREAK);
            } else {
              setMode('focus');
              setTimeLeft(FOCUS_DURATION);
            }
            setIsRunning(false);
          }}
          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
        >
          <SkipForward className="w-5 h-5 text-aurum-secondary" />
        </motion.button>
      </div>

      {/* Sessions counter */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            animate={i < sessions % 4 ? { scale: [1, 1.2, 1] } : {}}
            className={`w-3 h-3 rounded-full ${
              i < sessions % 4 ? 'bg-aurum-gold' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
