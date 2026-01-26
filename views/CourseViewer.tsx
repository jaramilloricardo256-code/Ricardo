
import React, { useState, useEffect } from 'react';
import { Course, Module, AnalyticsEvent, StudentProfile } from '../types';
import AITutor from '../components/AITutor';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  user: { id: string, name: string };
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack, user }) => {
  const [activeModule, setActiveModule] = useState<Module>(course.units[0].modules[0]);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [showSurvey, setShowSurvey] = useState<'initial' | 'final' | null>(null);
  const [quizSelection, setQuizSelection] = useState<Record<string, number>>({});
  
  const [profileForm, setProfileForm] = useState({ 
    name: localStorage.getItem('user_real_name') || '', 
    age: '', 
    career: '', 
    expectations: '' 
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (!savedProfile) {
      setShowSurvey('initial');
    } else {
      const parsed = JSON.parse(savedProfile);
      setProfileForm(prev => ({ ...prev, name: parsed.name, career: parsed.career, age: parsed.age }));
    }
    
    const savedProgress = localStorage.getItem(`progress_${user.id}_${course.id}`);
    if (savedProgress) {
      setCompletedModules(new Set(JSON.parse(savedProgress)));
    }

    logEvent('view', activeModule.id, activeModule.title);
  }, [activeModule.id]);

  const logEvent = (action: AnalyticsEvent['action'], moduleId: string, moduleTitle: string, value?: any) => {
    const event: AnalyticsEvent = {
      userId: user.id,
      userName: profileForm.name || "Estudiante",
      courseId: course.id,
      courseTitle: course.title,
      moduleId,
      moduleTitle,
      action,
      value: value || "",
      timestamp: Date.now()
    };
    const events = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    events.push(event);
    localStorage.setItem('educapro_analytics', JSON.stringify(events));
    // Notificar a otras pestañas o componentes
    window.dispatchEvent(new Event('storage'));
  };

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
    setQuizSelection({}); // Reset quiz view when changing
  };

  const markCompleted = () => {
    const next = new Set(completedModules);
    next.add(activeModule.id);
    setCompletedModules(next);
    localStorage.setItem(`progress_${user.id}_${course.id}`, JSON.stringify(Array.from(next)));
    
    logEvent('complete', activeModule.id, activeModule.title, "Módulo finalizado");

    // Lógica para saltar al siguiente módulo automáticamente
    const allModules = course.units.flatMap(u => u.modules);
    const currentIndex = allModules.findIndex(m => m.id === activeModule.id);
    if (currentIndex < allModules.length - 1) {
      setActiveModule(allModules[currentIndex + 1]);
    } else {
      setShowSurvey('final');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: StudentProfile = {
      userId: user.id,
      name: profileForm.name,
      age: profileForm.age,
      career: profileForm.career,
      registrationDate: Date.now()
    };
    
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
    localStorage.setItem('user_real_name', profileForm.name);
    
    const allProfiles = JSON.parse(localStorage.getItem('educapro_profiles') || '[]');
    const filteredProfiles = allProfiles.filter((p: any) => p.userId !== user.id);
    filteredProfiles.push(profile);
    localStorage.setItem('educapro_profiles', JSON.stringify(filteredProfiles));

    logEvent('registration', 'profile', 'datos_sociodemograficos', `Expectativas: ${profileForm.expectations}`);
    setShowSurvey(null);
  };

  const handleQuizSelect = (questionId: string, optionIdx: number, optionLabel: string) => {
    setQuizSelection(prev => ({ ...prev, [questionId]: optionIdx }));
    logEvent('quiz_score', questionId, activeModule.title, `Respuesta: ${optionLabel}`);
  };

  if (showSurvey === 'initial') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-lg w-full border border-blue-50 animate-fade-in">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
            <i className="fas fa-user-edit"></i>
          </div>
          <h2 className="google-font text-3xl font-black text-gray-900 mb-2">Perfil de Estudiante</h2>
          <p className="text-gray-500 mb-8 font-medium">Ayúdanos a personalizar tu ruta de aprendizaje completando estos datos obligatorios.</p>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Nombre Completo</label>
              <input required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Ej: Dr. Manuel Belgrano" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Edad</label>
                <input required type="number" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Carrera</label>
                <input required value={profileForm.career} onChange={e => setProfileForm({...profileForm, career: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Ingeniería..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">¿Qué esperas de este curso?</label>
              <textarea required value={profileForm.expectations} onChange={e => setProfileForm({...profileForm, expectations: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" rows={3} placeholder="Describe tus metas personales..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100">
              Comenzar Mi Aprendizaje
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-fade-in">
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 sticky top-24">
          <button onClick={onBack} className="text-gray-400 hover:text-blue-600 text-sm font-bold mb-8 flex items-center gap-3 transition">
            <i className="fas fa-arrow-left"></i> Volver a Programas
          </button>
          <div className="mb-8">
             <h2 className="google-font text-2xl font-black text-gray-900 leading-tight mb-2">{course.title}</h2>
             <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${Math.round((completedModules.size / course.units.flatMap(u => u.modules).length) * 100)}%` }}
                ></div>
             </div>
          </div>
          <div className="space-y-8">
            {course.units.map((unit) => (
              <div key={unit.id}>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> {unit.title}
                </h3>
                <div className="space-y-2">
                  {unit.modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => handleModuleClick(mod)}
                      className={`w-full text-left px-4 py-4 rounded-[18px] text-sm transition-all duration-300 flex items-center gap-4 ${
                        activeModule.id === mod.id 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold scale-[1.02]' 
                        : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas ${completedModules.has(mod.id) ? 'fa-check-circle' : 'fa-circle-notch'} text-xs ${activeModule.id === mod.id ? 'text-white' : 'text-blue-600'}`}></i>
                      <span className="truncate flex-1">{mod.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm min-h-full flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 inline-block mb-3">Lección Interactiva</span>
              <h1 className="google-font text-4xl font-black text-gray-900">{activeModule.title}</h1>
            </div>
            {completedModules.has(activeModule.id) && (
               <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold border border-emerald-100">
                  <i className="fas fa-award"></i> Completado
               </div>
            )}
          </div>

          <div className="flex-1">
            {activeModule.type === 'text' && <div className="prose prose-blue max-w-none"><p className="text-gray-600 leading-relaxed text-xl font-medium">{activeModule.content}</p></div>}
            
            {activeModule.type === 'video' && (
              <div className="aspect-video w-full rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 border-8 border-white">
                <iframe className="w-full h-full" src={activeModule.videoUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            )}

            {activeModule.type === 'document' && (
              <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 text-3xl shadow-sm mb-6">
                    <i className="fas fa-file-pdf"></i>
                 </div>
                 <h3 className="font-black text-blue-900 text-xl mb-2">Recurso de Lectura</h3>
                 <p className="text-blue-700/70 mb-8 max-w-sm">Este módulo requiere la lectura del siguiente documento adjunto.</p>
                 <a href={activeModule.fileUrl} target="_blank" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">Descargar PDF</a>
              </div>
            )}

            {activeModule.type === 'quiz' && (
              <div className="space-y-10 max-w-3xl">
                {activeModule.questions?.map((q) => (
                  <div key={q.id} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                    <div className="flex gap-4 mb-6">
                       <span className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black shadow-sm flex-shrink-0">?</span>
                       <p className="font-black text-gray-900 text-2xl leading-tight">{q.question}</p>
                    </div>
                    <div className="grid gap-4">
                      {q.options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleQuizSelect(q.id, idx, opt)}
                          className={`w-full text-left p-5 rounded-[22px] border-2 transition-all flex items-center gap-5 ${
                            quizSelection[q.id] === idx 
                            ? 'border-blue-600 bg-blue-600 text-white shadow-2xl scale-[1.01]' 
                            : 'border-white bg-white hover:border-blue-100 text-gray-600 shadow-sm'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${quizSelection[q.id] === idx ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-bold flex-1">{opt}</span>
                          {quizSelection[q.id] === idx && <i className="fas fa-check-circle"></i>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
             <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tu Estado</span>
                <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${completedModules.has(activeModule.id) ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
                   <span className="text-sm font-black text-gray-700">{completedModules.has(activeModule.id) ? '¡Excelente! Has finalizado.' : 'Continúa con el contenido...'}</span>
                </div>
             </div>
             <button onClick={markCompleted} className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-[22px] font-black hover:bg-blue-600 transition-all shadow-2xl hover:scale-[1.02] active:scale-95">
               {completedModules.has(activeModule.id) ? 'Siguiente Lección' : 'Completar y Seguir'}
             </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 flex-shrink-0">
        <AITutor courseTitle={course.title} />
      </div>
    </div>
  );
};

export default CourseViewer;
