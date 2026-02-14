
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Code, 
  Headphones, 
  Image as ImageIcon, 
  Settings, 
  Info, 
  Menu, 
  X,
  ChevronRight,
  BrainCircuit,
  History as HistoryIcon,
  LogOut
} from 'lucide-react';
import HomePage from './pages/HomePage';
import TextExplanationPage from './pages/TextExplanationPage';
import CodeGenerationPage from './pages/CodeGenerationPage';
import AudioLearningPage from './pages/AudioLearningPage';
import ImageVisualizationPage from './pages/ImageVisualizationPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage';
import { User, HistoryItem } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize for responsive state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user and history from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gyanguru_user');
    const savedHistory = localStorage.getItem('gyanguru_history');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('gyanguru_user', JSON.stringify(newUser));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gyanguru_user');
    navigate('/login');
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('gyanguru_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('gyanguru_history', JSON.stringify(updatedHistory));
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Text Explanation', path: '/text', icon: BookOpen },
    { label: 'Code Examples', path: '/code', icon: Code },
    { label: 'Audio Lessons', path: '/audio', icon: Headphones },
    { label: 'Visual Diagrams', path: '/image', icon: ImageIcon },
    { label: 'History', path: '/history', icon: HistoryIcon },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'About', path: '/about', icon: Info },
  ];

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-[70]' : 'relative'}
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
          bg-indigo-900 text-white transition-all duration-300 flex flex-col overflow-hidden
        `}
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          {(isSidebarOpen || !isMobile) && (
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-100 whitespace-nowrap overflow-hidden">
              <BrainCircuit className="text-indigo-400 shrink-0" />
              <span className={isSidebarOpen ? 'opacity-100' : 'opacity-0'}>GyanGuru</span>
            </div>
          )}
          {isMobile && isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-indigo-300">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-700 text-white shadow-lg' 
                    : 'text-indigo-200 hover:bg-indigo-800'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={24} className="shrink-0" />
                <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800 space-y-2 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 text-red-200 transition-colors whitespace-nowrap overflow-hidden"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`font-medium transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Logout</span>
          </button>
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-indigo-800 text-indigo-300"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-40 shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
              {navItems.find(n => n.path === location.pathname)?.label || 'Learning Hub'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden xs:block px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
              AI Connected
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border-l pl-3 sm:pl-4 ml-1 sm:ml-2">
              <span className="text-sm font-semibold text-slate-700 hidden md:block max-w-[120px] truncate">{user?.name}</span>
              <img 
                src={user?.avatar} 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-indigo-100 object-cover" 
                alt="User profile" 
              />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fdfdff] custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/text" element={<TextExplanationPage onSave={addToHistory} />} />
              <Route path="/code" element={<CodeGenerationPage onSave={addToHistory} />} />
              <Route path="/audio" element={<AudioLearningPage onSave={addToHistory} />} />
              <Route path="/image" element={<ImageVisualizationPage onSave={addToHistory} />} />
              <Route path="/history" element={<HistoryPage history={history} onDelete={deleteHistoryItem} />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            </Routes>
          </div>
        </div>
      </main>
      
      <style>{`
        .xs-hidden { display: none; }
        @media (min-width: 400px) { .xs-block { display: block; } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
