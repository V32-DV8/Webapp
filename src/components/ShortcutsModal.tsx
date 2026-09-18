import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../stores';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useUIStore();

  const shortcuts = [
    { keys: ['Q'], action: 'Quick add task' },
    { keys: ['Esc'], action: 'Close modal / Cancel' },
    { keys: ['⌘', 'K'], action: 'Search tasks' },
    { keys: ['G', 'I'], action: 'Go to Inbox' },
    { keys: ['G', 'T'], action: 'Go to Today' },
    { keys: ['G', 'U'], action: 'Go to Upcoming' },
    { keys: ['G', 'B'], action: 'Go to Board view' },
    { keys: ['G', 'C'], action: 'Go to Calendar' },
    { keys: ['G', 'H'], action: 'Go to Habits' },
    { keys: ['G', 'A'], action: 'Go to Analytics' },
    { keys: ['G', 'F'], action: 'Go to Focus Timer' },
    { keys: ['?'], action: 'Show keyboard shortcuts' },
  ];

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={() => setShortcutsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl z-[70] shadow-[0_0_60px_rgba(255,215,0,0.1)]"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-aurum-gold" />
                  <h3 className="text-lg font-semibold text-aurum-text">Keyboard Shortcuts</h3>
                </div>
                <button onClick={() => setShortcutsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg">
                  <X className="w-4 h-4 text-aurum-muted" />
                </button>
              </div>

              <div className="space-y-1">
                {shortcuts.map((shortcut, i) => (
                  <motion.div
                    key={shortcut.action}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-sm text-aurum-secondary">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-aurum-text font-mono">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && <span className="text-aurum-muted text-xs mx-0.5">+</span>}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
