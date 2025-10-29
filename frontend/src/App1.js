import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';

import TaskAPI from './api';
import { Plus } from 'lucide-react';


export default function App1() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pomodoroActive, setPomodoroActive] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [formData, setFormData] = useState({
    description: '',
    category: 'Personal',
    priority: 'medium',
    deadline: ''
  });

  // Pomodoro timer
  useEffect(() => {
    let interval;
    if (pomodoroActive !== null && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0 && pomodoroActive !== null) {
      alert('🏆 Pomodoro session complete!');
      setPomodoroActive(null);
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  // Countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => ({ ...t, refresh: !t.refresh })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await TaskAPI.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      alert('Failed to load tasks. Please check if the server is running.');
    }
  };

  const addTask = async () => {
    if (formData.description.trim()) {
      try {
        const newTask = {
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          deadline: formData.deadline || null,
          status: 'todo'
        };
        const created = await TaskAPI.create(newTask);
        setTasks([...tasks, created]);
        setFormData({ description: '', category: 'Personal', priority: 'medium', deadline: '' });
        setShowForm(false);
      } catch (err) {
        console.error('Failed to add task:', err);
        alert('Failed to add task. Please try again.');
      }
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updated = await TaskAPI.update(id, updates);
      setTasks(tasks.map(t => t.id === id ? updated : t));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await TaskAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const changeTaskStatus = async (id, newStatus) => {
    try {
      const updated = await TaskAPI.updateStatus(id, newStatus);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Failed to update task status:', err);
      alert('Failed to update task status. Please try again.');
    }
  };

  const getStats = () => {
    const done = tasks.filter(t => t.status === 'done').length;
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    return { done, total, inProgress };
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done')
  };

  const stats = getStats();

  const renderAllColumns = (catFilter) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaskColumn
        title="To Do"
        icon="📝"
        tasks={tasksByStatus.todo.filter(t => t.category === catFilter)}
        status="todo"
        darkMode={darkMode}
        onEdit={(id, updates) => typeof updates === 'object' ? updateTask(id, updates) : setEditingId(id)}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onPomodoro={setPomodoroActive}
        pomodoroActive={pomodoroActive}
        pomodoroTime={pomodoroTime}
        editingId={editingId}
      />
      <TaskColumn
        title="In Progress"
        icon="⚙️"
        tasks={tasksByStatus['in-progress'].filter(t => t.category === catFilter)}
        status="in-progress"
        darkMode={darkMode}
        onEdit={(id, updates) => typeof updates === 'object' ? updateTask(id, updates) : setEditingId(id)}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onPomodoro={setPomodoroActive}
        pomodoroActive={pomodoroActive}
        pomodoroTime={pomodoroTime}
        editingId={editingId}
      />
      <TaskColumn
        title="Done"
        icon="✅"
        tasks={tasksByStatus.done.filter(t => t.category === catFilter)}
        status="done"
        darkMode={darkMode}
        onEdit={(id, updates) => typeof updates === 'object' ? updateTask(id, updates) : setEditingId(id)}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onPomodoro={setPomodoroActive}
        pomodoroActive={pomodoroActive}
        pomodoroTime={pomodoroTime}
        editingId={editingId}
      />
    </div>
  );

  const renderSingleColumn = (catFilter, statusFilter) => (
    <div className="w-full">
      <TaskColumn
        title={statusFilter === 'todo' ? 'To Do' : statusFilter === 'in-progress' ? 'In Progress' : 'Done'}
        icon={statusFilter === 'todo' ? '📝' : statusFilter === 'in-progress' ? '⚙️' : '✅'}
        tasks={tasksByStatus[statusFilter].filter(t => t.category === catFilter)}
        status={statusFilter}
        darkMode={darkMode}
        onEdit={(id, updates) => typeof updates === 'object' ? updateTask(id, updates) : setEditingId(id)}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onPomodoro={setPomodoroActive}
        pomodoroActive={pomodoroActive}
        pomodoroTime={pomodoroTime}
        editingId={editingId}
      />
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} category={category} setCategory={setCategory} />
      <StatsBar stats={stats} darkMode={darkMode} />
      <FilterBar filter={filter} setFilter={setFilter} darkMode={darkMode} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full mb-6 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105 ${
            darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Plus size={20} /> Add New Task
        </button>

        {showForm && (
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={addTask}
            onCancel={() => setShowForm(false)}
            darkMode={darkMode}
          />
        )}

        {/* STATUS FILTER: Show categories with only that status when specific status is selected */}
        {filter !== 'all' ? (
          <div>
            <h3 className="text-2xl font-bold mb-8">
              {filter === 'todo' ? '📝 To Do Tasks' : filter === 'in-progress' ? '⚙️ In Progress Tasks' : '✅ Completed Tasks'}
            </h3>
            {category === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Personal', 'Work', 'Fitness'].map(cat => (
                  <div key={cat} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                    <h4 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                      cat === 'Personal' ? 'text-blue-600' : cat === 'Work' ? 'text-purple-600' : 'text-pink-600'
                    }`}>
                      {cat === 'Personal' ? '👤 Personal' : cat === 'Work' ? '💼 Work' : '🏃 Fitness'}
                    </h4>
                    <div className="space-y-3">
                      {tasksByStatus[filter]
                        .filter(t => t.category === cat)
                        .map(task => (
                          <div
                            key={task.id}
                            className={`p-4 rounded-lg ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-50 border-l-4'
                            } ${
                              task.priority === 'high' ? 'border-l-red-500' : 
                              task.priority === 'medium' ? 'border-l-yellow-500' : 
                              'border-l-green-500'
                            }`}
                          >
                            <p className="font-semibold">{task.description}</p>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Priority: {task.priority}
                            </p>
                          </div>
                        ))}
                      {tasksByStatus[filter].filter(t => t.category === cat).length === 0 && (
                        <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No tasks
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              renderSingleColumn(category, filter)
            )}
          </div>
        ) : (
          /* CATEGORY VIEW: Show all three columns for each category */
          category === 'all' ? (
            <div className="space-y-12">
              {['Personal', 'Work', 'Fitness'].map(cat => (
                <div key={cat}>
                  <h3 className={`text-2xl font-bold mb-6 ${
                    cat === 'Personal' ? 'text-blue-600' : cat === 'Work' ? 'text-purple-600' : 'text-pink-600'
                  }`}>
                    {cat === 'Personal' ? '👤 Personal Tasks' : cat === 'Work' ? '💼 Work Tasks' : '🏃 Fitness Tasks'}
                  </h3>
                  {renderAllColumns(cat)}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${
                category === 'Personal' ? 'text-blue-600' : category === 'Work' ? 'text-purple-600' : 'text-pink-600'
              }`}>
                {category === 'Personal' ? '👤 Personal Tasks' : category === 'Work' ? '💼 Work Tasks' : '🏃 Fitness Tasks'}
              </h3>
              {renderAllColumns(category)}
            </div>
          )
        )}
      </div>
    </div>
  );
}