
import { Course } from './types';

export const INITIAL_COURSES: Course[] = [
  // --- ÁREA LOGÍSTICA ---
  {
    id: 'log_inv',
    title: 'Gestión de Inventario',
    description: 'Optimización de existencias, modelos de reposición y gestión estratégica de almacenes para la eficiencia operativa.',
    category: 'Logística',
    instructor: 'Richard B. Chase & Equipo EducaPro',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_inv_1',
        title: '🌐 TEMA: CADENA DE SUMINISTRO',
        modules: [
          { 
            id: 'm_chase_doc', 
            title: '📖 Texto Guía: SCM y Logística Integral', 
            type: 'document', 
            fileUrl: 'https://ucreanop.com/wp-content/uploads/2020/08/Administracion-de-Operaciones-Produccion-y-Cadena-de-Suministro-13edi-Chase.pdf',
            content: 'Material fundamental sobre el diseño de la red de valor y flujos logísticos globales.'
          },
          {
            id: 'm_sc_interactive',
            title: '🔘 Explorador de Pilares SCM 4.0',
            type: 'interactive',
            interactiveData: [
              { title: 'Gestión de Flujos de Información', body: 'La base de una cadena eficiente no es el movimiento de cajas, sino la fluidez de los datos. El intercambio electrónico de datos (EDI) permite reducir el tiempo de respuesta ante cambios bruscos.' },
              { title: 'Logística Inversa Estratégica', body: 'Se trata de la economía circular. Diseñar procesos que permitan recuperar componentes y reacondicionar productos para minimizar el impacto ambiental.' },
              { title: 'Visibilidad E2E (Extremo a Extremo)', body: 'Capacidad de ver el inventario no solo en mi almacén, sino en tránsito y en los almacenes de mis proveedores para optimizar el flujo de efectivo.' },
              { title: 'Sincronización y Colaboración', body: 'Romper los silos departamentales mediante planes de demanda compartidos (S&OP) para eliminar ineficiencias por objetivos contradictorios.' },
              { title: 'Agilidad y Resiliencia', body: 'La cadena debe ser antifrágil. Esto se logra mediante el diseño de redes flexibles que puedan cambiar de ruta ante crisis internacionales.' }
            ]
          },
          { 
            id: 'm_inv_quiz', 
            title: '🧠 Evaluación: Gestión de la Cadena', 
            type: 'quiz', 
            questions: [
              { 
                id: 'q_sc_1', 
                question: '¿Cuál es el beneficio principal de la Visibilidad E2E?', 
                options: ['Reducir el stock de seguridad innecesario', 'Contratar más guardias', 'Comprar software caro'], 
                correctAnswer: 0 
              },
              { 
                id: 'q_sc_2', 
                question: 'La sincronización de flujos busca evitar:', 
                options: ['Cuellos de botella y exceso de inventario', 'Que el personal llegue tarde', 'Usar camiones grandes'], 
                correctAnswer: 0 
              },
              { 
                id: 'q_sc_3', 
                question: '¿Qué define a una cadena de suministro "Ágil"?', 
                options: ['Reaccionar rápido ante cambios en la demanda', 'Mover paquetes rápido', 'Tener camiones veloces'], 
                correctAnswer: 0 
              },
              { 
                id: 'q_sc_4', 
                question: 'En SCM, el concepto de "Silo" se refiere a:', 
                options: ['Áreas que no comparten información', 'Almacenes de granos', 'Contenedores'], 
                correctAnswer: 0 
              },
              { 
                id: 'q_sc_5', 
                question: 'La Logística Inversa permite principalmente:', 
                options: ['Recuperar valor de productos devueltos', 'Manejar en reversa', 'Subir el precio final'], 
                correctAnswer: 0 
              }
            ] 
          }
        ]
      }
    ]
  },
  {
    id: 'log_sis',
    title: 'Sistemas de Información Logística',
    description: 'Implementación de WMS, ERP y tecnologías de trazabilidad digital para la visibilidad de la red.',
    category: 'Logística',
    instructor: 'Ing. Carlos Ruiz',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_sis_1',
        title: '🌐 TEMA: TECNOLOGÍAS DE VISIBILIDAD',
        modules: [
          { id: 'm_sis_1', title: 'Arquitectura de un WMS', type: 'text', content: 'Un Warehouse Management System permite el control exacto de ubicaciones.' }
        ]
      }
    ]
  },
  {
    id: 'log_trans',
    title: 'Transporte y Distribución',
    description: 'Planificación de redes de transporte, gestión de flotas y optimización de última milla.',
    category: 'Logística',
    instructor: 'Dra. Marta Soler',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_trans_1',
        title: '🌐 TEMA: GESTIÓN DE REDES',
        modules: [
          { id: 'm_trans_1', title: 'Transporte Multimodal', type: 'text', content: 'Combinación de medios para eficiencia de costos.' }
        ]
      }
    ]
  },
  {
    id: 'adm_com',
    title: 'Gestión de Compras',
    description: 'Abastecimiento estratégico, negociación y control del gasto corporativo.',
    category: 'Administración',
    instructor: 'Lic. Roberto Gómez',
    image: 'https://images.unsplash.com/photo-1556740734-7f9a2b7a0f40?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_com_1',
        title: '🌐 TEMA: ABASTECIMIENTO',
        modules: [
          { id: 'm_com_1', title: 'Matriz de Kraljic', type: 'text', content: 'Clasificación estratégica de materiales.' }
        ]
      }
    ]
  },
  {
    id: 'adm_proc',
    title: 'Procesos Productivos',
    description: 'Lean Manufacturing, gestión de calidad y diseño de manufactura.',
    category: 'Administración',
    instructor: 'Ing. Laura Peña',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_pp_1',
        title: '🌐 TEMA: FLUJOS DE PLANTA',
        modules: [
          { id: 'm_pp_1', title: 'Sistemas Push vs Pull', type: 'text', content: 'Gestión de flujo según ritmo de demanda.' }
        ]
      }
    ]
  },
  {
    id: 'prod_met',
    title: 'Métodos y Tiempos',
    description: 'Estudio avanzado del trabajo, ingeniería de métodos y estandarización.',
    category: 'Productividad',
    instructor: 'Dr. Sergio Valdés',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_met_1',
        title: '🌐 TEMA: INGENIERÍA DE MÉTODOS',
        modules: [
          { id: 'm_met_1', title: 'Cronometraje Industrial', type: 'text', content: 'Determinación de tiempos estándar.' }
        ]
      }
    ]
  }
];
