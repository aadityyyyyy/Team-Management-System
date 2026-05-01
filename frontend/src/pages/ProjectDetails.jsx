import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, ArrowLeft, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', dueDate: '', assignees: [] });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const promises = [
        api.get('/projects'),
        api.get('/tasks')
      ];
      if (user?.role === 'admin') promises.push(api.get('/auth/users'));
      
      const res = await Promise.all(promises);
      const projRes = res[0];
      const tasksRes = res[1];
      const usersRes = res[2];
      
      const currentProject = projRes.data.find(p => p.id === parseInt(id));
      if (!currentProject) {
        navigate('/projects');
        return;
      }
      setProject(currentProject);
      
      const projectTasks = tasksRes.data.filter(t => t.projectId === parseInt(id));
      setTasks(projectTasks);
      
      if (usersRes) {
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: parseInt(id) });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', status: 'pending', dueDate: '', assignees: [] });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleCloseProject = async () => {
    try {
      await api.put(`/projects/${id}`, { status: 'closed' });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error closing project', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse-slow flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 mt-4 font-medium">Loading project details...</p>
      </div>
    </div>
  );
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <button 
            onClick={() => navigate('/projects')} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm mb-6 bg-slate-50 px-3 py-1.5 rounded-lg w-fit"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          
          {user?.role === 'admin' && project.status !== 'closed' && (
            <button 
              onClick={handleCloseProject}
              className="bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors shadow-sm"
            >
              Close Project
            </button>
          )}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
            {project.status === 'closed' && (
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Closed</span>
            )}
          </div>
          <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">{project.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 mb-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText size={24} className="text-indigo-500" />
          Project Tasks
        </h2>
        {user?.role === 'admin' && project.status !== 'closed' && (
          <button 
            onClick={() => setShowTaskModal(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 font-medium"
          >
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Task Details</th>
                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Due Date</th>
                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Assignees</th>
                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                {user?.role === 'admin' && <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base mb-1">{task.title}</div>
                    <div className="text-slate-500 text-sm max-w-md truncate">{task.description}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm bg-slate-100 w-fit px-3 py-1.5 rounded-lg">
                      <Calendar size={14} className="text-slate-400" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                    </div>
                  </td>
                  <td className="p-5">
                    {task.assignees?.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {task.assignees.map(a => (
                          <div key={a.id} className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1.5 rounded-md w-fit flex items-center gap-2 shadow-sm">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white shadow-sm font-bold">{a.name.charAt(0).toUpperCase()}</span>
                            <span>{a.name}</span> 
                            <span className="text-indigo-400 opacity-90 border-l border-indigo-200 pl-2 ml-1">{a.department || 'No Dept'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic bg-slate-50 px-3 py-1 rounded-md">Unassigned</span>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="relative">
                      <select
                        className={`pl-4 pr-8 py-2 rounded-xl text-sm font-bold uppercase tracking-wide border-none focus:ring-4 outline-none appearance-none cursor-pointer ${
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
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {task.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Clock size={16} className={task.status === 'in-progress' ? 'text-amber-600' : 'text-slate-400'} />}
                      </div>
                    </div>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-semibold mb-1">No tasks yet</h3>
                    <p className="text-slate-500 text-sm">Add a task to get your team started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-800 to-slate-900"></div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                  rows="3"
                  placeholder="Add more details about this task..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Members (Max 2)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                  {users.length === 0 && <p className="text-sm text-slate-500 p-2">No team members available</p>}
                  {users.filter(u => u.role === 'member').map(u => (
                    <label key={u.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        checked={newTask.assignees.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (newTask.assignees.length >= 2) return alert('Maximum 2 members can be assigned.');
                            setNewTask({...newTask, assignees: [...newTask.assignees, u.id]});
                          } else {
                            setNewTask({...newTask, assignees: newTask.assignees.filter(id => id !== u.id)});
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{u.department || 'No Department'}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
