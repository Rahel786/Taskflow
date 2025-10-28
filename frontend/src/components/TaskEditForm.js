import React, { useState } from 'react';

function TaskEditForm({ task, darkMode, onEdit }) {
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
  const now = new Date();
  // Convert to local ISO string (YYYY-MM-DDTHH:mm)
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`w-full px-2 py-1 rounded border ${
          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
        }`}
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className={`w-full px-2 py-1 rounded border ${
          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
        }`}
        min={today}
      />
      <button
        onClick={() => onEdit({ description, deadline: deadline ? new Date(deadline).toISOString() : null })}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm"
      >
        Save
      </button>
    </div>
  );
}
export default TaskEditForm;