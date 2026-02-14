
import React, { useState } from 'react';
import { BrainCircuit, Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    // Artificial delay for a premium feel
    setTimeout(() => {
      onLogin({
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@local.gyanguru`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse translate-x-1/2 translate-y-1/2" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-indigo-800 rounded-3xl mb-6 shadow-2xl ring-1 ring-white/10">
            <BrainCircuit size={54} className="text-indigo-300" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">GyanGuru</h1>
          <p className="text-indigo-200 font-medium">Your Personal ML Learning Companion</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-8 pb-12 rounded-[2.5rem] shadow-2xl border border-white/20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome</h2>
            <p className="text-slate-500 text-sm">How should we address you in your learning journey?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  required
                  autoFocus
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg font-medium text-black bg-slate-50/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 group active:scale-95"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Start Learning
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Saved locally for your convenience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
