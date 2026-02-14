
import React, { useState, useRef } from 'react';
import { Headphones, Loader2, Sparkles, Play, Pause, RotateCcw, Volume2, Mic, FileText } from 'lucide-react';
import { generateAudioLesson, decodeBase64Audio, decodeAudioData } from '../geminiService';
import { ModalityType } from '../types';

interface AudioLearningPageProps {
  onSave?: (item: any) => void;
}

const AudioLearningPage: React.FC<AudioLearningPageProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<{ script: string, audioUrl: string | null } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const { script, base64Audio } = await generateAudioLesson(topic);
      
      let audioUrl = null;
      if (base64Audio) {
        audioUrl = `data:audio/wav;base64,${base64Audio}`; 
      }

      setAudioData({ script, audioUrl });

      if (onSave && script) {
        onSave({
          type: ModalityType.AUDIO,
          topic: topic,
          data: { script }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playRawAudio = async () => {
    if (!audioData?.audioUrl) return;
    
    const base64 = audioData.audioUrl.split(',')[1];
    const bytes = decodeBase64Audio(base64);
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = await decodeAudioData(bytes, ctx);
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    source.onended = () => setIsPlaying(false);
    
    setIsPlaying(true);
    source.start(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Headphones size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Audio Lessons</h2>
              <p className="text-slate-500">Generate on-the-go conversational tutorials.</p>
            </div>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="What topic would you like to hear about?"
                className="w-full px-6 py-5 pr-36 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg bg-white/80"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>

      {audioData && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Audio Player UI */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col items-center text-center shadow-lg shadow-indigo-50">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 relative">
              <div className={`absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 ${isPlaying ? 'animate-spin' : ''}`} />
              <Volume2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{topic}</h3>
            <p className="text-slate-500 mb-8">AI-Generated Conversational Lesson</p>
            
            <div className="flex items-center gap-6">
              <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                <RotateCcw size={24} />
              </button>
              <button 
                onClick={playRawAudio}
                className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 scale-110 active:scale-95"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors rotate-180">
                <RotateCcw size={24} />
              </button>
            </div>
            
            <div className="w-full mt-10 space-y-4">
               <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full bg-indigo-600 transition-all duration-300 ${isPlaying ? 'w-1/2' : 'w-0'}`} />
               </div>
               <div className="flex justify-between text-xs font-mono text-slate-400">
                 <span>0:00</span>
                 <span>Demo Duration</span>
               </div>
            </div>
          </div>

          {/* Transcript UI */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-indigo-500" />
                Audio Script
              </h3>
              <button 
                onClick={() => navigator.clipboard.writeText(audioData.script)}
                className="text-sm text-indigo-600 font-semibold hover:underline"
              >
                Copy Text
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px] pr-4 space-y-4">
              {audioData.script.split('\n').map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed text-sm">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioLearningPage;
