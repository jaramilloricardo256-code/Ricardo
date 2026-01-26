
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
      userName: profileForm.name || "Estudiante Anónimo",
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
    // Disparar evento personalizado para que otras pestañas (como progreso) se enteren
    window.dispatchEvent(new Event('storage'));
  };

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
  };

  const markCompleted = () => {
    const next = new Set(completedModules);
    next.add(activeModule.id);
    setCompletedModules(next);
    localStorage.setItem(`progress_${user.id}_${course.id}`, JSON.stringify(Array.from(next)));
    
    // Guardar también en analíticas para el profesor
    logEvent('complete', activeModule.id, activeModule.title, "Completado");

    const allModules = course.units.flatMap(u => u.modules);
    if (next.size === allModules.length) {
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
    // Evitar duplicados
    const filteredProfiles = allProfiles.filter((p: any) => p.userId !== user.id);
    filteredProfiles.push(profile);
    localStorage.setItem('educapro_profiles', JSON.stringify(filteredProfiles));

    // Capturar el texto manual de expectativas como un evento de feedback
    logEvent('registration', 'profile', 'expectativas_iniciales', profileForm.expectations);
    setShowSurvey(null);
  };

  const handleQuizSelect = (questionId: string, optionIdx: number, optionLabel: string) => {
    setQuizSelection(prev => ({ ...prev, [questionId]: optionIdx }));
    logEvent('quiz_score', questionId, activeModule.title, `Opción seleccionada: ${optionLabel}`);
  };

  if (showSurvey === 'initial') {
    return (
      <div className="flex items-center justify-center p-4 min-h-[600px] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-blue-50">
          <h2 className="google-font text-2xl font-bold text-gray-900 mb-2">Bienvenido a EducaPro</h2>
          <p className="text-gray-500 mb-6 text-sm">Completa tu perfil sociodemográfico para comenzar.</p>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
              <input required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 outline-none transition" placeholder="Tu nombre..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Edad</label>
                <input required type="number" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 outline-none" placeholder="00" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Carrera</label>
                <input required value={profileForm.career} onChange={e => setProfileForm({...profileForm, career: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 outline-none" placeholder="Carrera..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">¿Qué esperas aprender? (Texto Manual)</label>
              <textarea required value={profileForm.expectations} onChange={e => setProfileForm({...profileForm, expectations: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 outline-none" rows={3} placeholder="Describe tus objetivos..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Registrar y Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="w-full lg:w-72 flex-shrink-0 border-r border-gray-100 pr-6">
        <button onClick={onBack} className="text-blue-600 text-sm font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-chevron-left"></i> Volver a Cursos
        </button>
        <h2 className="google-font text-xl font-bold text-gray-900 mb-6">{course.title}</h2>
        <div className="space-y-6">
          {course.units.map((unit) => (
            <div key={unit.id}>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">{unit.title}</h3>
              <div className="space-y-1">
                {unit.modules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 ${
                      activeModule.id === mod.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${completedModules.has(mod.id) ? 'fa-check-circle' : 'fa-circle-notch'} text-xs`}></i>
                    <span className="truncate">{mod.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h1 className="google-font text-3xl font-black text-gray-900">{activeModule.title}</h1>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">{activeModule.type}</span>
          </div>

          <div className="flex-1">
            {activeModule.type === 'text' && <p className="text-gray-700 leading-relaxed text-lg">{activeModule.content}</p>}
            
            {activeModule.type === 'video' && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe className="w-full h-full" src={activeModule.videoUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            )}

            {activeModule.type === 'quiz' && (
              <div className="space-y-8 max-w-2xl mx-auto">
                {activeModule.questions?.map((q) => (
                  <div key={q.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="font-bold text-gray-900 mb-4 text-xl">{q.question}</p>
                    <div className="grid gap-3">
                      {q.options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleQuizSelect(q.id, idx, opt)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-bold ${
                            quizSelection[q.id] === idx ? 'border-blue-600 bg-blue-600 text-white shadow-xl translate-x-1' : 'border-white bg-white hover:border-blue-100 text-gray-600'
                          }`}
                        >
                          <span className={`inline-block w-8 h-8 rounded-lg border mr-3 text-center leading-8 text-xs ${quizSelection[q.id] === idx ? 'bg-white/20 border-white' : 'bg-gray-50 border-gray-200'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${completedModules.has(activeModule.id) ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>
                <span className="text-sm font-bold text-gray-500">{completedModules.has(activeModule.id) ? 'Módulo Completado' : 'Pendiente por revisar'}</span>
             </div>
             <button onClick={markCompleted} className="w-full sm:w-auto bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-xl shadow-slate-100">
               {completedModules.has(activeModule.id) ? 'Siguiente Lección' : 'Marcar como Finalizado'}
             </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
        <AITutor courseTitle={course.title} />
      </div>
    </div>
  );
};

export default CourseViewer;
