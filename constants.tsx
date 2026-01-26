
import { Course } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentos de Inteligencia Artificial',
    description: 'Aprende los conceptos básicos de IA, redes neuronales y ética en la computación.',
    category: 'Tecnología',
    instructor: 'Dra. Elena García',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u1',
        title: 'Introducción a la IA',
        modules: [
          {
            id: 'm1',
            title: 'Historia y Definición',
            type: 'text',
            content: 'La inteligencia artificial ha evolucionado desde los algoritmos simples de búsqueda de los años 50 hasta los modelos generativos actuales. En este módulo exploraremos los hitos de Turing, McCarthy y Minsky.'
          },
          {
            id: 'm1_doc',
            title: 'Guía de Lectura: Historia de la Computación',
            type: 'document',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            content: 'Este documento contiene las lecturas obligatorias para la primera semana.'
          },
          {
            id: 'm2',
            title: 'IA en la Actualidad (Video)',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/2ePf9rue1Ao'
          },
          {
            id: 'm3',
            title: 'Evaluación de Conceptos',
            type: 'quiz',
            questions: [
              {
                id: 'q1',
                question: '¿Qué prueba determina si una máquina puede pensar como un humano?',
                options: ['Prueba de Voight-Kampff', 'Prueba de Turing', 'Algoritmo de Dijkstra', 'Ley de Moore'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Economía Digital y Fintech',
    description: 'Explora el impacto de las tecnologías financieras en el mercado global moderno.',
    category: 'Negocios',
    instructor: 'Dr. Roberto Sánchez',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    units: [
      {
        id: 'u3',
        title: 'El ecosistema Fintech',
        modules: [
          { id: 'm5', title: '¿Qué es Fintech?', type: 'text', content: 'Fintech se refiere al uso de tecnología para mejorar y automatizar servicios financieros para empresas y consumidores por igual.' },
          { id: 'm6', title: 'Masterclass: Futuro del Dinero', type: 'video', videoUrl: 'https://www.youtube.com/embed/6_6vD9rL6p0' }
        ]
      }
    ]
  }
];
