
import React from 'react';
import { BrainCircuit, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <BrainCircuit size={64} className="mx-auto text-indigo-600 mb-4" />
        <h1 className="text-4xl font-black text-slate-900">About GyanGuru</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Empowering the next generation of AI practitioners through multi-modal, accessible, and personalized education.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Our Mission</h3>
          <p className="text-slate-600 leading-relaxed">
            Machine Learning can be daunting. Our goal is to democratize these complex concepts by providing instant, AI-driven content generation that adapts to different learning styles—be it visual, auditory, or hands-on coding.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Built with Gemini</h3>
          <p className="text-slate-600 leading-relaxed">
            Leveraging Google's state-of-the-art Gemini 3 and 2.5 series models, GyanGuru provides high-fidelity explanations, production-ready code implementation, and sophisticated visual diagrams.
          </p>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-12 rounded-[3rem] text-center space-y-8">
        <h2 className="text-3xl font-bold">Connect with the Community</h2>
        <p className="text-indigo-200 max-w-xl mx-auto">Join thousands of students and educators using GyanGuru to simplify their learning journey.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="p-4 bg-indigo-800 rounded-2xl hover:bg-indigo-700 transition-colors">
            <Github size={24} />
          </a>
          <a href="#" className="p-4 bg-indigo-800 rounded-2xl hover:bg-indigo-700 transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" className="p-4 bg-indigo-800 rounded-2xl hover:bg-indigo-700 transition-colors">
            <Linkedin size={24} />
          </a>
          <a href="#" className="p-4 bg-indigo-800 rounded-2xl hover:bg-indigo-700 transition-colors">
            <Mail size={24} />
          </a>
        </div>
      </div>

      <footer className="text-center text-slate-400 text-sm pb-8">
        <p>© 2025 GyanGuru Learning Assistant. Built with ❤️ for the AI community.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
