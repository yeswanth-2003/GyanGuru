
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Headphones, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const cards = [
    {
      title: 'Text Explanations',
      desc: 'Master complex concepts through AI-generated structured tutorials tailored to your level.',
      icon: BookOpen,
      path: '/text',
      color: 'bg-blue-50 text-blue-600',
      btnColor: 'bg-blue-600'
    },
    {
      title: 'Code Generation',
      desc: 'Get production-ready implementations of ML algorithms with step-by-step documentation.',
      icon: Code,
      path: '/code',
      color: 'bg-purple-50 text-purple-600',
      btnColor: 'bg-purple-600'
    },
    {
      title: 'Audio Lessons',
      desc: 'Learn on the go with conversational audio explanations generated from your chosen topics.',
      icon: Headphones,
      path: '/audio',
      color: 'bg-indigo-50 text-indigo-600',
      btnColor: 'bg-indigo-600'
    },
    {
      title: 'Visual Diagrams',
      desc: 'Visualize architectures, flowcharts, and concepts with high-quality AI-generated imagery.',
      icon: ImageIcon,
      path: '/image',
      color: 'bg-rose-50 text-rose-600',
      btnColor: 'bg-rose-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-semibold text-xs sm:text-sm">
          <Sparkles size={16} />
          <span>Next-Gen ML Learning Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Master AI & ML with <span className="text-indigo-600">GyanGuru</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
          Your personalized, AI-powered learning companion that adapts to your style. 
          Explaining complex concepts through multiple modalities.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${card.color} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform`}>
              <card.icon size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6 flex-1">{card.desc}</p>
            <Link 
              to={card.path} 
              className={`flex items-center justify-between w-full p-3 rounded-xl text-white ${card.btnColor} font-semibold group/btn text-sm sm:text-base`}
            >
              <span>Explore</span>
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </section>

      {/* Extra Info */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Tailored Learning</h4>
            <p className="text-xs sm:text-sm text-slate-600">AI adjusts complexity from brief summaries to comprehensive deep-dives.</p>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
            <Code size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Ready-to-Run Code</h4>
            <p className="text-xs sm:text-sm text-slate-600">Get dependencies and code snippets optimized for Google Colab and local environments.</p>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 sm:col-span-2 md:col-span-1">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <ImageIcon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Visual Reinforcement</h4>
            <p className="text-xs sm:text-sm text-slate-600">Deepen understanding with high-fidelity architecture diagrams generated on demand.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
