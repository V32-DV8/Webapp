import { motion } from 'framer-motion';
import { useTaskStore, useUserStore } from '../stores';
import { analyticsData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Flame, Award, Clock, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-aurum-muted mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { tasks } = useTaskStore();
  const { karma, level, coins, streak, getLevelProgress } = useUserStore();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.filter(t => !t.parentId).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Karma', value: karma, icon: Award, color: '#FFD700', change: '+47 this week' },
    { label: 'Level', value: level, icon: Zap, color: '#F59E0B', change: `${Math.round(getLevelProgress())}% to next` },
    { label: 'Streak', value: `${streak} days`, icon: Flame, color: '#FBBF24', change: 'Personal best: 21' },
    { label: 'Coins', value: coins, icon: Target, color: '#FFD700', change: '+15 earned today' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-aurum-text">Analytics</h1>
          <p className="text-xs text-aurum-muted">Your productivity insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#080808] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs text-aurum-muted">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-aurum-text">{stat.value}</div>
            <div className="text-[10px] text-aurum-muted mt-1">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Weekly Completions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#080808] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-aurum-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-aurum-gold" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.weeklyCompletions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#FFD700" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="created" fill="rgba(255,215,0,0.2)" radius={[4, 4, 0, 0]} name="Created" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Karma Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#080808] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-aurum-text mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-aurum-gold" />
            Karma Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.monthlyTrend}>
              <defs>
                <linearGradient id="karmaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="karma" stroke="#FFD700" fill="url(#karmaGradient)" strokeWidth={2} name="Karma" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Productivity by Hour */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#080808] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-aurum-text mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-aurum-gold" />
            Peak Hours
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData.productivityByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#52525B', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="tasks" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} name="Tasks" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#080808] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-aurum-text mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-aurum-gold" />
            Project Distribution
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={analyticsData.projectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analyticsData.projectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {analyticsData.projectDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-aurum-secondary">{item.name}</span>
                  <span className="text-xs text-aurum-muted ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#080808] border border-white/5 rounded-2xl p-4"
      >
        <h3 className="text-sm font-semibold text-aurum-text mb-3">Overall Completion Rate</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <motion.circle
                cx="40" cy="40" r="35"
                fill="none"
                stroke="#FFD700"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 35}
                initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 35 * (1 - completionRate / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-aurum-gold">{completionRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-aurum-text">{completedTasks} of {totalTasks} tasks completed</p>
            <p className="text-xs text-aurum-muted mt-1">Keep going! You're doing great.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
