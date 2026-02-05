
import { Course } from './types';

export const INITIAL_COURSES: Course[] = [
  // --- SISTEMAS DE INFORMACIÓN LOGÍSTICA ---
  {
    id: 'log_sis',
    title: 'Sistemas de Información Logística',
    description: 'Implementación de WMS, ERP y analítica de datos para la visibilidad de la red.',
    category: 'Logística',
    instructor: 'Ricardo Hinestroza',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_sis_math_analytics',
        title: '🔢 UNIDAD: ANALÍTICA Y ESTADÍSTICA LOGÍSTICA',
        modules: [
          {
            id: 'm_math_intro',
            title: '📖 El Dato como Activo Estratégico',
            type: 'text',
            content: `Dominar los números es dominar la operación. Un error en un decimal puede costar millones en una importación o un quiebre de stock masivo. En esta unidad, transformaremos la matemática básica en una herramienta de poder gerencial.`
          },
          {
            id: 'm_math_regla3_directa',
            title: '🕹️ SIMULADOR: Regla de 3 Directa (Flujos)',
            type: 'interactive',
            interactiveData: [
              { title: 'Concepto: Proporcionalidad Directa', body: 'A más pedidos, más tiempo. A más camiones, más capacidad. \n\nCálculo: (Nuevo Valor * Referencia B) / Referencia A.' },
              { title: 'EJERCICIO: Rendimiento de Montacargas', body: 'Si 12 operarios de montacargas movilizan 360 estibas en una jornada, ¿cuántas estibas podrán movilizar 25 operarios manteniendo el mismo ritmo? \n\nRESOLUCIÓN: (25 * 360) / 12 = 750 estibas. Útil para dimensionar flotas de equipo.' },
              { title: 'EJERCICIO: Abastecimiento de Flota', body: 'Una van de reparto consume 45 galones de combustible para cubrir 350km de ruta. ¿Cuántos galones se deben presupuestar para una ruta de 1.200km? \n\nRESOLUCIÓN: (1.200 * 45) / 350 = 154.28 galones.' }
            ]
          },
          {
            id: 'm_math_regla3_inversa',
            title: '🕹️ SIMULADOR: Regla de 3 Inversa (Tiempos)',
            type: 'interactive',
            interactiveData: [
              { title: 'Concepto: Relación Inversa', body: 'A más recursos, menos tiempo. Fundamental para optimización de plazos. \n\nCálculo: (Recurso Inicial * Tiempo Inicial) / Nuevo Recurso.' },
              { title: 'EJERCICIO: Adecuación de Bodega', body: '420 obreros terminan el montaje de estanterías en 300 días. Si la dirección requiere que el CEDI esté listo en solo 210 días, ¿cuántos obreros en total se necesitan? \n\nRESOLUCIÓN: (420 * 300) / 210 = 600 obreros totales. Se requiere contratar 180 adicionales.' },
              { title: 'EJERCICIO: Estaciones de Escaneo', body: '6 estaciones de auditoría procesan un lote de mercancía en 18 horas. Si habilitamos 9 estaciones iguales, ¿cuánto tiempo tomará el proceso? \n\nRESOLUCIÓN: (6 * 18) / 9 = 12 horas.' }
            ]
          },
          {
            id: 'm_math_iva_porcentajes',
            title: '🔘 Estrategia: Porcentajes e IVA',
            type: 'interactive',
            interactiveData: [
              { title: 'Auditoría de IVA (19%)', body: 'Se recibe una factura global de servicios de transporte por $3.500.000 con el IVA del 19% ya incluido. El analista debe reportar el costo antes de impuestos. \n\nCÁLCULO: 3.500.000 / 1.19 = $2.941.176 valor base.' },
              { title: 'Tasa de Ausentismo Operativo', body: 'En una planta con 820 colaboradores, se registraron 94 ausencias en el último mes por motivos de salud. ¿Cuál es el porcentaje de ausentismo? \n\nCÁLCULO: (94 / 820) * 100 = 11.46%.' },
              { title: 'Comisiones sobre Rentabilidad', body: 'Se cierra una venta corporativa de $8.000.000. El margen de utilidad operativa es del 15% ($1.200.000). Se acuerda una comisión del 8% sobre esa utilidad para el ejecutivo. \n\nCÁLCULO: 1.200.000 * 0.08 = $96.000.' }
            ]
          },
          {
            id: 'm_math_video_tutorial',
            title: '📺 Masterclass: Analítica para no Matemáticos',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/N1vXRE67f-0',
            content: 'Guía paso a paso para resolver problemas de proporciones en el entorno industrial.'
          },
          {
            id: 'm_math_quiz_final',
            title: '🧠 Evaluación: Certificación en Analítica',
            type: 'quiz',
            questions: [
              { id: 'qm_1', question: 'Si 8 empacadores tardan 60h en un despacho masivo, ¿cuántos empacadores se necesitan para hacerlo en 24h?', options: ['12 empacadores', '20 empacadores', '15 empacadores'], correctAnswer: 1 },
              { id: 'qm_2', question: 'Un rack industrial de 15m tiene 6 niveles. Si rediseñamos para tener 8 niveles en la misma altura, ¿cuánto medirá cada nivel?', options: ['1.875m', '2.100m', '1.500m'], correctAnswer: 0 },
              { id: 'qm_3', question: 'De 120 paquetes procesados, el 15% tiene errores de picking. De estos errores, el 40% son etiquetas mal pegadas. ¿Cuántos tienen etiquetas mal pegadas?', options: ['18 paquetes', '12 paquetes', '7 paquetes'], correctAnswer: 2 }
            ]
          }
        ]
      },
      {
        id: 'u_sis_scm_digital',
        title: '🌐 UNIDAD: CADENA DE SUMINISTRO DIGITAL',
        modules: [
          { id: 'm_sis_sc_1', title: 'Fundamentos SCM', type: 'text', content: 'Integración tecnológica de flujos físicos e informativos.' }
        ]
      }
    ]
  },
  // --- GESTIÓN DE INVENTARIOS ---
  {
    id: 'log_inv',
    title: 'Gestión de Inventario',
    description: 'Optimización de existencias y modelos de reposición estratégica.',
    category: 'Logística',
    instructor: 'Ricardo Hinestroza',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_inv_scm',
        title: '🌐 TEMA: CADENA DE SUMINISTRO GLOBAL',
        modules: [
          { 
            id: 'm_chase_inv', 
            title: '📖 Texto Guía: SCM Integral', 
            type: 'document', 
            fileUrl: 'https://ucreanop.com/wp-content/uploads/2020/08/Administracion-de-Operaciones-Produccion-y-Cadena-de-Suministro-13edi-Chase.pdf'
          },
          {
            id: 'm_inv_simulation',
            title: '🕹️ SIMULADOR: Crisis LuminoTech',
            type: 'interactive',
            interactiveData: [
              { title: 'Escenario Crítico', body: 'Demanda insatisfecha del 13%. Debes decidir entre costo de transporte o pérdida de cliente.' },
              { title: 'Decisión: Abastecimiento', body: 'Cambiar a proveedor nacional para reducir el Lead Time.' }
            ]
          }
        ]
      }
    ]
  },
  // --- TRANSPORTE Y DISTRIBUCIÓN ---
  {
    id: 'log_trans',
    title: 'Transporte y Distribución',
    description: 'Planificación de redes y gestión de flotas bajo normatividad.',
    category: 'Logística',
    instructor: 'Ricardo Hinestroza',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_trans_norma',
        title: '⚖️ UNIDAD: NORMATIVIDAD TÉCNICA',
        modules: [
          {
            id: 'm_trans_res4100',
            title: '🔘 Resolución 4100: Pesos y Dimensiones',
            type: 'interactive',
            interactiveData: [
              { title: 'Límites de Ancho', body: 'Ancho máximo permitido: 2.60 metros.' },
              { title: 'Tipologías', body: 'Clasificación C2, C3, S3 según configuración de ejes.' }
            ]
          }
        ]
      }
    ]
  },
  // --- MÉTODOS Y TIEMPOS ---
  {
    id: 'prod_met',
    title: 'Métodos y Tiempos',
    description: 'Estudio avanzado del trabajo y estandarización de procesos.',
    category: 'Productividad',
    instructor: 'Ricardo Hinestroza',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_met_ingenieria',
        title: '📐 TEMA: INGENIERÍA DE MÉTODOS',
        modules: [
          {
            id: 'm_pareto_metodos',
            title: '🕹️ SIMULADOR: Pareto en Puertas',
            type: 'interactive',
            interactiveData: [
              { title: 'Análisis de Defectos', body: 'Fuera de Perfil (37%), Piezas Desordenadas (26%).' },
              { title: 'Estrategia 80/20', body: 'Atacando solo 2 fallos resolvemos el 63% de la mala calidad.' }
            ]
          }
        ]
      }
    ]
  }
];
