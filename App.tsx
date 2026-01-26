
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
  
  // Usuario persistente
  const [user] = useState<User>(() => {
    const savedId = localStorage.getItem('educapro_user_id') || 'u-' + Math.random().toString(36).substr(2, 9);
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
    const url = window.location.href;
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
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert("Error al copiar el enlace: " + url);
    }
  };

  const renderProgress = () => {
    const analytics: AnalyticsEvent[] = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    const completedCount = analytics.filter(a => a.userId === user.id && a.action === 'complete').length;
    
    // Calcular porcentaje total basado en todos los módulos de todos los cursos
    const totalModules = courses.reduce((acc, c) => acc + c.units.reduce((uAcc, u) => uAcc + u.modules.length, 0), 0);
    const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return (
      <div className="space-y-10 animate-fade-in">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="google-font text-4xl font-black text-gray-900">Tu Progreso Académico</h1>
            <p className="text-gray-500">Sigue tu ruta de aprendizaje y alcanza tus metas.</p>
          </div>
          <div className="hidden md:block bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
             <span className="text-blue-600 font-bold text-sm">Nivel: Aprendiz Digital</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#2563eb" strokeWidth="12" 
                    strokeDasharray={552} 
                    strokeDashoffset={552 - (552 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-5xl font-black text-blue-600">{progressPercent}%</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completado</span>
                </div>
             </div>
             <h3 className="font-black text-gray-900 text-2xl">Rendimiento General</h3>
             <p className="text-gray-400 mt-2 max-w-xs">Has completado {completedCount} de {totalModules} módulos totales disponibles.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                <i className="fas fa-rocket text-blue-400"></i> Próximos Pasos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <p className="text-sm">Finaliza la unidad de IA Ética</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                   <p className="text-sm">Realiza el test de Economía Digital</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100">
               <h3 className="font-bold text-blue-700 text-lg mb-2">Insignia de Participación</h3>
               <p className="text-blue-600/70 text-sm">Completa 5 módulos para desbloquear tu primer certificado modular.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
           <h3 className="font-black text-gray-900 text-xl mb-6">Bitácora de Actividad Reciente</h3>
           <div className="space-y-3">
             {analytics.filter(a => a.userId === user.id).reverse().slice(0, 5).map((a, i) => (
               <div key={i} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                     <i className={`fas ${a.action === 'complete' ? 'fa-check' : 'fa-eye'} text-xs`}></i>
                   </div>
                   <div>
                     <p className="font-bold text-gray-800 text-sm">{a.moduleTitle}</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase">{a.action} • {new Date(a.timestamp).toLocaleTimeString()}</p>
                   </div>
                 </div>
                 <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-tighter">Registrado</span>
               </div>
             ))}
             {analytics.length === 0 && <p className="text-center py-10 text-gray-400 italic">No hay actividad registrada aún.</p>}
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
      <div className="space-y-12 animate-fade-in">
        <section className="bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-400 rounded-[50px] p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 max-w-3xl">
              <span className="bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border border-white/20">Learning Management System 2025</span>
              <h1 className="google-font text-5xl lg:text-7xl font-black mb-8 leading-[1.1]">Evolución Educativa con Inteligencia Artificial.</h1>
              <p className="text-blue-50 text-xl mb-12 leading-relaxed opacity-90 font-medium">Gestiona cursos, analiza el impacto de aprendizaje y potencia la enseñanza con tutoría automatizada Gemini.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={copyAppUrl} className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black hover:bg-blue-50 transition shadow-2xl flex items-center gap-3 group">
                  <i className="fas fa-share-alt group-hover:rotate-12 transition-transform"></i> Compartir Link de Acceso
                </button>
                <button className="bg-blue-500/20 text-white px-10 py-5 rounded-2xl font-black border border-white/20 backdrop-blur-md hover:bg-blue-500/40 transition">
                  Manual de Usuario
                </button>
              </div>
           </div>
           <i className="fas fa-brain absolute -bottom-20 -right-20 text-[400px] text-white opacity-5 rotate-12"></i>
        </section>

        {showToast && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-[20px] shadow-2xl z-[100] flex items-center gap-4 animate-bounce border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs">
              <i className="fas fa-check"></i>
            </div>
            <span className="font-bold text-sm">¡Enlace copiado! Envíalo a tus estudiantes.</span>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
              <h2 className="google-font text-4xl font-black text-gray-900">Programas de Formación</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-100 rounded-[45px] overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                     <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{course.category}</span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="font-black text-gray-900 text-2xl mb-4 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">{course.description}</p>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="mt-auto w-full bg-slate-50 text-slate-900 py-5 rounded-[22px] font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                  >
                    Abrir Unidad Temática
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
