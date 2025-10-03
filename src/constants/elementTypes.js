/**
 * Tipos de elementos disponibles en Aurelio Builder
 * 
 * @description Define todos los tipos de widgets/elementos que pueden ser utilizados
 * en el editor visual. Cada tipo corresponde a un widget específico con sus
 * propias características de renderizado y propiedades.
 */

export const ELEMENT_TYPES = {
  // Elementos de layout
  CONTAINER: 'container',
  SECTION: 'section',
  COLUMNS: 'columns',
  SPACER: 'spacer',

  // Elementos de contenido
  HEADING: 'heading',
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',

  // Elementos interactivos
  BUTTON: 'button',
  FORM: 'form',

  // Widgets avanzados (futuros)
  CARD: 'card',
  LIST: 'list',
  TESTIMONIAL: 'testimonial',
  COUNTDOWN: 'countdown',
  SOCIAL_MEDIA: 'social_media',
  STATS: 'stats',
  PRICING: 'pricing',
  FAQ: 'faq',
  HERO: 'hero',
  PROGRESS: 'progress'
};

/**
 * Categorías de widgets para organización del panel
 */
export const WIDGET_CATEGORIES = {
  BASIC: 'basic',
  LAYOUT: 'layout', 
  CONTENT: 'content',
  INTERACTIVE: 'interactive',
  MARKETING: 'marketing',
  ADVANCED: 'advanced'
};

/**
 * Mapeo de elementos a categorías
 */
export const ELEMENT_CATEGORY_MAP = {
  [ELEMENT_TYPES.CONTAINER]: WIDGET_CATEGORIES.LAYOUT,
  [ELEMENT_TYPES.SECTION]: WIDGET_CATEGORIES.LAYOUT,
  [ELEMENT_TYPES.COLUMNS]: WIDGET_CATEGORIES.LAYOUT,
  [ELEMENT_TYPES.SPACER]: WIDGET_CATEGORIES.LAYOUT,
  
  [ELEMENT_TYPES.HEADING]: WIDGET_CATEGORIES.BASIC,
  [ELEMENT_TYPES.TEXT]: WIDGET_CATEGORIES.BASIC,
  [ELEMENT_TYPES.IMAGE]: WIDGET_CATEGORIES.CONTENT,
  [ELEMENT_TYPES.VIDEO]: WIDGET_CATEGORIES.CONTENT,
  
  [ELEMENT_TYPES.BUTTON]: WIDGET_CATEGORIES.INTERACTIVE,
  [ELEMENT_TYPES.FORM]: WIDGET_CATEGORIES.INTERACTIVE,
  
  [ELEMENT_TYPES.CARD]: WIDGET_CATEGORIES.CONTENT,
  [ELEMENT_TYPES.LIST]: WIDGET_CATEGORIES.CONTENT,
  [ELEMENT_TYPES.TESTIMONIAL]: WIDGET_CATEGORIES.MARKETING,
  [ELEMENT_TYPES.COUNTDOWN]: WIDGET_CATEGORIES.MARKETING,
  [ELEMENT_TYPES.SOCIAL_MEDIA]: WIDGET_CATEGORIES.MARKETING,
  [ELEMENT_TYPES.STATS]: WIDGET_CATEGORIES.MARKETING,
  [ELEMENT_TYPES.PRICING]: WIDGET_CATEGORIES.MARKETING,
  [ELEMENT_TYPES.FAQ]: WIDGET_CATEGORIES.INTERACTIVE,
  [ELEMENT_TYPES.HERO]: WIDGET_CATEGORIES.CONTENT,
  [ELEMENT_TYPES.PROGRESS]: WIDGET_CATEGORIES.CONTENT
};

/**
 * Obtener la categoría de un elemento
 * @param {string} elementType - Tipo del elemento
 * @returns {string} Categoría del elemento
 */
export const getElementCategory = (elementType) => {
  return ELEMENT_CATEGORY_MAP[elementType] || WIDGET_CATEGORIES.BASIC;
};

/**
 * Obtener elementos por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Array<string>} Array de tipos de elementos en la categoría
 */
export const getElementsByCategory = (category) => {
  return Object.keys(ELEMENT_CATEGORY_MAP).filter(
    elementType => ELEMENT_CATEGORY_MAP[elementType] === category
  );
};