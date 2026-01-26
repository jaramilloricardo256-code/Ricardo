
import React, { useState, useEffect } from 'react';
import { UserRole, Course, User, AnalyticsEvent } from './types';
import { INITIAL_COURSES } from './constants';
import Layout from './components/Layout';
import CourseViewer from './views/CourseViewer';
import TeacherDashboard from './views/TeacherDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState('home');
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Usuario persistente único por navegador
  const [user] = useState<User>(() => {
    const savedId = localStorage.getItem('educapro_user_id') || 'u-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('educapro_user_id', savedId);
    return {
      id: savedId,
      name: localStorage.getItem('user_real_name') || 'Estudiante',
      email: '',
      role: 'student',
      enrolledCourses: []
    };
  });

  const copyAppUrl = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      alert("Enlace: " + url);
    }
  };

  const renderProgress = () => {
    const analytics: AnalyticsEvent[] = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    const completedCount = analytics.filter(a => a.userId === user.id && a.action === 'complete').length;
    
    // Total de módulos en todos los cursos disponibles
    const totalModules = courses.reduce((acc, c) => acc + c.units.reduce((uAcc, u) => uAcc + u.modules.length, 0), 0);
    const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return (
      <div className="space-y-12 animate-fade-in">
        <div className="flex justify-between items-end border-b border-gray-100 pb-10">
          <div>
            <h1 className="google-font text-5xl font-black text-gray-900 tracking-tight">Tu Ecosistema de Aprendizaje</h1>
            <p className="text-gray-500 text-lg font-medium mt-3">Visualiza tus logros y planifica tus siguientes pasos.</p>
          </div>
          <div className="hidden lg:flex flex-col items-end">
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Rango Actual</span>
             <span className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-sm shadow-xl shadow-blue-100">Explorer Digital I</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-2xl transition-all duration-500">
             <div className="relative w-64 h-64 flex items-center justify-center mb-10 group-hover:scale-105 transition-transform duration-500">
                <svg className="w-full h-full -rotate-90 drop-shadow-2xl">
                  <circle cx="128" cy="128" r="115" fill="none" stroke="#f8fafc" strokeWidth="20" />
                  <circle cx="128" cy="128" r="115" fill="none" stroke="#2563eb" strokeWidth="20" 
                    strokeDasharray={722} 
                    strokeDashoffset={722 - (722 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-[1.5s] ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-6xl font-black text-blue-600">{progressPercent}%</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Global</span>
                </div>
             </div>
             <h3 className="font-black text-gray-900 text-3xl mb-3">Progreso del Programa</h3>
             <p className="text-gray-400 font-medium max-w-xs leading-relaxed">Has completado satisfactoriamente <span className="text-blue-600 font-bold">{completedCount} módulos</span> de {totalModules} disponibles.</p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden group">
              <i className="fas fa-bolt absolute -top-10 -right-10 text-[150px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000"></i>
              <h3 className="font-black text-2xl mb-8 flex items-center gap-4 relative z-10">
                <i className="fas fa-bullseye text-blue-400"></i> Objetivos del Mes
              </h3>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-5 bg-white/5 p-5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-xs font-black">01</div>
                   <p className="text-sm font-medium">Finalizar Unidad 1 de Inteligencia Artificial</p>
                </div>
                <div className="flex items-center gap-5 bg-white/5 p-5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xs font-black">02</div>
                   <p className="text-sm font-medium">Obtener badge en "Ética en la Computación"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-10 rounded-[50px] border border-blue-100 group">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:rotate-12 transition-transform">
                     <i className="fas fa-award text-xl"></i>
                  </div>
                  <h3 className="font-black text-blue-900 text-xl leading-none">Certificación Modular</h3>
               </div>
               <p className="text-blue-700/60 text-sm leading-relaxed font-medium">Mantén una participación constante para desbloquear tus certificados avalados por la plataforma al finalizar cada curso.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-gray-900 text-2xl">Historial de Aprendizaje</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">Últimos 5 Movimientos</span>
           </div>
           <div className="space-y-4">
             {analytics.filter(a => a.userId === user.id).reverse().slice(0, 5).map((a, i) => (
               <div key={i} className="flex justify-between items-center p-6 bg-gray-50/50 rounded-[28px] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                 <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg ${a.action === 'complete' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'}`}>
                     <i className={`fas ${a.action === 'complete' ? 'fa-check' : 'fa-eye'}`}></i>
                   </div>
                   <div>
                     <p className="font-black text-gray-900 text-base">{a.moduleTitle}</p>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{a.action} • {new Date(a.timestamp).toLocaleTimeString()}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-tighter">Registrado</span>
                    <i className="fas fa-chevron-right text-gray-300 text-[10px]"></i>
                 </div>
               </div>
             ))}
             {analytics.length === 0 && (
               <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl mb-4"><i className="fas fa-ghost"></i></div>
                  <p className="text-gray-400 font-bold italic">No hay actividad registrada aún en este dispositivo.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedCourse) return <CourseViewer course={selectedCourse} onBack={() => setSelectedCourse(null)} user={user} />;
    if (activeTab === 'progress') return renderProgress();
    if (role === 'teacher' && (activeTab === 'instructor' || activeTab === 'data')) return <TeacherDashboard courses={courses} />;

    return (
      <div className="space-y-16 animate-fade-in">
        <section className="bg-gradient-to-br from-indigo-700 via-blue-600 to-sky-500 rounded-[60px] p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl border-b-[12px] border-blue-800/20">
           <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                 <span className="bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-white/20">Next-Gen LMS 2025</span>
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h1 className="google-font text-6xl lg:text-8xl font-black mb-10 leading-[0.95] tracking-tighter">Evoluciona tu manera de aprender.</h1>
              <p className="text-blue-50 text-2xl mb-14 leading-relaxed opacity-90 font-medium max-w-2xl">Plataforma educativa modular con tutoría IA integrada para una experiencia académica personalizada y dinámica.</p>
              <div className="flex flex-wrap gap-6">
                <button onClick={copyAppUrl} className="bg-white text-blue-700 px-12 py-6 rounded-[28px] font-black hover:bg-blue-50 transition shadow-2xl flex items-center gap-4 group hover:scale-[1.05] active:scale-95">
                  <i className="fas fa-share-nodes group-hover:rotate-12 transition-transform text-lg"></i> Enviar Link de Estudiante
                </button>
                <button className="bg-blue-900/20 text-white px-12 py-6 rounded-[28px] font-black border border-white/20 backdrop-blur-md hover:bg-blue-900/40 transition">
                  Explorar Versión 2.0
                </button>
              </div>
           </div>
           <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]"></div>
           <i className="fas fa-meteor absolute top-10 right-20 text-[200px] text-white opacity-5 -rotate-12"></i>
        </section>

        {showToast && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-[30px] shadow-2xl z-[100] flex items-center gap-5 animate-bounce border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <i className="fas fa-check"></i>
            </div>
            <span className="font-black text-sm tracking-tight italic">¡Enlace copiado! Envíalo ahora por WhatsApp o Correo.</span>
          </div>
        )}

        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="flex items-center gap-5">
              <div className="h-12 w-2.5 bg-blue-600 rounded-full"></div>
              <h2 className="google-font text-5xl font-black text-gray-900 tracking-tight">Programas Destacados</h2>
            </div>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Mostrando {courses.length} Especializaciones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-100 rounded-[55px] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 group flex flex-col hover:-translate-y-4">
                <div className="relative h-72 overflow-hidden">
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[2.5s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-10">
                     <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">{course.category}</span>
                  </div>
                </div>
                <div className="p-12 flex-1 flex flex-col">
                  <h3 className="font-black text-gray-900 text-3xl mb-5 group-hover:text-blue-600 transition-colors leading-tight">{course.title}</h3>
                  <p className="text-gray-400 text-base mb-10 leading-relaxed font-medium line-clamp-2">{course.description}</p>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="mt-auto w-full bg-slate-50 text-slate-900 py-6 rounded-[28px] font-black group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-blue-200 transition-all duration-500"
                  >
                    Ingresar al Programa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <Layout 
      role={role} 
      setRole={setRole} 
      activeTab={activeTab} 
      setActiveTab={(t) => { setActiveTab(t); setSelectedCourse(null); }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
