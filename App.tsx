
import React, { useState, useEffect } from 'react';
import { UserRole, Course, User } from './types';
import { INITIAL_COURSES } from './constants';
import Layout from './components/Layout';
import CourseViewer from './views/CourseViewer';
import TeacherDashboard from './views/TeacherDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('educapro_last_role') as UserRole) || 'student');
  const [activeTab, setActiveTab] = useState('home');
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('educapro_custom_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => localStorage.getItem('educapro_custom_url') || '');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [shareableAppUrl] = useState(() => window.location.origin + window.location.pathname);

  useEffect(() => {
    localStorage.setItem('educapro_last_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('educapro_custom_courses', JSON.stringify(courses));
  }, [courses]);

  const handleUrlChange = (newUrl: string) => {
    const trimmed = newUrl.trim();
    setGoogleScriptUrl(trimmed);
    localStorage.setItem('educapro_custom_url', trimmed);
  };

  const [user] = useState<User>(() => {
    const savedId = localStorage.getItem('educapro_user_id') || 'u-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('educapro_user_id', savedId);
    return {
      id: savedId,
      name: localStorage.getItem('user_real_name') || 'ID Alumno',
      email: '',
      role: 'student',
      enrolledCourses: []
    };
  });

  const copyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareableAppUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert("Link: " + shareableAppUrl);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (selectedCourse) return <CourseViewer course={selectedCourse} onBack={() => setSelectedCourse(null)} user={user} />;
    
    if (role === 'teacher' && activeTab === 'instructor') {
      return (
        <TeacherDashboard 
          courses={courses} 
          onCourseUpdate={setCourses}
          appUrl={googleScriptUrl}
          onUrlChange={handleUrlChange}
        />
      );
    }

    return (
      <div className="space-y-16 animate-fade-in">
        <section className="bg-slate-900 rounded-[60px] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-600/20 blur-[150px] rounded-full"></div>
           <div className="relative z-10 max-w-4xl">
              <span className="bg-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 inline-block shadow-lg">Gestión Académica Profesional</span>
              <h1 className="google-font text-6xl lg:text-8xl font-black mb-10 leading-[0.85] tracking-tighter italic">EducaPro: Aula Híbrida.</h1>
              <p className="text-slate-400 text-xl mb-14 leading-relaxed font-medium max-w-2xl">Diseña asignaturas, distribuye contenido y controla el rendimiento académico en entornos con o sin conexión.</p>
              
              <div className="flex flex-wrap gap-5">
                <button onClick={copyAppUrl} className="bg-white text-slate-900 px-10 py-5 rounded-[22px] font-black hover:bg-blue-50 transition shadow-2xl active:scale-95 flex items-center gap-3">
                  <i className="fas fa-link text-blue-600"></i> Copiar Acceso Maestro
                </button>
              </div>
           </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="flex items-center gap-5">
              <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
              <h2 className="google-font text-4xl font-black text-slate-900 tracking-tighter">Catálogo de Asignaturas</h2>
            </div>
            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                placeholder="Buscar asignatura o área..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white border border-slate-100 rounded-[50px] overflow-hidden hover:shadow-2xl transition-all p-8 group flex flex-col border-b-8 hover:border-b-blue-600">
                <div className="relative overflow-hidden rounded-[35px] mb-8 shadow-sm">
                  <img src={course.image} className="h-56 w-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase text-blue-600 shadow-md">{course.category}</span>
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-3 tracking-tight">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-8 line-clamp-2 flex-grow font-medium leading-relaxed">{course.description}</p>
                <button onClick={() => setSelectedCourse(course)} className="w-full bg-slate-50 text-slate-900 py-5 rounded-[25px] font-black hover:bg-slate-900 hover:text-white transition shadow-sm flex items-center justify-center gap-3">
                  <i className="fas fa-door-open"></i> Abrir Asignatura
                </button>
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
                <i className="fas fa-search text-gray-200 text-5xl mb-6"></i>
                <p className="text-gray-400 font-black italic">No se encontraron asignaturas con ese nombre</p>
              </div>
            )}
          </div>
        </section>

        {showToast && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-10 py-5 rounded-full shadow-2xl z-[100] flex items-center gap-4 animate-bounce">
            <i className="fas fa-check-circle text-xl"></i>
            <span className="font-black text-[10px] uppercase tracking-widest">Enlace copiado</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout role={role} setRole={setRole} activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSelectedCourse(null); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
