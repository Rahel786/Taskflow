import TaskCard from './TaskCard'; 

function TaskColumn({ title, icon, tasks, status, darkMode, onEdit, onDelete, onStatusChange, onPomodoro, pomodoroActive, pomodoroTime, editingId }) {
  return (
    <div>
      <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
        status === 'todo' ? 'text-blue-600' : status === 'in-progress' ? 'text-yellow-600' : 'text-green-600'
      }`}>
        {icon} {title} ({tasks.length})
      </h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            status={status}
            darkMode={darkMode}
            onEdit={(updates) => {
              if (typeof updates === 'object') {
                onEdit(task.id, updates);
              } else {
                onEdit(updates);
              }
            }}
            onDelete={() => onDelete(task.id)}
            onStatusChange={() => {
              const newStatus = status === 'todo' ? 'in-progress' : 'done';
              onStatusChange(task.id, newStatus);
            }}
            onPomodoro={onPomodoro}
            pomodoroActive={pomodoroActive}
            pomodoroTime={pomodoroTime}
            isEditing={editingId === task.id}
          />
        ))}

        {tasks.length === 0 && (
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskColumn;