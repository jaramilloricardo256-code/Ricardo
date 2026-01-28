
import React, { useState, useEffect } from 'react';
import { Course, AnalyticsEvent, Module, Unit } from '../types';
import { exportToStandaloneHTML } from '../services/exportService';

interface TeacherDashboardProps {
  courses: Course[];
  onCourseUpdate: (courses: Course[]) => void;
  appUrl?: string;
  onUrlChange?: (url: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ courses, onCourseUpdate, appUrl }) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  
  const [newResource, setNewResource] = useState({
    courseId: courses[0]?.id || '',
    unitId: '',
    title: '',
    type: 'document' as Module['type'],
    url: '',
    description: ''
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
    setAnalytics(data);
    if (courses.length > 0) {
        setNewResource(prev => ({ ...prev, courseId: courses[0].id, unitId: courses[0].units[0]?.id || '' }));
    }
  }, []);

  const formatYouTubeUrl = (url: string) => {
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return url;
    let videoId = '';
    if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
        return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const toggleCourseSelection = (id: string) => {
    const next = new Set(selectedCourseIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCourseIds(next);
  };

  const handleExport = () => {
    const coursesToExport = selectedCourseIds.size > 0 
      ? courses.filter(c => selectedCourseIds.has(c.id))
      : courses;
    
    exportToStandaloneHTML(coursesToExport, appUrl || "");
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = newResource.type === 'video' ? formatYouTubeUrl(newResource.url) : newResource.url;
    
    const updatedCourses = courses.map(c => {
      if (c.id === newResource.courseId) {
        const newMod: Module = {
          id: 'custom-' + Date.now(),
          title: newResource.title,
          type: newResource.type,
          fileUrl: (newResource.type === 'document') ? finalUrl : undefined,
          videoUrl: (newResource.type === 'video') ? finalUrl : undefined,
          content: newResource.description,
        };
        
        const updatedUnits = c.units.map(u => {
            if (u.id === newResource.unitId || (!newResource.unitId && c.units[0].id === u.id)) {
                return { ...u, modules: [...u.modules, newMod] };
            }
            return u;
        });
        return { ...c, units: updatedUnits };
      }
      return c;
    });
    onCourseUpdate(updatedCourses);
    setNewResource({ ...newResource, title: '', url: '', description: '' });
    alert("¡Recurso académico añadido e integrado con éxito!");
  };

  const selectedCourse = courses.find(c => c.id === newResource.courseId);

  const handleReportImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    const isCSV = file.name.toLowerCase().endsWith('.csv');
    
    reader.onload = (event) => {
      try {
        const rawData = event.target?.result as string;
        let importedEvents: AnalyticsEvent[] = [];

        if (isCSV) {
          const lines = rawData.split('\n');
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, ''));
            
            if (parts.length >= 7) {
              importedEvents.push({
                userName: parts[0],
                age: parts[1],
                career: parts[2],
                institution: parts[3],
                userId: 'POCKET-' + Math.random().toString(36).substr(2, 5),
                courseTitle: parts[4] || 'Aula Pocket',
                moduleTitle: parts[5],
                action: 'case_analysis',
                value: parts[7] || parts[6], 
                timestamp: Date.now(),
                moduleId: 'pocket-import',
                courseId: 'pocket-import'
              });
            }
          }
        } else {
          const data = JSON.parse(rawData);
          const stu = data.student || {};
          
          (data.prog || []).forEach((mid: string) => {
            importedEvents.push({
              userId: "POCKET-JSON",
              userName: stu.name || "Anonimo",
              career: stu.career || "N/A",
              age: stu.age || "N/A",
              institution: stu.institution || "N/A",
              courseId: "pocket",
              courseTitle: "Aula Pocket",
              moduleId: mid,
              moduleTitle: "Actividad",
              action: 'complete',
              value: data.cases?.[mid] || "Finalizado",
              timestamp: Date.now()
            });
          });
        }

        const currentAnalytics = JSON.parse(localStorage.getItem('educapro_analytics') || '[]');
        const updated = [...currentAnalytics, ...importedEvents];
        setAnalytics(updated);
        localStorage.setItem('educapro_analytics', JSON.stringify(updated));
        
        setTimeout(() => {
          setIsImporting(false);
          alert(`✅ Éxito: Se han procesado ${importedEvents.length} registros del reporte.`);
          e.target.value = '';
        }, 500);

      } catch (err) {
        setIsImporting(false);
        alert("❌ Error: Archivo inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-[1500px] mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-100 pb-10">
        <div>
          <h1 className="google-font text-5xl font-black text-slate-900 tracking-tighter italic uppercase text-blue-600">Centro de Comando</h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Gestión de Recursos y Aula Pocket
          </p>
        </div>
      </header>

      {/* SECCIÓN HORIZONTAL DE FORMULARIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PANEL IZQUIERDO: INYECCIÓN */}
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white text-2xl shadow-lg">
              <i className="fas fa-plus"></i>
            </div>
            <div>
              <h3 className="text-[12px] font-black uppercase text-slate-900 tracking-widest">Inyección de Recursos</h3>
              <p className="text-[10px] text-slate-400 font-bold">Añada documentos o videos sanitizados</p>
            </div>
          </div>

          <form onSubmit={handleAddResource} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Asignatura Destino</label>
                <select 
                    value={newResource.courseId} 
                    onChange={e => setNewResource({...newResource, courseId: e.target.value, unitId: courses.find(c => c.id === e.target.value)?.units[0].id || ''})}
                    className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold border-none"
                >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Unidad / Tema</label>
                <select 
                    value={newResource.unitId} 
                    onChange={e => setNewResource({...newResource, unitId: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold border-none"
                >
                    {selectedCourse?.units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                </select>
              </div>
            </div>

            <input required placeholder="Título del Recurso" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold border-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tipo de Medio</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setNewResource({...newResource, type: 'document'})} className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition ${newResource.type === 'document' ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100'}`}>PDF</button>
                  <button type="button" onClick={() => setNewResource({...newResource, type: 'video'})} className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition ${newResource.type === 'video' ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100'}`}>Video</button>
                </div>
              </div>
              <input required placeholder="Enlace (YouTube o PDF)" value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold border-none" />
            </div>

            <textarea placeholder="Descripción académica..." value={newResource.description} onChange={e => setNewResource({...newResource, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold border-none h-24" />
            
            <button className="w-full bg-slate-900 text-white py-6 rounded-[25px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition shadow-xl active:scale-95">Inyectar Recurso</button>
          </form>
        </div>

        {/* PANEL DERECHO: GENERADOR POCKET */}
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-100">
              <i className="fas fa-boxes-packing"></i>
            </div>
            <div>
              <h3 className="text-[12px] font-black uppercase text-slate-900 tracking-widest">Generador Aula Pocket</h3>
              <p className="text-[10px] text-slate-400 font-bold">Empaquetado para educación sin conexión</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar p-1">
              {courses.map(course => (
                <label key={course.id} className={`flex items-center gap-4 p-5 rounded-[30px] cursor-pointer transition-all border-2 ${selectedCourseIds.has(course.id) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                  <input type="checkbox" checked={selectedCourseIds.has(course.id)} onChange={() => toggleCourseSelection(course.id)} className="w-5 h-5 rounded-lg text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-800 truncate uppercase">{course.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{course.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <button onClick={handleExport} className="w-full bg-blue-600 text-white py-7 rounded-[35px] font-black shadow-2xl hover:bg-slate-900 transition flex items-center justify-center gap-5 text-[12px] uppercase active:scale-95">Descargar Aula Pocket</button>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE ESTADÍSTICAS Y ANALÍTICA */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard icon="fa-user-graduate" label="Estudiantes con Evidencias" value={new Set(analytics.map(a => a.userName)).size} color="blue" />
          <StatCard icon="fa-clipboard-list" label="Actividades Reportadas" value={analytics.length} color="emerald" />
        </div>

        {/* TABLA DE SEGUIMIENTO ACADÉMICO */}
        <div className="bg-white rounded-[60px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-10 bg-slate-50/40 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="font-black text-slate-900 text-[14px] uppercase tracking-[0.25em] italic">Seguimiento de Evidencias Aula Pocket</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Sincronización vía CSV/JSON del estudiante</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                 <button className="bg-emerald-50 text-emerald-600 px-8 py-5 rounded-[22px] text-[10px] font-black uppercase flex items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95">
                   <i className="fas fa-file-csv text-lg"></i> Cargar Reporte Estudiante
                 </button>
                 <input type="file" accept=".json,.csv" onChange={handleReportImport} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <button onClick={() => {if(confirm("¿Limpiar historial?")) {localStorage.removeItem('educapro_analytics'); setAnalytics([]);}}} className="text-red-400 text-[10px] font-black uppercase hover:underline p-2 tracking-widest">Limpiar</button>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50/20 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">
                <tr>
                  <th className="px-12 py-8">Estudiante</th>
                  <th className="px-12 py-8">Asignatura</th>
                  <th className="px-12 py-8">Actividad</th>
                  <th className="px-12 py-8">Evidencia / Respuesta</th>
                  <th className="px-12 py-8 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analytics.slice().reverse().map((a, i) => (
                  <tr key={i} className="hover:bg-blue-50/10 transition-all group">
                    <td className="px-12 py-8">
                        <p className="font-black text-slate-900 leading-none mb-1 text-sm">{a.userName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{a.career}</p>
                    </td>
                    <td className="px-12 py-8 text-slate-500 font-black text-[11px] uppercase tracking-tight">{a.courseTitle}</td>
                    <td className="px-12 py-8">
                        <p className="text-[11px] font-black text-slate-700 uppercase">{a.moduleTitle}</p>
                    </td>
                    <td className="px-12 py-8">
                      <div className="max-w-[450px]">
                        <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic border-l-4 border-blue-100 pl-6 bg-slate-50/30 p-4 rounded-xl">"{a.value}"</p>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right font-black text-[11px] text-slate-300 uppercase italic">
                        {new Date(a.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {analytics.length === 0 && (
                  <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-black italic uppercase text-[12px] tracking-[0.3em]">No hay evidencias registradas en el sistema</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: string, label: string, value: number, color: 'blue' | 'emerald' }) => {
  const colors = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600' };
  return (
    <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm flex items-center gap-8 group hover:scale-[1.02] transition-all">
      <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl shadow-lg ${colors[color]}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase mb-2">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
