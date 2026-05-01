import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Users, FolderKanban, Calendar, ChevronRight } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
      setError(error.response?.data?.error || 'Failed to create project. Please try again.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Projects</h1>
          <p className="text-slate-500 font-medium">Manage your team's initiatives and workflows.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 font-medium"
          >
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="group block bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden relative">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0"></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FolderKanban size={24} />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                {project.status === 'closed' && (
                  <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ml-2 flex-shrink-0">Closed</span>
                )}
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">{project.description || 'No description provided.'}</p>
              
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <Users size={14} className="text-indigo-500" /> 
                  {project.members?.length || 0} members
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Projects Found</h3>
            <p className="text-slate-500 mb-6">Get started by creating a new project for your team.</p>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-medium inline-flex items-center gap-2"
              >
                <Plus size={18} /> Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in-up flex items-center gap-2">
                  <span className="flex-1 font-medium">{error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g., Q3 Marketing Campaign"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                  rows="4"
                  placeholder="What is this project about?"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
