import { ELEMENT_TYPES } from '../../../constants/elementTypes';

/**
 * Plantillas predefinidas para contenedores con layouts comunes
 * Cada plantilla incluye configuraciones de flexbox y elementos iniciales
 */

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const CONTAINER_TEMPLATES = {
  CARD: {
    id: 'card-template',
    name: 'Card',
    description: 'Tarjeta con imagen, título y texto',
    icon: '🎴',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: '12px',
        padding: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        minHeight: '300px',
        children: [
          {
            id: `image-${generateId()}`,
            type: ELEMENT_TYPES.IMAGE,
            props: {
              src: '/api/placeholder/300/200',
              alt: 'Card image',
              width: '100%',
              height: '200px',
              borderRadius: '8px'
            }
          },
          {
            id: `heading-${generateId()}`,
            type: ELEMENT_TYPES.HEADING,
            props: {
              text: 'Título de la tarjeta',
              level: 2,
              fontSize: '24px',
              color: '#1f2937',
              alignment: 'left'
            }
          },
          {
            id: `text-${generateId()}`,
            type: ELEMENT_TYPES.TEXT,
            props: {
              text: 'Descripción de la tarjeta. Aquí puedes agregar más detalles sobre el contenido.',
              fontSize: '16px',
              color: '#6b7280',
              alignment: 'left'
            }
          },
          {
            id: `button-${generateId()}`,
            type: ELEMENT_TYPES.BUTTON,
            props: {
              text: 'Leer más',
              backgroundColor: '#8b5cf6',
              textColor: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px'
            }
          }
        ]
      }
    }
  },

  HERO_SECTION: {
    id: 'hero-template',
    name: 'Hero Section',
    description: 'Sección hero con título, subtítulo y botón',
    icon: '🦸',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '80px 40px',
        backgroundColor: '#f8fafc',
        minHeight: '400px',
        children: [
          {
            id: `heading-${generateId()}`,
            type: ELEMENT_TYPES.HEADING,
            props: {
              text: 'Bienvenido a Nuestro Sitio',
              level: 1,
              fontSize: '48px',
              color: '#1f2937',
              alignment: 'center'
            }
          },
          {
            id: `text-${generateId()}`,
            type: ELEMENT_TYPES.TEXT,
            props: {
              text: 'Descubre todo lo que tenemos para ofrecerte. Una experiencia única te espera.',
              fontSize: '20px',
              color: '#6b7280',
              alignment: 'center'
            }
          },
          {
            id: `button-${generateId()}`,
            type: ELEMENT_TYPES.BUTTON,
            props: {
              text: 'Empezar Ahora',
              backgroundColor: '#8b5cf6',
              textColor: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px'
            }
          }
        ]
      }
    }
  },

  TWO_COLUMNS: {
    id: 'two-columns-template',
    name: 'Dos Contenedores',
    description: 'Layout de dos contenedores con contenido',
    icon: '📰',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: '32px',
        padding: '40px',
        backgroundColor: '#ffffff',
        minHeight: '300px',
        children: [
          {
            id: `container-left-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: '16px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              minHeight: '200px',
              children: [
                {
                  id: `heading-${generateId()}`,
                  type: ELEMENT_TYPES.HEADING,
                  props: {
                    text: 'Contenedor Izquierdo',
                    level: 3,
                    fontSize: '20px',
                    color: '#1f2937',
                    alignment: 'left'
                  }
                },
                {
                  id: `text-${generateId()}`,
                  type: ELEMENT_TYPES.TEXT,
                  props: {
                    text: 'Contenido de la primera columna.',
                    fontSize: '16px',
                    color: '#4b5563',
                    alignment: 'left'
                  }
                }
              ]
            }
          },
          {
            id: `container-right-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: '16px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              minHeight: '200px',
              children: [
                {
                  id: `heading-${generateId()}`,
                  type: ELEMENT_TYPES.HEADING,
                  props: {
                    text: 'Contenedor Derecho',
                    level: 3,
                    fontSize: '20px',
                    color: '#1f2937',
                    alignment: 'left'
                  }
                },
                {
                  id: `text-${generateId()}`,
                  type: ELEMENT_TYPES.TEXT,
                  props: {
                    text: 'Contenido de la segunda columna.',
                    fontSize: '16px',
                    color: '#4b5563',
                    alignment: 'left'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  },

  THREE_COLUMNS: {
    id: 'three-columns-template',
    name: 'Tres Contenedores',
    description: 'Layout de tres contenedores para grid de contenido',
    icon: '🏦️',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '40px',
        backgroundColor: '#ffffff',
        minHeight: '300px',
        children: [
          {
            id: `container-1-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              minHeight: '280px',
              children: [
                {
                  id: `heading-${generateId()}`,
                  type: ELEMENT_TYPES.HEADING,
                  props: {
                    text: 'Contenedor 1',
                    level: 4,
                    fontSize: '18px',
                    color: '#1f2937',
                    alignment: 'center'
                  }
                },
                {
                  id: `text-${generateId()}`,
                  type: ELEMENT_TYPES.TEXT,
                  props: {
                    text: 'Primer contenedor de contenido. Aquí puedes agregar más información relevante.',
                    fontSize: '15px',
                    color: '#6b7280',
                    alignment: 'center'
                  }
                },
                {
                  id: `button-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Ver más',
                    backgroundColor: '#8b5cf6',
                    textColor: '#ffffff',
                    backgroundColorHover: '#7c3aed',
                    textColorHover: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    href: '#',
                    target: '_self',
                    buttonType: 'button',
                    disabled: false,
                    alignSelf: 'center',
                    ariaLabel: 'Ver más información'
                  }
                }
              ]
            }
          },
          {
            id: `container-2-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              minHeight: '280px',
              children: [
                {
                  id: `heading-${generateId()}`,
                  type: ELEMENT_TYPES.HEADING,
                  props: {
                    text: 'Contenedor 2',
                    level: 4,
                    fontSize: '18px',
                    color: '#1f2937',
                    alignment: 'center'
                  }
                },
                {
                  id: `text-${generateId()}`,
                  type: ELEMENT_TYPES.TEXT,
                  props: {
                    text: 'Segundo contenedor de contenido. Aquí puedes agregar más información relevante.',
                    fontSize: '15px',
                    color: '#6b7280',
                    alignment: 'center'
                  }
                },
                {
                  id: `button-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Enlace externo',
                    backgroundColor: '#10b981',
                    textColor: '#ffffff',
                    backgroundColorHover: '#059669',
                    textColorHover: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    href: 'https://ejemplo.com',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    buttonType: 'button',
                    disabled: false,
                    alignSelf: 'center',
                    ariaLabel: 'Abrir enlace externo'
                  }
                }
              ]
            }
          },
          {
            id: `container-3-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              minHeight: '280px',
              children: [
                {
                  id: `heading-${generateId()}`,
                  type: ELEMENT_TYPES.HEADING,
                  props: {
                    text: 'Contenedor 3',
                    level: 4,
                    fontSize: '18px',
                    color: '#1f2937',
                    alignment: 'center'
                  }
                },
                {
                  id: `text-${generateId()}`,
                  type: ELEMENT_TYPES.TEXT,
                  props: {
                    text: 'Tercer contenedor de contenido. Aquí puedes agregar más información relevante.',
                    fontSize: '15px',
                    color: '#6b7280',
                    alignment: 'center'
                  }
                },
                {
                  id: `button-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Botón outline',
                    backgroundColor: 'transparent',
                    textColor: '#8b5cf6',
                    backgroundColorHover: '#8b5cf6',
                    textColorHover: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    border: '2px solid #8b5cf6',
                    href: '#',
                    target: '_self',
                    buttonType: 'button',
                    disabled: false,
                    alignSelf: 'center',
                    ariaLabel: 'Botón con borde'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  },

  HEADER_LAYOUT: {
    id: 'header-template',
    name: 'Header/Navegación',
    description: 'Header con logo y navegación',
    icon: '🧭',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        padding: '16px 40px',
        backgroundColor: '#ffffff',
        border: 'none',
        borderRadius: '0px',
        minHeight: '80px',
        children: [
          {
            id: `logo-${generateId()}`,
            type: ELEMENT_TYPES.HEADING,
            props: {
              text: 'Mi Logo',
              level: 2,
              fontSize: '24px',
              color: '#1f2937',
              alignment: 'left'
            }
          },
          {
            id: `nav-container-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '16px',
              padding: '0px',
              backgroundColor: 'transparent',
              minHeight: 'auto',
              children: [
                {
                  id: `button-1-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Inicio',
                    backgroundColor: 'transparent',
                    textColor: '#4b5563',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }
                },
                {
                  id: `button-2-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Servicios',
                    backgroundColor: 'transparent',
                    textColor: '#4b5563',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }
                },
                {
                  id: `button-3-${generateId()}`,
                  type: ELEMENT_TYPES.BUTTON,
                  props: {
                    text: 'Contacto',
                    backgroundColor: '#8b5cf6',
                    textColor: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  },

  FOOTER_LAYOUT: {
    id: 'footer-template',
    name: 'Footer',
    description: 'Footer con información y enlaces',
    icon: '🦶',
    template: {
      type: ELEMENT_TYPES.CONTAINER,
      props: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '40px',
        backgroundColor: '#1f2937',
        minHeight: '200px',
        children: [
          {
            id: `footer-content-${generateId()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              gap: '32px',
              padding: '0px',
              backgroundColor: 'transparent',
              minHeight: 'auto',
              children: [
                {
                  id: `footer-section-1-${generateId()}`,
                  type: ELEMENT_TYPES.CONTAINER,
                  props: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: '8px',
                    padding: '0px',
                    backgroundColor: 'transparent',
                    minHeight: 'auto',
                    children: [
                      {
                        id: `heading-${generateId()}`,
                        type: ELEMENT_TYPES.HEADING,
                        props: {
                          text: 'Empresa',
                          level: 4,
                          fontSize: '16px',
                          color: '#ffffff',
                          alignment: 'left'
                        }
                      },
                      {
                        id: `text-${generateId()}`,
                        type: ELEMENT_TYPES.TEXT,
                        props: {
                          text: 'Sobre nosotros\nServicios\nContacto',
                          fontSize: '14px',
                          color: '#9ca3af',
                          alignment: 'left'
                        }
                      }
                    ]
                  }
                },
                {
                  id: `footer-section-2-${generateId()}`,
                  type: ELEMENT_TYPES.CONTAINER,
                  props: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: '8px',
                    padding: '0px',
                    backgroundColor: 'transparent',
                    minHeight: 'auto',
                    children: [
                      {
                        id: `heading-${generateId()}`,
                        type: ELEMENT_TYPES.HEADING,
                        props: {
                          text: 'Soporte',
                          level: 4,
                          fontSize: '16px',
                          color: '#ffffff',
                          alignment: 'left'
                        }
                      },
                      {
                        id: `text-${generateId()}`,
                        type: ELEMENT_TYPES.TEXT,
                        props: {
                          text: 'Ayuda\nPreguntas frecuentes\nDocumentación',
                          fontSize: '14px',
                          color: '#9ca3af',
                          alignment: 'left'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            id: `copyright-${generateId()}`,
            type: ELEMENT_TYPES.TEXT,
            props: {
              text: '© 2024 Mi Empresa. Todos los derechos reservados.',
              fontSize: '12px',
              color: '#6b7280',
              alignment: 'center'
            }
          }
        ]
      }
    }
  }
};

/**
 * Obtener todas las plantillas disponibles
 */
export const getContainerTemplates = () => {
  return Object.values(CONTAINER_TEMPLATES);
};

/**
 * Obtener una plantilla específica por ID
 */
export const getTemplateById = (templateId) => {
  return Object.values(CONTAINER_TEMPLATES).find(template => template.id === templateId);
};

/**
 * Crear un nuevo contenedor basado en una plantilla
 * Regenera los IDs para evitar duplicados
 */
export const createFromTemplate = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  const regenerateIds = (element) => {
    const newElement = {
      ...element,
      id: `${element.type}-${generateId()}`
    };

    if (element.props?.children) {
      newElement.props = {
        ...element.props,
        children: element.props.children.map(child => regenerateIds(child))
      };
    }

    return newElement;
  };

  return regenerateIds(template.template);
};

export default CONTAINER_TEMPLATES;