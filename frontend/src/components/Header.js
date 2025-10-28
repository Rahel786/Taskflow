import React from 'react';
import { Moon, Sun } from 'lucide-react';

function Header({ darkMode, setDarkMode, category, setCategory }) {
  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-md'} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Title and Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">🚀 Task Tracker</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage tasks • Track progress • Stay productive
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'Personal', 'Work', 'Fitness'].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                category === c
                  ? darkMode ? 'bg-pink-600 text-white' : 'bg-pink-600 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {c === 'all' ? '🏷️ All Categories' : c === 'Personal' ? '👤 Personal' : c === 'Work' ? '💼 Work' : '🏃 Fitness'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;