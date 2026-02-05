
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, setRole, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <span className="google-font text-2xl font-bold text-gray-800">Educa<span className="text-blue-600">Pro</span></span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
                <button
                  onClick={() => setRole('student')}
                  className={`px-4 py-1 rounded-full text-xs font-black transition ${role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  ESTUDIANTE
                </button>
                <button
                  onClick={() => setRole('teacher')}
                  className={`px-4 py-1 rounded-full text-xs font-black transition ${role === 'teacher' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  PROFESOR
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <nav className="space-y-1">
            <NavItem 
              icon="fa-house" 
              label="Inicio" 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <NavItem 
              icon="fa-book-open" 
              label="Asignaturas" 
              active={activeTab === 'courses'} 
              onClick={() => setActiveTab('courses')} 
            />
            {role === 'student' && (
              <NavItem 
                icon="fa-chart-line" 
                label="Mi Progreso" 
                active={activeTab === 'progress'} 
                onClick={() => setActiveTab('progress')} 
              />
            )}
            {role === 'teacher' && (
              <NavItem 
                icon="fa-chalkboard-user" 
                label="Gestión Docente" 
                active={activeTab === 'instructor'} 
                onClick={() => setActiveTab('instructor')} 
              />
            )}
          </nav>
          
          <div className="mt-10 p-6 bg-slate-900 rounded-[30px] text-white">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Autoría</p>
            <p className="text-xs font-bold leading-tight italic">Diseñado por:</p>
            <p className="text-sm font-black text-white mt-1">Ricardo Hinestroza</p>
            <div className="mt-4 pt-4 border-t border-white/10">
               <p className="text-[8px] text-slate-400 uppercase">En colaboración con Gemini AI</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Creador Ricardo Hinestroza &copy; {new Date().getFullYear()} - Plataforma EducaPro
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold rounded-2xl transition ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-500 hover:bg-gray-50'
    }`}
  >
    <i className={`fas ${icon} w-5`}></i>
    {label}
  </button>
);

export default Layout;
