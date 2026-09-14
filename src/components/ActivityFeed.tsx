import { motion } from 'framer-motion';
import { useActivityStore } from '../stores';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

export default function ActivityFeed() {
  const { activities } = useActivityStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#080808] border border-white/5 rounded-2xl p-4"
    >
      <h3 className="text-sm font-semibold text-aurum-text mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-aurum-gold" />
        Recent Activity
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {activities.slice(0, 10).map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-2.5 py-1.5"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-sm flex-shrink-0"
            >
              {activity.avatar}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-aurum-secondary">
                <span className="text-aurum-text font-medium">{activity.userName}</span>
                {' '}{activity.action}{' '}
                {activity.taskTitle && (
                  <span className="text-aurum-gold/80">{activity.taskTitle}</span>
                )}
              </p>
              <p className="text-[10px] text-aurum-muted mt-0.5">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
