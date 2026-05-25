import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    // Load initial state from local storage
    const savedTasks = localStorage.getItem('ai_planner_tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      return [
        { id: '1', text: 'Review Calculus Chapter 4', completed: false },
        { id: '2', text: 'Draft Physics Lab Report', completed: true },
      ];
    }
  });
  
  const [newTask, setNewTask] = useState('');

  // Save to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('ai_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2">Task Manager</h2>
          <p className="text-slate-400 text-lg">Manage your assignments and track your daily progress.</p>
        </div>
        
        {/* Progress Mini-Stat */}
        <div className="glass-panel px-6 py-3 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-400 font-medium">Completion</span>
            <span className="text-xl font-bold text-emerald-400">{progressPercentage}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 relative flex items-center justify-center">
            {/* SVG Circle for circular progress */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
              <circle 
                cx="20" cy="20" r="20" 
                fill="none" stroke="currentColor" strokeWidth="4" 
                className="text-emerald-500 transition-all duration-1000"
                style={{ strokeDasharray: 125, strokeDashoffset: 125 - (125 * progressPercentage / 100) }}
                transform="translate(4,4)"
              />
            </svg>
            <span className="text-xs font-bold text-white">{completedCount}/{totalCount}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="relative z-10 flex gap-3 mb-8">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What do you need to study today?" 
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-lg"
            />
            <button 
              type="submit"
              className="btn-primary flex items-center justify-center px-8 text-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            >
              Add Task
            </button>
          </form>

          {/* Task List */}
          <div className="relative z-10 flex flex-col gap-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
                <p className="text-slate-400 text-lg">No tasks yet. Add one above!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`
                    group flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                    ${task.completed 
                      ? 'bg-slate-800/30 border-slate-700/30 opacity-70' 
                      : 'bg-slate-800/60 border-slate-700 hover:border-teal-500/50 hover:bg-slate-800/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTaskCompletion(task.id)}>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${task.completed ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-500 group-hover:border-teal-400'}
                    `}>
                      {task.completed && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      )}
                    </div>
                    <span className={`text-lg transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.text}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete Task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
