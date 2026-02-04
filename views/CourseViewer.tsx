
import React, { useState, useEffect } from 'react';
import { Course, Module, AnalyticsEvent, StudentProfile } from '../types';
import AITutor from '../components/AITutor';
import { saveToGoogleSheets } from '../services/googleSheetService';

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
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
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

  const logEvent = async (action: AnalyticsEvent['action'], moduleId: string, moduleTitle: string, value?: any) => {
    const savedProfileStr = localStorage.getItem(`profile_${user.id}`);
    const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
    
    const studentName = savedProfile?.name || profileForm.name || "ID Pendiente";
    const studentCareer = savedProfile?.career || profileForm.career || "N/A";
    const studentAge = savedProfile?.age || profileForm.age || "N/A";

    const event: AnalyticsEvent = {
      userId: user.id,
      userName: studentName,
      courseId: course.id,
      courseTitle: course.title,
      moduleId,
      moduleTitle,
      action,
      value: value || "",
      timestamp: Date.now(),
      career: studentCareer,
      age: studentAge
    };
    
    const events = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    events.push(event);
    localStorage.setItem('educapro_analytics', JSON.stringify(events));
    
    await saveToGoogleSheets(event);
    window.dispatchEvent(new Event('storage'));
  };

  const markCompleted = () => {
    const next = new Set(completedModules);
    next.add(activeModule.id);
    setCompletedModules(next);
    localStorage.setItem(`progress_${user.id}_${course.id}`, JSON.stringify(Array.from(next)));
    
    logEvent('complete', activeModule.id, activeModule.title, "Finalizado");

    const allModules = course.units.flatMap(u => u.modules);
    const currentIndex = allModules.findIndex(m => m.id === activeModule.id);
    if (currentIndex < allModules.length - 1) {
      setActiveModule(allModules[currentIndex + 1]);
      setActiveCard(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSurvey('final');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
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

    setShowSurvey(null);
    await logEvent('registration', 'perfil', 'registro_completo', profileForm.expectations);
  };

  const handleQuizSelect = (questionId: string, optionIdx: number, optionLabel: string) => {
    setQuizSelection(prev => ({ ...prev, [questionId]: optionIdx }));
    logEvent('quiz_score', questionId, activeModule.title, `Respuesta: ${optionLabel}`);
  };

  if (showSurvey === 'initial') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-white p-8 lg:p-12 rounded-[50px] shadow-2xl max-w-lg w-full border border-blue-50 animate-fade-in">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-[22px] flex items-center justify-center mb-8 text-2xl shadow-xl shadow-blue-100">
            <i className="fas fa-id-card"></i>
          </div>
          <h2 className="google-font text-3xl font-black text-gray-900 mb-2 tracking-tight">Registro de Alumno</h2>
          <p className="text-gray-500 mb-8 font-medium">Ingrese su identificación numérica para el seguimiento docente.</p>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número de Identificación</label>
              <input 
                required 
                type="number"
                value={profileForm.name} 
                onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold text-gray-700" 
                placeholder="Ej: 109823456" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Edad</label>
                <input required type="number" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Carrera</label>
                <input required value={profileForm.career} onChange={e => setProfileForm({...profileForm, career: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              Entrar al Aula
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-fade-in">
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-[35px] border border-gray-100 p-6 sticky top-24 shadow-sm">
          <button onClick={onBack} className="text-gray-400 hover:text-blue-600 text-[10px] font-black mb-10 flex items-center gap-3 transition uppercase tracking-widest">
            <i className="fas fa-chevron-left"></i> Catálogo
          </button>
          <div className="mb-10">
             <h2 className="google-font text-2xl font-black text-gray-900 leading-tight mb-4">{course.title}</h2>
             <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${(completedModules.size / course.units.flatMap(u => u.modules).length) * 100}%` }}
                ></div>
             </div>
          </div>
          <div className="space-y-8">
            {course.units.map((unit) => (
              <div key={unit.id}>
                <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">{unit.title}</h3>
                <div className="space-y-1.5">
                  {unit.modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModule(mod)}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs transition-all flex items-center gap-4 ${
                        activeModule.id === mod.id ? 'bg-blue-600 text-white shadow-lg font-bold' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas ${completedModules.has(mod.id) ? 'fa-check-circle' : 'fa-circle-notch'}`}></i>
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
        <div className="bg-white rounded-[50px] border border-gray-100 p-8 lg:p-14 shadow-sm min-h-full flex flex-col">
          <div className="mb-14">
             <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">{activeModule.type}</span>
                <span className="text-[9px] text-gray-400 font-bold"><i className="fas fa-cloud text-blue-400 mr-2"></i>Sincronizado con Sheets</span>
             </div>
             <h1 className="google-font text-5xl font-black text-gray-900 tracking-tighter leading-none">{activeModule.title}</h1>
          </div>

          <div className="flex-1 mb-14">
            {activeModule.type === 'text' && <p className="text-gray-600 text-2xl font-medium leading-relaxed">{activeModule.content}</p>}
            
            {activeModule.type === 'interactive' && (
              <div className="space-y-12">
                <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl group-hover:bg-blue-600/40 transition duration-700"></div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Misión Operativa</p>
                   <h2 className="text-3xl font-black italic tracking-tighter mb-4 leading-none">Intervención de Red</h2>
                   <p className="text-slate-400 font-medium text-lg leading-relaxed">Selecciona los nodos de la cadena para desplegar el diagnóstico y la táctica correctiva recomendada.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeModule.interactiveData?.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                      <button 
                        onClick={() => {
                          setActiveCard(activeCard === idx ? null : idx);
                          logEvent('interactive_click', activeModule.id, activeModule.title, `Exploró: ${item.title}`);
                        }}
                        className={`w-full p-8 rounded-[40px] font-black text-xl transition-all flex flex-col items-start gap-4 border-2 ${
                          activeCard === idx ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-[1.02]' : 'bg-white text-slate-800 border-slate-50 hover:border-blue-100 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${activeCard === idx ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                           <i className={`fas ${activeCard === idx ? 'fa-minus' : 'fa-plus'}`}></i>
                        </div>
                        <span className="text-left leading-tight">{item.title}</span>
                      </button>
                      {activeCard === idx && (
                        <div className="p-10 bg-slate-50 rounded-[45px] border-2 border-blue-50 text-slate-700 leading-relaxed font-medium animate-fade-in text-lg italic shadow-inner">
                           <div className="h-2 w-12 bg-blue-600 rounded-full mb-6"></div>
                           {item.body.split('\n').map((line, i) => (
                             <p key={i} className={i === 0 ? "mb-4" : "mt-2"}>{line}</p>
                           ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModule.type === 'video' && (
              <div className="space-y-8">
                <div className="aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border-8 border-slate-50">
                  <iframe 
                    className="w-full h-full" 
                    src={activeModule.videoUrl} 
                    title="YouTube video player"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-slate-500 font-medium italic text-center px-10">{activeModule.content}</p>
              </div>
            )}
            
            {activeModule.type === 'document' && (
              <div className="bg-blue-50/30 p-14 rounded-[50px] border border-blue-100 flex flex-col items-center text-center">
                 <i className="fas fa-file-pdf text-blue-600 text-5xl mb-6"></i>
                 <h3 className="font-black text-gray-900 text-2xl mb-10">Material de Lectura</h3>
                 <a href={activeModule.fileUrl} target="_blank" className="bg-blue-600 text-white px-12 py-5 rounded-[22px] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Descargar PDF</a>
              </div>
            )}
            
            {activeModule.type === 'quiz' && (
              <div className="space-y-8">
                {activeModule.questions?.map((q) => (
                  <div key={q.id} className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100">
                    <p className="font-black text-gray-900 text-2xl mb-8">{q.question}</p>
                    <div className="grid gap-4">
                      {q.options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleQuizSelect(q.id, idx, opt)}
                          className={`w-full text-left p-6 rounded-[25px] border-2 transition-all font-bold ${
                            quizSelection[q.id] === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-white bg-white text-gray-600 hover:border-blue-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-10 border-t border-gray-50 flex justify-end">
             <button onClick={markCompleted} className="bg-slate-900 text-white px-16 py-6 rounded-[28px] font-black hover:bg-blue-600 transition-all flex items-center gap-4 shadow-xl active:scale-95">
               {completedModules.has(activeModule.id) ? 'Siguiente Lección' : 'Completar Lección'}
               <i className="fas fa-arrow-right"></i>
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
