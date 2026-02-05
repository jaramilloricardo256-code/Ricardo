
import { Course } from '../types';

export const exportToStandaloneHTML = (courses: Course[], googleScriptUrl: string) => {
  const coursesBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(courses))));

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aula Pocket - EducaPro</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fcfcfd; }
        .glass-header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #f1f5f9; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .animate-fade { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .active-mod { background: #2563eb !important; color: white !important; font-weight: 800 !important; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const COURSES = JSON.parse(decodeURIComponent(escape(atob("${coursesBase64}"))));

        function App() {
            const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ep_u') || 'null'));
            const [activeCourse, setActiveCourse] = useState(null);
            const [activeMod, setActiveMod] = useState(null);
            const [prog, setProg] = useState(() => new Set(JSON.parse(localStorage.getItem('ep_p') || '[]')));
            const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem('ep_a') || '{}'));
            const [cases, setCases] = useState(() => JSON.parse(localStorage.getItem('ep_c') || '{}'));
            const [activeCard, setActiveCard] = useState(null);

            useEffect(() => {
                localStorage.setItem('ep_p', JSON.stringify(Array.from(prog)));
                localStorage.setItem('ep_a', JSON.stringify(answers));
                localStorage.setItem('ep_c', JSON.stringify(cases));
            }, [prog, answers, cases]);

            const formatYouTubeUrl = (url) => {
                if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return url;
                let videoId = '';
                if (url.includes('v=')) {
                    videoId = url.split('v=')[1].split('&')[0];
                } else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1].split('?')[0];
                } else if (url.includes('embed/')) {
                    return url;
                }
                return videoId ? "https://www.youtube.com/embed/" + videoId : url;
            };

            const downloadReport = () => {
                const s = user || { name: "Anonimo", age: "?", career: "?", institution: "?" };
                let csv = "Identificación,Edad,Carrera,Institucion,Asignatura,Actividad,Tipo,Resultado/Detalle\\n";
                
                COURSES.forEach(c => {
                    c.units.forEach(u => {
                        u.modules.forEach(m => {
                            if (m.type === 'quiz' && m.questions) {
                                m.questions.forEach(q => {
                                    const ansIdx = answers[q.id];
                                    if (ansIdx !== undefined) {
                                        const resultLabel = ansIdx === q.correctAnswer ? 'CORRECTO' : 'INCORRECTO';
                                        const detail = \`Pregunta: \${q.question.replace(/,/g, '')} | R: \${q.options[ansIdx].replace(/,/g, '')} | Resultado: \${resultLabel}\`;
                                        csv += \`"\${s.name}","\${s.age}","\${s.career}","\${s.institution}","\${c.title}","\${m.title}","EVALUACION","\${detail.replace(/"/g, '""')}"\\n\`;
                                    }
                                });
                            }
                            if (cases[m.id]) {
                                csv += \`"\${s.name}","\${s.age}","\${s.career}","\${s.institution}","\${c.title}","\${m.title}","ANALISIS","\${cases[m.id].replace(/"/g, '""')}"\\n\`;
                            }
                            else if (prog.has(m.id)) {
                                csv += \`"\${s.name}","\${s.age}","\${s.career}","\${s.institution}","\${c.title}","\${m.title}","AVANCE","Completado"\\n\`;
                            }
                        });
                    });
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = \`Reporte_ID_\${s.name}.csv\`; a.click();
            };

            if (!user) {
                return (
                    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                        <div className="bg-white p-12 rounded-[50px] max-w-md w-full shadow-2xl">
                            <h1 className="text-3xl font-black text-slate-900 mb-8 italic uppercase text-center tracking-tighter">EducaPro <span className="text-blue-600">Pocket</span></h1>
                            <p className="text-center text-[10px] font-black text-slate-400 uppercase mb-8">Creador: Ricardo Hinestroza</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const d = new FormData(e.target);
                                const u = { name: d.get('n'), age: d.get('a'), career: d.get('c'), institution: d.get('i') };
                                localStorage.setItem('ep_u', JSON.stringify(u));
                                setUser(u);
                            }} className="space-y-4">
                                <input name="n" type="number" required placeholder="Número de Identificación" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" />
                                <div className="grid grid-cols-3 gap-3">
                                    <input name="a" type="number" required placeholder="Edad" className="p-5 bg-slate-50 rounded-2xl outline-none font-bold" />
                                    <input name="c" required placeholder="Carrera" className="col-span-2 p-5 bg-slate-50 rounded-2xl outline-none font-bold" />
                                </div>
                                <input name="i" required placeholder="Institución" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" />
                                <button className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl">Entrar al Aula</button>
                            </form>
                        </div>
                    </div>
                );
            }

            if (activeCourse && activeMod) {
                const modules = activeCourse.units.flatMap(u => u.modules);
                const idx = modules.findIndex(m => m.id === activeMod.id);
                const isLast = idx === modules.length - 1;

                return (
                    <div className="min-h-screen flex flex-col md:flex-row bg-white">
                        <aside className="w-full md:w-80 bg-slate-50 border-r p-8 h-screen sticky top-0 overflow-y-auto">
                            <button onClick={() => {setActiveCourse(null); setActiveMod(null)}} className="mb-10 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3 hover:text-blue-600 transition">
                                <i className="fas fa-chevron-left"></i> Catálogo
                            </button>
                            <h2 className="text-xl font-black text-slate-900 mb-2 italic leading-tight">{activeCourse.title}</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-8 italic">Autor: Ricardo Hinestroza</p>
                            {activeCourse.units.map(u => (
                                <div key={u.id} className="mb-8">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4 border-b pb-2">{u.title}</p>
                                    <div className="space-y-1">
                                        {u.modules.map(m => (
                                            <button key={m.id} onClick={() => {setActiveMod(m); setActiveCard(null); window.scrollTo(0,0);}} className={"w-full text-left p-4 rounded-xl text-[11px] flex items-center gap-4 transition-all " + (activeMod.id === m.id ? "active-mod" : "text-slate-500 hover:bg-slate-200")}>
                                                <i className={"fas " + (prog.has(m.id) ? "fa-check-circle text-emerald-400" : "fa-circle-notch opacity-30")}></i>
                                                <span className="truncate">{m.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </aside>
                        <main className="flex-1 p-6 md:p-16 overflow-y-auto">
                            <div className="max-w-4xl mx-auto animate-fade">
                                <header className="mb-14">
                                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-blue-200 tracking-widest">{activeMod.type}</span>
                                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mt-5 leading-[0.9]">{activeMod.title}</h1>
                                </header>

                                <div className="bg-white rounded-[50px] border border-slate-100 p-8 md:p-12 shadow-sm mb-12 min-h-[400px]">
                                    {activeMod.type === 'video' && (
                                        <div className="space-y-8">
                                            <div className="aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-50">
                                                <iframe 
                                                    className="w-full h-full" 
                                                    src={formatYouTubeUrl(activeMod.videoUrl)} 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <p className="text-slate-500 font-medium italic text-center px-6 leading-relaxed">{activeMod.content}</p>
                                        </div>
                                    )}

                                    {activeMod.type === 'text' && (
                                        <div className="space-y-8">
                                            <p className="text-2xl text-slate-600 leading-relaxed font-medium whitespace-pre-line">{activeMod.content}</p>
                                            <textarea value={cases[activeMod.id] || ''} onChange={(e) => setCases({...cases, [activeMod.id]: e.target.value})} placeholder="Su análisis..." className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-none font-medium" />
                                        </div>
                                    )}

                                    {activeMod.type === 'interactive' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {activeMod.interactiveData?.map((item, i) => (
                                                <div key={i} className="space-y-2">
                                                    <button onClick={() => setActiveCard(activeCard === i ? null : i)} className={"w-full p-6 rounded-[30px] font-black text-left flex justify-between items-center transition " + (activeCard === i ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-800")}>
                                                        {item.title} <i className={"fas " + (activeCard === i ? "fa-minus" : "fa-plus")}></i>
                                                    </button>
                                                    {activeCard === i && <div className="p-8 bg-blue-50 rounded-[35px] text-slate-600 font-medium animate-fade leading-relaxed">{item.body}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeMod.type === 'quiz' && (
                                        <div className="space-y-10">
                                            {activeMod.questions?.map(q => (
                                                <div key={q.id} className="p-8 bg-slate-50 rounded-[40px]">
                                                    <h3 className="text-2xl font-black text-slate-900 mb-8">{q.question}</h3>
                                                    <div className="grid gap-3">
                                                        {q.options.map((opt, i) => (
                                                            <button key={i} onClick={() => setAnswers({...answers, [q.id]: i})} className={"w-full text-left p-6 rounded-3xl border-2 transition font-bold " + (answers[q.id] === i ? "bg-blue-600 text-white border-blue-600" : "bg-white border-transparent text-slate-600")}>
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeMod.type === 'document' && (
                                        <div className="flex flex-col items-center gap-8 py-10">
                                            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-5xl shadow-inner"><i className="fas fa-file-pdf"></i></div>
                                            <h3 className="text-3xl font-black text-slate-900">Material de Lectura</h3>
                                            <a href={activeMod.fileUrl} target="_blank" className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black shadow-2xl hover:bg-slate-900 transition active:scale-95">Descargar Archivo</a>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => {
                                    const s = new Set(prog); s.add(activeMod.id); setProg(s);
                                    if(isLast) { alert("¡Asignatura Completada! Descargue su reporte CSV."); setActiveCourse(null); setActiveMod(null); }
                                    else { setActiveMod(modules[idx+1]); window.scrollTo(0,0); }
                                }} className="w-full bg-slate-900 text-white py-7 rounded-[35px] font-black uppercase tracking-widest shadow-2xl text-sm transition hover:bg-blue-600 active:scale-95">
                                    {isLast ? 'Finalizar Asignatura' : 'Siguiente Lección'}
                                </button>
                                
                                <footer className="mt-20 py-10 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Creador Ricardo Hinestroza &copy; {new Date().getFullYear()}</p>
                                </footer>
                            </div>
                        </main>
                    </div>
                );
            }

            return (
                <div className="max-w-6xl mx-auto p-6 md:p-12 pb-40">
                    <header className="glass-header sticky top-0 z-50 py-8 px-10 -mx-10 mb-16 flex flex-col md:flex-row justify-between items-center gap-8 rounded-b-[40px] shadow-sm">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 italic uppercase">EducaPro <span className="text-blue-600">Pocket</span></h1>
                            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.4em] mt-2">ID: {user.name} | Creador: Ricardo Hinestroza</p>
                        </div>
                        <button onClick={downloadReport} className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition active:scale-95">REPORTE CSV DE ACTIVIDADES</button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {COURSES.map(c => {
                            const all = c.units.flatMap(u => u.modules);
                            const done = all.filter(m => prog.has(m.id)).length;
                            const perc = Math.round((done/all.length)*100);
                            return (
                                <div key={c.id} className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group border-b-[12px] hover:border-b-blue-600 flex flex-col">
                                    <img src={c.image} className="w-full h-56 object-cover rounded-[40px] mb-8 shadow-sm transition group-hover:scale-[1.03]" />
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{perc}% COMPLETADO</span>
                                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full transition-all duration-1000" style={{width: perc+'%'}}></div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight italic flex-grow">{c.title}</h3>
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-8">Autor: Ricardo Hinestroza</p>
                                    <button onClick={() => {setActiveCourse(c); setActiveMod(c.units[0].modules[0]); window.scrollTo(0,0)}} className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black uppercase text-xs shadow-xl hover:bg-blue-600 transition active:scale-95">Abrir Asignatura</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Aula_EducaPro_Pocket.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
