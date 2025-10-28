import React from 'react';

function FilterBar({ filter, setFilter, darkMode }) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1">
            {['all', 'todo', 'in-progress', 'done'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filter === s
                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
                }`}
              >
                {s === 'all' ? '📋 All' : s === 'todo' ? '📝 To Do' : s === 'in-progress' ? '⚙️ In Progress' : '✅ Done'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;