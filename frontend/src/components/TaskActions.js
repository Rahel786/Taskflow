import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

function TaskActions({ task, status, darkMode, onEdit, onDelete, onStatusChange, onPomodoro, pomodoroActive }) {
  if (status === 'done') {
    return (
      <div className="flex gap-2 flex-wrap mt-3 text-xs">
        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition flex-1"
        >
          <Trash2 size={14} className="inline mr-1" /> Delete
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap mt-3 text-xs">
      <button
        onClick={() => onStatusChange()}
        className={`px-2 py-1 rounded transition ${
          status === 'todo' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {status === 'todo' ? 'Start' : 'Complete'}
      </button>
      {pomodoroActive === task.id ? (
        <button
          onClick={() => onPomodoro(null)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          Stop 🏆
        </button>
      ) : (
        <button
          onClick={() => onPomodoro(task.id)}
          className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded transition"
        >
          Focus 🏆
        </button>
      )}
      <button
        onClick={() => onEdit(task.id)}
        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
      >
        <Edit2 size={14} className="inline" />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
      >
        <Trash2 size={14} className="inline" />
      </button>
    </div>
  );
}

export default TaskActions;