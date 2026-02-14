
import React from 'react';
import { Settings, Shield, Key, Bell, Globe, Moon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const sections = [
    { title: 'API Configuration', icon: Key, active: true },
    { title: 'Security', icon: Shield, active: false },
    { title: 'Notifications', icon: Bell, active: false },
    { title: 'Language', icon: Globe, active: false },
    { title: 'Appearance', icon: Moon, active: false },
  ];

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
      <aside className="space-y-2">
        {sections.map((s) => (
          <button 
            key={s.title}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              s.active ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <s.icon size={20} />
            <span>{s.title}</span>
          </button>
        ))}
      </aside>

      <div className="md:col-span-3 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">API Configuration</h2>
          <p className="text-slate-500">Your API keys are stored securely and never shared. All processing happens through the verified Google Cloud infrastructure.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Gemini API Key</label>
              <div className="relative">
                <input 
                  type="password" 
                  value="••••••••••••••••••••••••••••" 
                  readOnly 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 font-mono"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs uppercase tracking-wider">Update</button>
              </div>
              <p className="text-xs text-slate-400">Environment key detected. Using default configuration.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Model Selection</label>
              <select className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 appearance-none outline-none">
                <option>Gemini 3 Flash Preview (Balanced)</option>
                <option>Gemini 3 Pro Preview (Higher Reasoning)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-indigo-900">Premium Features Enabled</h3>
            <p className="text-indigo-700 text-sm">You have full access to audio generation and high-res diagram visualization.</p>
          </div>
          <Settings className="text-indigo-200 w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
