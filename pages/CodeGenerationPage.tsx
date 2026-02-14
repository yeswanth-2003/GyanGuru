
import React, { useState } from 'react';
import { Code, Loader2, Sparkles, Copy, Terminal, ChevronRight, CheckCircle2 } from 'lucide-react';
import { generateCodeImplementation } from '../geminiService';
import { ComplexityLevel, ModalityType } from '../types';

interface CodeGenerationPageProps {
  onSave?: (item: any) => void;
}

const CodeGenerationPage: React.FC<CodeGenerationPageProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState<ComplexityLevel>(ComplexityLevel.DETAILED);
  const [result, setResult] = useState<{ code: string; dependencies: string[]; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const data = await generateCodeImplementation(topic, complexity);
      setResult(data);

      if (onSave && data) {
        onSave({
          type: ModalityType.CODE,
          topic: topic,
          data: { ...data, complexity }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
            <Code size={28} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ML Implementation</h2>
            <p className="text-xs sm:text-sm text-slate-500">Get documented Python code for your projects.</p>
          </div>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Algorithm or Topic</label>
            <input 
              type="text" 
              placeholder="e.g., Random Forest, LSTM..."
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-base sm:text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {Object.values(ComplexityLevel).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setComplexity(level)}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg transition-all font-medium text-xs sm:text-sm ${
                    complexity === level 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <button 
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-100"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono flex items-center gap-2 ml-2 truncate">
                    <Terminal size={14} />
                    main.py
                  </span>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(result.code)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <Copy size={20} />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto custom-scrollbar">
                <pre className="text-purple-300 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  <code>{result.code}</code>
                </pre>
              </div>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Implementation Notes</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                {result.explanation}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                Dependencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.dependencies.length > 0 ? (
                  result.dependencies.map((dep, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-medium rounded-lg">
                      {dep}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs italic">Standard libraries only</span>
                )}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-[10px] sm:text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Quick Install:</p>
                <div className="bg-slate-50 p-3 rounded-xl font-mono text-[10px] sm:text-xs text-indigo-600 break-all select-all">
                  pip install {result.dependencies.join(' ')}
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg shadow-indigo-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-bold mb-2 text-base sm:text-lg">Run in Cloud</h3>
                <p className="text-indigo-100 text-xs sm:text-sm mb-4">Instantly execute this code in a cloud-hosted Jupyter notebook.</p>
                <button className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors w-full justify-center sm:w-auto">
                  Open Notebook
                  <ChevronRight size={16} />
                </button>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 text-indigo-500 opacity-20 w-32 h-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGenerationPage;
