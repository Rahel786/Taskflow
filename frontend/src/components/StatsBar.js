import React from 'react';

function StatsBar({ stats, darkMode }) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs">Total Tasks</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-yellow-100'}`}>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <div className="text-xs">In Progress</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
            <div className="text-2xl font-bold">{stats.done}</div>
            <div className="text-xs">Completed</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
            <div className="text-2xl font-bold">{Math.round((stats.done / (stats.total || 1)) * 100)}%</div>
            <div className="text-xs">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StatsBar;
