
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
    description: 'Planificación de redes de transporte, gestión de flotas y optimización de última milla bajo el marco legal vigente.',
    category: 'Logística',
    instructor: 'Dra. Marta Soler',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u_trans_norm',
        title: '⚖️ TEMA: NORMATIVIDAD DE CARGA EN COLOMBIA',
        modules: [
          {
            id: 'm_trans_inter_1',
            title: '🔘 Marco Regulatorio: Decreto 173 y Res. 4100',
            type: 'interactive',
            interactiveData: [
              { title: 'Decreto 173 de 2021', body: 'Es el eje central de la regulación. Establece obligaciones para transportadores y usuarios, garantizando la seguridad en el territorio nacional para cargadores, destinatarios y operadores logísticos.' },
              { title: 'Resolución 4100 de 2004', body: 'Define detalladamente las características técnicas: tipología de camiones, dimensiones máximas, designaciones de peso y nombres de carrocerías según la Norma NTC 4788.' },
              { title: 'Obligaciones del Transportador', body: 'Contar con permisos vigentes, garantizar cumplimiento de normas técnicas, programas de mantenimiento preventivo y asegurar la carga con sistemas de amarre adecuados.' },
              { title: 'Obligaciones del Usuario', body: 'Suministrar información veraz (peso, dimensiones, tipo), pagar el flete acordado y proporcionar condiciones seguras para cargue y descargue.' },
              { title: 'Responsabilidad por Carga', body: 'El transportador responde desde la recogida hasta la entrega final. Sin embargo, en daños por mal embalaje, la responsabilidad puede recaer en el usuario.' }
            ]
          },
          {
            id: 'm_trans_inter_2',
            title: '🔘 Clasificación Técnica de Vehículos',
            type: 'interactive',
            interactiveData: [
              { title: 'Vehículos Rígidos (C)', body: 'La carrocería y el chasis están unidos. C2 (2 ejes), C3 (3 ejes/Doble-troque), C4 (4 ejes/Cuatro-manos). Se clasifican por el número de ejes.' },
              { title: 'Tractocamiones (S)', body: 'Articulados integrados por un cabezote más un tráiler. El S1 indica semirremolque de 1 eje, S2 de dos ejes y S3 de tres ejes. Ejemplo: C3S3 (Tractomula).' },
              { title: 'Remolques (R)', body: 'Vehículos no automotores arrastrados donde el peso no recae sobre el motor. Ejemplo: C2R2 es un camión de 2 ejes con remolque de 2 ejes.' },
              { title: 'Pesos y Dimensiones', body: 'Ancho máximo permitido: 2,60m. Altura máxima: 4,10m. El Peso Bruto Vehicular (PBV) varía desde 16ton para un C2 hasta 52ton para un C3S3.' },
              { title: 'Sistemas de Amarre', body: 'Uso obligatorio de cinchas, cadenas y barras de amarre adecuadas. La seguridad de la carga es vital para evitar accidentes en la vía.' }
            ]
          },
          {
            id: 'm_trans_inter_3',
            title: '🔘 Seguros e Infraestructura',
            type: 'interactive',
            interactiveData: [
              { title: 'Seguros de Transporte', body: 'Protegen al propietario y al transportista. Existen modalidades para carga terrestre, marítima y aérea. Cubren pérdida total, daños parciales, robo y salvamento.' },
              { title: 'Puertos Marítimos', body: 'Nodos críticos de infraestructura. Puertos principales: Cartagena, Barranquilla, Santa Marta (Atlántico) y Buenaventura (Pacífico), motor del comercio exterior.' },
              { title: 'Marco Legal Complementario', body: 'Ley 336/1996 (Estatuto Nacional de Transporte), Ley 769/2002 (Código Nacional de Tránsito) y Resolución 1361/2014 (Mercancías Peligrosas).' },
              { title: 'Documentación Requerida', body: 'Licencia de conducción C2/C3, SOAT, Revisión Técnico-Mecánica, Guía de Remisión, Factura y Contrato de Transporte firmado.' }
            ]
          },
          {
            id: 'm_trans_quiz_norm',
            title: '🧠 Evaluación: Normatividad y Técnica',
            type: 'quiz',
            questions: [
              {
                id: 'q_norm_1',
                question: '¿Qué norma técnica colombiana se encarga de la tipología de vehículos?',
                options: ['NTC 4788', 'Ley 100', 'Decreto 1079'],
                correctAnswer: 0
              },
              {
                id: 'q_norm_2',
                question: '¿Cuál es el ancho máximo permitido para un vehículo de carga en Colombia?',
                options: ['2.40 metros', '2.60 metros', '3.00 metros'],
                correctAnswer: 1
              },
              {
                id: 'q_norm_3',
                question: '¿A qué hace referencia la clasificación C3S2?',
                options: ['Camión rígido de 5 ejes', 'Tractocamión de 3 ejes con semirremolque de 2 ejes', 'Remolque de 3 ejes'],
                correctAnswer: 1
              },
              {
                id: 'q_norm_4',
                question: 'La responsabilidad del transportador sobre la mercancía inicia en:',
                options: ['Cuando el camión sale del garaje', 'En el momento de la recogida', 'Al llegar al peaje'],
                correctAnswer: 1
              },
              {
                id: 'q_norm_5',
                question: '¿Cuál es el Peso Bruto Vehicular (PBV) máximo para un camión de 2 ejes (C2)?',
                options: ['10,000 kg', '16,000 kg', '25,000 kg'],
                correctAnswer: 1
              }
            ]
          }
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
