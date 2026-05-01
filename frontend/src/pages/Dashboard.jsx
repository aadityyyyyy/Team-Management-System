import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, LayoutList, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      const data = res.data;
      setTasks(data);
      
      const now = new Date();
      
      setStats({
        total: data.length,
        completed: data.filter(t => t.status === 'completed').length,
        pending: data.filter(t => t.status !== 'completed').length,
        overdue: data.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed').length
      });
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgClass} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass} shadow-sm`}>
        <Icon size={26} />
      </div>
      <div>
        <div className="text-sm text-slate-500 font-semibold mb-1">{title}</div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.total} icon={LayoutList} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="In Progress" value={stats.pending} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-50" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} colorClass="text-rose-600" bgClass="bg-rose-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  task.status === 'in-progress' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                  'bg-slate-300'
                }`}></div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Project: {task.project?.name}</p>
                </div>
              </div>
              <div>
                <div className="relative">
                  <select
                    className={`pl-4 pr-8 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-none focus:ring-4 outline-none appearance-none cursor-pointer ${
                      task.status === 'completed' ? 'bg-emerald-100/50 text-emerald-700 focus:ring-emerald-500/20' :
                      task.status === 'in-progress' ? 'bg-amber-100/50 text-amber-700 focus:ring-amber-500/20' :
                      'bg-slate-100 text-slate-600 focus:ring-slate-500/20'
                    }`}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {task.status === 'completed' ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Clock size={12} className={task.status === 'in-progress' ? 'text-amber-600' : 'text-slate-400'} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutList size={24} className="text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-semibold mb-1">No tasks yet</h3>
              <p className="text-slate-500 text-sm">When you create tasks, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
