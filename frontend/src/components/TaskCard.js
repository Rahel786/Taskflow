import React from 'react';
import TaskEditForm from './TaskEditForm';
import TaskActions from './TaskActions';  

function TaskCard({ task, status, darkMode, onEdit, onDelete, onStatusChange, onPomodoro, pomodoroActive, pomodoroTime, isEditing }) {
  const getTimeLeft = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatPomodoroTime = `${Math.floor(pomodoroTime / 60)}:${String(pomodoroTime % 60).padStart(2, '0')}`;

  return (
    <div
      className={`p-4 rounded-lg shadow transition hover:shadow-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border-l-4'
      } ${
        task.priority === 'high' ? 'border-l-red-500' : 
        task.priority === 'medium' ? 'border-l-yellow-500' : 
        'border-l-green-500'
      }`}
    >
      {isEditing ? (
        <TaskEditForm task={task} darkMode={darkMode} onEdit={onEdit} />
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="font-semibold">{task.description}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded ${
                  task.category === 'Personal' ? 'bg-blue-100 text-blue-800' :
                  task.category === 'Work' ? 'bg-purple-100 text-purple-800' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {task.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>

          {task.deadline && (
            <div className={`text-xs mb-2 ${getTimeLeft(task.deadline) === 'Overdue' ? 'text-red-600 font-bold' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ⏱️ {getTimeLeft(task.deadline)}
            </div>
          )}

          {pomodoroActive === task.id && (
            <div className={`text-sm font-bold mb-2 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-center`}>
              🏆 {formatPomodoroTime}
            </div>
          )}

          <TaskActions 
            task={task}
            status={status}
            darkMode={darkMode}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onPomodoro={onPomodoro}
            pomodoroActive={pomodoroActive}
          />
        </>
      )}
    </div>
  );
}

export default TaskCard;