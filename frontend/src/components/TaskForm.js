import React from 'react';

function TaskForm({ formData, setFormData, onSubmit, onCancel, darkMode }) {
  const now = new Date();
  // Convert to local ISO string (YYYY-MM-DDTHH:mm)
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Task description..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />

        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option>Personal</option>
          <option>Work</option>
          <option>Fitness</option>
        </select>

        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="low">🟩 Low Priority</option>
          <option value="medium">🟨 Medium Priority</option>
          <option value="high">🟥 High Priority</option>
        </select>

        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          min={today}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Create Task
        </button>

        <button
          onClick={onCancel}
          className={`flex-1 ${
            darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
          } py-2 rounded-lg font-semibold transition`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TaskForm;