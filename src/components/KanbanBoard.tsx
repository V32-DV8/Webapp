import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useUIStore } from '../stores';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCorners, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Flag, Plus, GripVertical } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { useState } from 'react';
import type { Task } from '../data/mockData';

const columns = [
  { id: 'todo', title: 'To Do', color: '#3B82F6', emoji: '📋' },
  { id: 'doing', title: 'In Progress', color: '#F59E0B', emoji: '⚡' },
  { id: 'done', title: 'Done', color: '#FFD700', emoji: '✅' },
];

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = task.dueDate ? (() => {
    const d = parseISO(task.dueDate);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d');
  })() : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#0A0A0A] border border-white/5 rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-[0_0_20px_rgba(255,215,0,0.2)] scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 p-0.5 text-aurum-muted hover:text-aurum-secondary">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${task.completed ? 'line-through text-aurum-muted' : 'text-aurum-text'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-aurum-muted">
                <Calendar className="w-2.5 h-2.5" />
                {dueDate}
              </span>
            )}
            <span className={`w-2 h-2 rounded-full ${
              task.priority === 1 ? 'bg-priority-1' :
              task.priority === 2 ? 'bg-priority-2' :
              task.priority === 3 ? 'bg-priority-3' : 'bg-priority-4'
            }`} />
            {task.labels.slice(0, 1).map(l => (
              <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-aurum-muted">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Column({ column, tasks }: { column: typeof columns[0]; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-lg">{column.emoji}</span>
        <h3 className="text-sm font-semibold text-aurum-text">{column.title}</h3>
        <span className="text-xs text-aurum-muted bg-white/5 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="min-h-[200px] bg-white/[0.02] border border-white/5 rounded-xl p-2"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-aurum-muted/50 text-xs">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { tasks, reorderTasks, updateTask } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const nonSubtasks = tasks.filter(t => !t.parentId);
  const todoTasks = nonSubtasks.filter(t => t.status === 'todo');
  const doingTasks = nonSubtasks.filter(t => t.status === 'doing');
  const doneTasks = nonSubtasks.filter(t => t.status === 'done');

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine target column
    let targetStatus: Task['status'] = 'todo';
    if (['todo', 'doing', 'done'].includes(overId)) {
      targetStatus = overId as Task['status'];
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    updateTask(taskId, { status: targetStatus });
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-aurum-text">Board</h1>
          <p className="text-xs text-aurum-muted">Drag tasks between columns</p>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Column column={columns[0]} tasks={todoTasks} />
          <Column column={columns[1]} tasks={doingTasks} />
          <Column column={columns[2]} tasks={doneTasks} />
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-[#0A0A0A] border border-aurum-gold/30 rounded-xl p-3 shadow-[0_0_30px_rgba(255,215,0,0.2)] w-[280px] rotate-2">
              <p className="text-sm text-aurum-text">{activeTask.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  activeTask.priority === 1 ? 'bg-priority-1' :
                  activeTask.priority === 2 ? 'bg-priority-2' :
                  activeTask.priority === 3 ? 'bg-priority-3' : 'bg-priority-4'
                }`} />
                <span className="text-[10px] text-aurum-muted">P{activeTask.priority}</span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}
