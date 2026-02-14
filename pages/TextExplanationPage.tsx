
import React, { useState } from 'react';
import { Search, Loader2, BookOpen, Copy, Download, Sparkles } from 'lucide-react';
import { generateTextExplanation } from '../geminiService';
import { ComplexityLevel, ModalityType } from '../types';

interface TextExplanationPageProps {
  onSave?: (item: any) => void;
}

const TextExplanationPage: React.FC<TextExplanationPageProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState<ComplexityLevel>(ComplexityLevel.DETAILED);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const result = await generateTextExplanation(topic, complexity);
      setContent(result || 'No content generated.');
      
      if (onSave && result) {
        onSave({
          type: ModalityType.TEXT,
          topic: topic,
          data: { content: result, complexity }
        });
      }
    } catch (error) {
      console.error(error);
      setContent('Error generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-indigo-600" />
          What would you like to learn today?
        </h2>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="e.g., neural networks, k-means clustering, backpropagation..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-700 font-medium">Complexity Level:</span>
            {Object.values(ComplexityLevel).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setComplexity(level)}
                className={`px-6 py-2 rounded-xl border transition-all ${
                  complexity === level 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
            <button 
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="ml-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate Explanation
            </button>
          </div>
        </form>
      </div>

      {content && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={18} />
              Educational Content
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-indigo-600"
                title="Copy content"
              >
                <Copy size={20} />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-indigo-600" title="Download as PDF">
                <Download size={20} />
              </button>
            </div>
          </div>
          <div className="p-8 prose prose-indigo max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-normal">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExplanationPage;
