
import React, { useState, useEffect } from 'react';
import { Course, AnalyticsEvent, StudentProfile } from '../types';

interface TeacherDashboardProps {
  courses: Course[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ courses }) => {
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);

  useEffect(() => {
    const loadData = () => {
      const data = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
      const profs = JSON.parse(localStorage.getItem('educapro_profiles') || '[]');
      setAnalytics(data);
      setProfiles(profs);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const exportData = () => {
    if (analytics.length === 0 && profiles.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ['Fecha', 'Estudiante', 'Carrera', 'Edad', 'Curso', 'Módulo', 'Acción', 'Contenido/Respuesta'];
    const rows = analytics.map(ev => {
      const studentProf = profiles.find(p => p.userId === ev.userId);
      return [
        new Date(ev.timestamp).toLocaleString(),
        ev.userName,
        studentProf?.career || 'N/A',
        studentProf?.age || 'N/A',
        ev.courseTitle,
        ev.moduleTitle,
        ev.action,
        ev.value ? (typeof ev.value === 'object' ? JSON.stringify(ev.value).replace(/,/g, ';') : ev.value.toString().replace(/,/g, ';')) : 'N/A'
      ];
    });

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_completo_educapro_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="google-font text-4xl font-black text-gray-900">Consola del Profesor</h1>
          <p className="text-gray-500 text-lg">Monitoreo de impacto educativo y analíticas sociodemográficas.</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={() => { if(confirm("¿Borrar todos los datos capturados?")) { localStorage.clear(); window.location.reload(); }}} 
            className="flex-1 lg:flex-none border-2 border-red-100 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition"
          >
            Resetear Datos
          </button>
          <button 
            onClick={exportData} 
            className="flex-1 lg:flex-none bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:bg-green-700 transition"
          >
            <i className="fas fa-download"></i> Exportar CSV Completo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Estudiantes" value={profiles.length} icon="fa-user-graduate" color="bg-blue-600" />
        <StatCard title="Interacciones" value={analytics.length} icon="fa-chart-pie" color="bg-indigo-600" />
        <StatCard title="Textos Manuales" value={analytics.filter(a => a.action === 'registration' || a.action === 'feedback').length} icon="fa-keyboard" color="bg-amber-500" />
        <StatCard title="Módulos Completos" value={analytics.filter(a => a.action === 'complete').length} icon="fa-check-double" color="bg-emerald-500" />
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-xl">Perfiles Sociodemográficos Capturados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-4">Nombre Estudiante</th>
                  <th className="px-8 py-4">Carrera / Facultad</th>
                  <th className="px-8 py-4">Edad</th>
                  <th className="px-8 py-4">Fecha Ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profiles.map((p, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition">
                    <td className="px-8 py-5 font-bold text-gray-900">{p.name}</td>
                    <td className="px-8 py-5 text-gray-600">{p.career}</td>
                    <td className="px-8 py-5 font-bold text-blue-600">{p.age} años</td>
                    <td className="px-8 py-5 text-gray-400 text-xs">{new Date(p.registrationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-xl">Respuestas de Texto (Texto Manual)</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {analytics.filter(a => a.action === 'registration' || a.action === 'feedback').reverse().map((ev, i) => (
              <div key={i} className="p-8 hover:bg-gray-50 transition flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-comment-alt"></i>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-gray-900">{ev.userName}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">FEEDBACK</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">En el módulo: <span className="text-gray-600 font-bold">{ev.moduleTitle}</span></p>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-700 text-sm italic shadow-sm leading-relaxed">
                    "{ev.value}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-gray-100`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export default TeacherDashboard;
