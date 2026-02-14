
import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Calendar, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  Code,
  BookOpen,
  Headphones,
  Layers
} from 'lucide-react';
import { HistoryItem, ModalityType } from '../types';

interface HistoryPageProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ModalityType | 'All'>('All');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: ModalityType) => {
    switch (type) {
      case ModalityType.TEXT: return <BookOpen size={18} className="text-blue-500" />;
      case ModalityType.CODE: return <Code size={18} className="text-purple-500" />;
      case ModalityType.AUDIO: return <Headphones size={18} className="text-indigo-500" />;
      case ModalityType.IMAGE: return <Layers size={18} className="text-rose-500" />;
    }
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(ts);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Learning History</h2>
            <p className="text-xs sm:text-sm text-slate-500">Review your past explorations.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide">
             {['All', ...Object.values(ModalityType)].map((type) => (
               <button
                 key={type}
                 onClick={() => setFilterType(type as any)}
                 className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                   filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm sm:text-base group-hover:text-indigo-600 transition-colors">{item.topic}</h3>
                  <div className="flex items-center gap-3 sm:gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
                      <Calendar size={12} />
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full xs:w-auto justify-end xs:opacity-0 xs:group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <ExternalLink size={18} />
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <div className="hidden sm:block ml-2 pl-2 border-l border-slate-100">
                   <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-dashed border-slate-200 px-6">
          <HistoryIcon size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No history items found</p>
          <p className="text-slate-400 text-sm">Start exploring topics to build your learning log.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
