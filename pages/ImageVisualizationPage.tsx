
import React, { useState } from 'react';
import { ImageIcon, Loader2, Sparkles, Download, Maximize2, Layers } from 'lucide-react';
import { generateVisualDiagrams } from '../geminiService';
import { ModalityType } from '../types';

interface ImageVisualizationPageProps {
  onSave?: (item: any) => void;
}

const ImageVisualizationPage: React.FC<ImageVisualizationPageProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ prompts: string[], imageUrls: string[] } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const data = await generateVisualDiagrams(topic);
      setResult(data);

      if (onSave && data) {
        onSave({
          type: ModalityType.IMAGE,
          topic: topic,
          data: { prompts: data.prompts, imageUrlCount: data.imageUrls.length }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Layers size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visual Learning</h2>
            <p className="text-slate-500">Generate architectural diagrams and flowcharts for ML concepts.</p>
          </div>
        </div>
        
        <form onSubmit={handleGenerate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="e.g., CNN architecture, Transformer attention mechanism..."
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all disabled:opacity-50 shadow-lg shadow-rose-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            Visualize
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="grid md:grid-cols-3 gap-6">
            {result.imageUrls.map((url, i) => (
              <div key={i} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={url} alt={`Diagram ${i+1}`} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
                    <Maximize2 size={20} />
                  </button>
                  <a href={url} download={`diagram-${i+1}.png`} className="p-3 bg-white text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
                    <Download size={20} />
                  </a>
                </div>
                <div className="p-4 bg-white">
                   <p className="text-sm text-slate-600 line-clamp-2">{result.prompts[i]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Technical Breakdown</h3>
             <div className="space-y-6">
               {result.prompts.map((p, i) => (
                 <div key={i} className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                     {i+1}
                   </div>
                   <div className="pt-1">
                     <p className="text-slate-700 font-medium">{p}</p>
                     <p className="text-sm text-slate-500 mt-1">Diagram represents a core facet of the {topic} learning path.</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {!result && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
          <ImageIcon size={64} className="opacity-20" />
          <p>Enter a topic to generate visual reinforcements</p>
        </div>
      )}
    </div>
  );
};

export default ImageVisualizationPage;
