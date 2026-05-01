import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen fixed shadow-2xl border-r border-slate-800 z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Briefcase size={22} className="text-white" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          TeamTask
        </span>
      </div>
      
      <div className="px-8 mb-4 text-xs font-semibold text-slate-500 tracking-wider uppercase">Menu</div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-indigo-600/15 text-indigo-400 shadow-inner' : 'hover:bg-slate-800/50 hover:text-white'}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-indigo-600/15 text-indigo-400 shadow-inner' : 'hover:bg-slate-800/50 hover:text-white'}`}
        >
          <FolderKanban size={20} />
          Projects
        </NavLink>
      </nav>
      
      <div className="p-6">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-inner shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-white text-sm truncate">{user?.name}</div>
            <div className="text-xs text-indigo-300 font-medium capitalize mt-0.5">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
