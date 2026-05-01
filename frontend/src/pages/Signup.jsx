import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, Shield, ArrowRight, Briefcase } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password, role, department);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 p-4 sm:p-8">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-5xl w-full flex flex-col md:flex-row-reverse bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-white relative z-10 animate-fade-in-up">
        
        {/* Right Side: Branding */}
        <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-purple-900/30 blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Join Us</h1>
            <p className="text-indigo-100 text-lg font-medium">Start organizing your life today.</p>
          </div>
          
          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm">✨</div>
                <div>
                  <h3 className="font-semibold text-white">Powerful Features</h3>
                  <p className="text-indigo-100 text-sm mt-1">Everything you need to manage your team.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm">🚀</div>
                <div>
                  <h3 className="font-semibold text-white">Lightning Fast</h3>
                  <p className="text-indigo-100 text-sm mt-1">Built with modern tech for instant responses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-12 flex flex-col justify-center bg-white/50">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-6">Fill in your details to get started.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in-up flex items-center gap-2">
                  <span className="flex-1 font-medium">{error}</span>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Shield size={18} />
                  </div>
                  <select
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value === 'admin') setDepartment('');
                    }}
                  >
                    <option value="member">Team Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {role === 'member' && (
                <div className="space-y-1.5 animate-fade-in-up">
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <select
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Department</option>
                      <option value="Frontend">Frontend Development</option>
                      <option value="Backend">Backend Development</option>
                      <option value="Database">Database Management</option>
                      <option value="Testing">QA & Testing</option>
                      <option value="Design">UI/UX Design</option>
                      <option value="HR">Human Resources</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 group mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
