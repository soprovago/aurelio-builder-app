/**
 * Template Library Data
 * Biblioteca completa de plantillas con estructuras detalladas
 */

import { 
  FiGrid, FiGlobe, FiPlay, FiMail, FiTrendingUp, FiFileText,
  FiUsers, FiBookOpen, FiHeart, FiShoppingBag, FiCalendar,
  FiMonitor, FiCamera, FiMusic, FiTool, FiCoffee
} from 'react-icons/fi';

// Categorías de plantillas
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: FiGrid, color: 'gray' },
  { id: 'landing', name: 'Landing Pages', icon: FiGlobe, color: 'blue' },
  { id: 'webinar', name: 'Webinar', icon: FiPlay, color: 'red' },
  { id: 'vsl', name: 'VSL', icon: FiMonitor, color: 'purple' },
  { id: 'capture', name: 'Captura', icon: FiMail, color: 'green' },
  { id: 'ecommerce', name: 'E-commerce', icon: FiShoppingBag, color: 'yellow' },
  { id: 'thanks', name: 'Agradecimiento', icon: FiHeart, color: 'pink' },
  { id: 'portfolio', name: 'Portfolio', icon: FiCamera, color: 'indigo' },
  { id: 'blog', name: 'Blog', icon: FiBookOpen, color: 'cyan' },
  { id: 'event', name: 'Eventos', icon: FiCalendar, color: 'orange' },
  { id: 'service', name: 'Servicios', icon: FiTool, color: 'teal' },
  { id: 'restaurant', name: 'Restaurantes', icon: FiCoffee, color: 'amber' }
];

// Función helper para generar IDs únicos
const generateId = (prefix = 'element') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Plantillas completas con estructuras detalladas
export const TEMPLATE_LIBRARY = [
  // === LANDING PAGES ===
  {
    id: 1,
    name: 'Landing Corporativa Pro',
    category: 'landing',
    description: 'Landing page profesional completa con hero, características, testimonios y CTA',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 2456,
    rating: 4.9,
    tags: ['corporativo', 'landing', 'empresa', 'hero', 'testimonios'],
    isFeatured: true,
    elements: [
      // Header/Navigation
      {
        id: generateId('header'),
        type: 'container',
        props: {
          backgroundColor: '#ffffff',
          padding: '20px 40px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: '0',
          zIndex: '1000',
          children: [
            {
              id: generateId('logo'),
              type: 'text',
              props: {
                content: 'Logo',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937'
              }
            },
            {
              id: generateId('nav'),
              type: 'container',
              props: {
                display: 'flex',
                gap: '30px',
                children: [
                  { id: generateId('nav-1'), type: 'text', props: { content: 'Inicio', color: '#6b7280' } },
                  { id: generateId('nav-2'), type: 'text', props: { content: 'Servicios', color: '#6b7280' } },
                  { id: generateId('nav-3'), type: 'text', props: { content: 'Contacto', color: '#6b7280' } }
                ]
              }
            }
          ]
        }
      },
      // Hero Section
      {
        id: generateId('hero'),
        type: 'container',
        props: {
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '100px 40px',
          textAlign: 'center',
          color: 'white',
          children: [
            {
              id: generateId('hero-title'),
              type: 'heading',
              props: {
                content: 'Impulsa tu Negocio al Siguiente Nivel',
                level: 'h1',
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center'
              }
            },
            {
              id: generateId('hero-subtitle'),
              type: 'text',
              props: {
                content: 'Soluciones profesionales diseñadas para empresas que buscan destacar en su industria',
                fontSize: '20px',
                marginBottom: '40px',
                opacity: '0.9',
                maxWidth: '600px',
                margin: '0 auto 40px auto'
              }
            },
            {
              id: generateId('hero-cta'),
              type: 'button',
              props: {
                content: 'Comenzar Ahora',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'semibold',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }
            }
          ]
        }
      },
      // Features Section
      {
        id: generateId('features'),
        type: 'container',
        props: {
          padding: '80px 40px',
          backgroundColor: '#f9fafb',
          children: [
            {
              id: generateId('features-title'),
              type: 'heading',
              props: {
                content: 'Características Destacadas',
                level: 'h2',
                fontSize: '36px',
                textAlign: 'center',
                marginBottom: '60px',
                color: '#1f2937'
              }
            },
            {
              id: generateId('features-grid'),
              type: 'container',
              props: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto',
                children: [
                  {
                    id: generateId('feature-1'),
                    type: 'container',
                    props: {
                      backgroundColor: 'white',
                      padding: '40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      textAlign: 'center',
                      children: [
                        {
                          id: generateId('feature-1-title'),
                          type: 'heading',
                          props: {
                            content: 'Diseño Profesional',
                            level: 'h3',
                            fontSize: '24px',
                            marginBottom: '16px',
                            color: '#1f2937'
                          }
                        },
                        {
                          id: generateId('feature-1-desc'),
                          type: 'text',
                          props: {
                            content: 'Interfaces modernas y atractivas que captarán la atención de tus clientes',
                            color: '#6b7280',
                            lineHeight: '1.6'
                          }
                        }
                      ]
                    }
                  },
                  {
                    id: generateId('feature-2'),
                    type: 'container',
                    props: {
                      backgroundColor: 'white',
                      padding: '40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      textAlign: 'center',
                      children: [
                        {
                          id: generateId('feature-2-title'),
                          type: 'heading',
                          props: {
                            content: 'Optimización SEO',
                            level: 'h3',
                            fontSize: '24px',
                            marginBottom: '16px',
                            color: '#1f2937'
                          }
                        },
                        {
                          id: generateId('feature-2-desc'),
                          type: 'text',
                          props: {
                            content: 'Mejora tu posicionamiento en buscadores con nuestras técnicas avanzadas',
                            color: '#6b7280',
                            lineHeight: '1.6'
                          }
                        }
                      ]
                    }
                  },
                  {
                    id: generateId('feature-3'),
                    type: 'container',
                    props: {
                      backgroundColor: 'white',
                      padding: '40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      textAlign: 'center',
                      children: [
                        {
                          id: generateId('feature-3-title'),
                          type: 'heading',
                          props: {
                            content: 'Soporte 24/7',
                            level: 'h3',
                            fontSize: '24px',
                            marginBottom: '16px',
                            color: '#1f2937'
                          }
                        },
                        {
                          id: generateId('feature-3-desc'),
                          type: 'text',
                          props: {
                            content: 'Asistencia continua para garantizar el éxito de tu proyecto',
                            color: '#6b7280',
                            lineHeight: '1.6'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  
  // === WEBINAR ===
  {
    id: 2,
    name: 'Webinar Convertidor',
    category: 'webinar',
    description: 'Página de registro para webinar con countdown y formulario optimizado',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 1834,
    rating: 4.8,
    tags: ['webinar', 'evento', 'registro', 'countdown', 'formulario'],
    isFeatured: true,
    elements: [
      {
        id: generateId('webinar-hero'),
        type: 'container',
        props: {
          backgroundColor: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white',
          children: [
            {
              id: generateId('webinar-badge'),
              type: 'text',
              props: {
                content: '🔴 WEBINAR EN VIVO',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }
            },
            {
              id: generateId('webinar-title'),
              type: 'heading',
              props: {
                content: 'Cómo Generar $10K al Mes con Marketing Digital',
                level: 'h1',
                fontSize: '42px',
                fontWeight: 'bold',
                marginBottom: '20px',
                lineHeight: '1.2'
              }
            },
            {
              id: generateId('webinar-subtitle'),
              type: 'text',
              props: {
                content: 'Masterclass exclusiva donde te revelaré la estrategia exacta que uso',
                fontSize: '20px',
                marginBottom: '40px',
                opacity: '0.9'
              }
            },
            {
              id: generateId('webinar-date'),
              type: 'text',
              props: {
                content: '📅 Martes 15 de Octubre - 8:00 PM (Horario México)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '15px 25px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'semibold'
              }
            }
          ]
        }
      }
    ]
  },

  // === VSL (Video Sales Letter) ===
  {
    id: 3,
    name: 'VSL Ultra Convertidor',
    category: 'vsl',
    description: 'Video Sales Letter optimizada para máxima conversión con elementos persuasivos',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 1245,
    rating: 4.9,
    tags: ['vsl', 'ventas', 'conversión', 'video', 'persuasión'],
    elements: [
      {
        id: generateId('vsl-container'),
        type: 'container',
        props: {
          backgroundColor: '#000000',
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '100vh',
          children: [
            {
              id: generateId('vsl-headline'),
              type: 'heading',
              props: {
                content: 'Descubre el Sistema que me Genera $50K al Mes',
                level: 'h1',
                color: '#ff6b6b',
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '30px'
              }
            },
            {
              id: generateId('vsl-video-placeholder'),
              type: 'container',
              props: {
                backgroundColor: '#1a1a1a',
                width: '800px',
                height: '450px',
                margin: '0 auto 40px auto',
                borderRadius: '12px',
                border: '3px solid #ff6b6b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                children: [
                  {
                    id: generateId('play-button'),
                    type: 'text',
                    props: {
                      content: '▶ REPRODUCIR VIDEO',
                      color: '#ff6b6b',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },

  // === E-COMMERCE ===
  {
    id: 4,
    name: 'Tienda Online Moderna',
    category: 'ecommerce',
    description: 'Página de producto e-commerce con galería, reviews y checkout optimizado',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 987,
    rating: 4.7,
    tags: ['ecommerce', 'producto', 'tienda', 'checkout', 'reviews'],
    elements: [
      {
        id: generateId('product-header'),
        type: 'container',
        props: {
          backgroundColor: '#ffffff',
          padding: '20px 40px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          children: [
            {
              id: generateId('store-logo'),
              type: 'text',
              props: {
                content: 'Mi Tienda',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1f2937'
              }
            },
            {
              id: generateId('cart-icon'),
              type: 'text',
              props: {
                content: '🛒 (2)',
                fontSize: '18px',
                color: '#6b7280'
              }
            }
          ]
        }
      }
    ]
  },

  // === PORTFOLIO ===
  {
    id: 5,
    name: 'Portfolio Creativo',
    category: 'portfolio',
    description: 'Portfolio moderno para creativos y freelancers con galería y contacto',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 756,
    rating: 4.8,
    tags: ['portfolio', 'creativo', 'freelancer', 'galería', 'moderno'],
    elements: [
      {
        id: generateId('portfolio-hero'),
        type: 'container',
        props: {
          backgroundColor: '#f8fafc',
          padding: '100px 40px',
          textAlign: 'center',
          children: [
            {
              id: generateId('portfolio-name'),
              type: 'heading',
              props: {
                content: 'Juan Pérez',
                level: 'h1',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1a202c',
                marginBottom: '10px'
              }
            },
            {
              id: generateId('portfolio-role'),
              type: 'text',
              props: {
                content: 'Diseñador Gráfico & Desarrollador Web',
                fontSize: '24px',
                color: '#4a5568',
                marginBottom: '30px'
              }
            },
            {
              id: generateId('portfolio-cta'),
              type: 'button',
              props: {
                content: 'Ver mi Trabajo',
                backgroundColor: '#3182ce',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px'
              }
            }
          ]
        }
      }
    ]
  },

  // === BLOG ===
  {
    id: 6,
    name: 'Blog Profesional',
    category: 'blog',
    description: 'Página de blog con diseño limpio, categorías y barra lateral',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 623,
    rating: 4.6,
    tags: ['blog', 'contenido', 'artículos', 'profesional', 'categorías'],
    elements: [
      {
        id: generateId('blog-header'),
        type: 'container',
        props: {
          backgroundColor: '#ffffff',
          padding: '30px 40px',
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
          children: [
            {
              id: generateId('blog-title'),
              type: 'heading',
              props: {
                content: 'Mi Blog Personal',
                level: 'h1',
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#2d3748'
              }
            },
            {
              id: generateId('blog-subtitle'),
              type: 'text',
              props: {
                content: 'Reflexiones sobre tecnología, diseño y vida',
                fontSize: '18px',
                color: '#718096',
                marginTop: '10px'
              }
            }
          ]
        }
      }
    ]
  },

  // === SERVICIOS ===
  {
    id: 7,
    name: 'Página de Servicios',
    category: 'service',
    description: 'Página profesional de servicios con precios y comparación de planes',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 892,
    rating: 4.7,
    tags: ['servicios', 'precios', 'planes', 'profesional', 'comparación'],
    elements: [
      {
        id: generateId('services-hero'),
        type: 'container',
        props: {
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 40px',
          textAlign: 'center',
          color: 'white',
          children: [
            {
              id: generateId('services-title'),
              type: 'heading',
              props: {
                content: 'Nuestros Servicios',
                level: 'h1',
                fontSize: '44px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }
            },
            {
              id: generateId('services-subtitle'),
              type: 'text',
              props: {
                content: 'Soluciones personalizadas para hacer crecer tu negocio',
                fontSize: '22px',
                opacity: '0.9'
              }
            }
          ]
        }
      }
    ]
  },

  // === EVENTOS ===
  {
    id: 8,
    name: 'Página de Evento',
    category: 'event',
    description: 'Página para eventos con información, agenda y registro de asistentes',
    thumbnail: '/api/placeholder/400/300',
    author: 'Aurelio Team',
    downloads: 445,
    rating: 4.9,
    tags: ['evento', 'conferencia', 'agenda', 'registro', 'asistentes'],
    elements: [
      {
        id: generateId('event-hero'),
        type: 'container',
        props: {
          backgroundColor: '#1a202c',
          padding: '100px 40px',
          textAlign: 'center',
          color: 'white',
          children: [
            {
              id: generateId('event-date'),
              type: 'text',
              props: {
                content: '15-16 DICIEMBRE 2024',
                fontSize: '16px',
                color: '#f59e0b',
                fontWeight: 'bold',
                marginBottom: '20px'
              }
            },
            {
              id: generateId('event-title'),
              type: 'heading',
              props: {
                content: 'Conferencia de Innovación Digital',
                level: 'h1',
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }
            },
            {
              id: generateId('event-location'),
              type: 'text',
              props: {
                content: '📍 Centro de Convenciones, Ciudad de México',
                fontSize: '18px',
                opacity: '0.8'
              }
            }
          ]
        }
      }
    ]
  }
];

// Función para obtener plantillas por categoría
export const getTemplatesByCategory = (categoryId) => {
  if (categoryId === 'all') {
    return TEMPLATE_LIBRARY;
  }
  return TEMPLATE_LIBRARY.filter(template => template.category === categoryId);
};

// Función para buscar plantillas
export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return TEMPLATE_LIBRARY.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Función para obtener plantillas destacadas
export const getFeaturedTemplates = () => {
  return TEMPLATE_LIBRARY.filter(template => template.isFeatured);
};

export default TEMPLATE_LIBRARY;