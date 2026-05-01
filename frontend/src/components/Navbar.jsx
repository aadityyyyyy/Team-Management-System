import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
            placeholder="Search tasks, projects..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="w-px h-8 bg-slate-200"></div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
