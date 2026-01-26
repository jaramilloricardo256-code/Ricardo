
import React, { useState, useEffect } from 'react';
import { Course, AnalyticsEvent, StudentProfile } from '../types';

interface TeacherDashboardProps {
  courses: Course[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ courses }) => {
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    const profs = JSON.parse(localStorage.getItem('educapro_profiles') || '[]');
    setAnalytics(data);
    setProfiles(profs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const clearData = () => {
    if (confirm("¿Estás seguro de borrar todos los registros? Esta acción no se puede deshacer.")) {
      localStorage.removeItem('educapro_analytics');
      localStorage.removeItem('educapro_profiles');
      loadData();
    }
  };

  const exportData = () => {
    if (analytics.length === 0 && profiles.length === 0) {
      alert("No hay datos disponibles para exportar.");
      return;
    }

    const headers = ['Fecha y Hora', 'Estudiante', 'Carrera', 'Edad', 'Curso', 'Módulo', 'Acción', 'Valor Registrado'];
    const rows = analytics.map(ev => {
      const studentProf = profiles.find(p => p.userId === ev.userId);
      return [
        new Date(ev.timestamp).toLocaleString('es-ES'),
        ev.userName,
        studentProf?.career || 'Sin Carrera',
        studentProf?.age || '-',
        ev.courseTitle,
        ev.moduleTitle,
        ev.action.toUpperCase(),
        ev.value ? (typeof ev.value === 'object' ? JSON.stringify(ev.value).replace(/"/g, "'") : ev.value.toString().replace(/,/g, ';')) : '-'
      ];
    });

    // Agregar BOM \uFEFF para que Excel reconozca UTF-8 (tildes)
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EducaPro_Reporte_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="google-font text-5xl font-black text-gray-900 tracking-tight">Consola Docente</h1>
          <p className="text-gray-500 text-lg font-medium mt-2">Observatorio de datos y seguimiento de trayectorias académicas.</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={clearData} 
            className="flex-1 lg:flex-none border-2 border-red-100 text-red-500 px-8 py-4 rounded-[22px] font-black hover:bg-red-50 transition-colors"
          >
            Resetear Datos
          </button>
          <button 
            onClick={exportData} 
            className="flex-1 lg:flex-none bg-blue-600 text-white px-10 py-4 rounded-[22px] font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-[1.02]"
          >
            <i className="fas fa-file-excel"></i> Exportar Datos (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatItem title="Matriculados" value={profiles.length} sub="Estudiantes únicos" icon="fa-user-graduate" color="bg-blue-600" />
        <StatItem title="Interacciones" value={analytics.length} sub="Logs de actividad" icon="fa-fingerprint" color="bg-indigo-600" />
        <StatItem title="Completitud" value={analytics.filter(a => a.action === 'complete').length} sub="Módulos finalizados" icon="fa-circle-check" color="bg-emerald-500" />
        <StatItem title="Feedbacks" value={analytics.filter(a => a.action === 'registration' || a.action === 'feedback').length} sub="Respuestas manuales" icon="fa-comment-dots" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-black text-gray-900 text-2xl">Perfiles de Ingreso</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="px-10 py-5">Nombre / Usuario</th>
                  <th className="px-10 py-5">Carrera</th>
                  <th className="px-10 py-5 text-center">Edad</th>
                  <th className="px-10 py-5">Alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profiles.map((p, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">{p.name.substring(0,2)}</div>
                          <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-gray-500 font-medium">{p.career}</td>
                    <td className="px-10 py-6 text-center font-black text-blue-600">{p.age}</td>
                    <td className="px-10 py-6 text-gray-400 text-xs font-bold uppercase">{new Date(p.registrationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold italic">No hay estudiantes registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-black text-gray-900 text-2xl">Bitácora de Expectativas</h3>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[600px]">
            {analytics.filter(a => a.action === 'registration' || a.action === 'feedback').reverse().map((ev, i) => (
              <div key={i} className="p-10 hover:bg-gray-50/50 transition-colors flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 text-xl shadow-sm border border-amber-100/50">
                  <i className="fas fa-quote-left"></i>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-gray-900 text-lg leading-none">{ev.userName}</span>
                    <span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">REGISTRO</span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-4 tracking-widest">Procedencia: <span className="text-blue-600">{profiles.find(p => p.userId === ev.userId)?.career || 'N/A'}</span></p>
                  <div className="bg-white border border-gray-100 p-6 rounded-[24px] text-gray-600 text-sm italic shadow-sm leading-relaxed border-l-4 border-l-blue-500">
                    "{ev.value}"
                  </div>
                </div>
              </div>
            ))}
            {analytics.filter(a => a.action === 'registration').length === 0 && (
               <div className="p-20 text-center text-gray-400 font-bold italic">No hay respuestas manuales para mostrar.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-16 h-16 ${color} text-white rounded-[20px] flex items-center justify-center text-2xl shadow-2xl shadow-gray-200 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span className="text-gray-300 text-3xl font-black">#</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>
    </div>
  </div>
);

export default TeacherDashboard;
