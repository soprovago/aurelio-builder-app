/**
 * Template Service
 * Servicio para gestionar plantillas y categorías desde API
 */

// Simulación de API - en producción serían endpoints reales
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Clase para manejar errores de API
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Función helper para hacer requests
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status,
        await response.json().catch(() => ({}))
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error', 0, { originalError: error.message });
  }
};

// Simulación de datos para desarrollo (reemplazar con API real)
const mockCategories = [
  { id: 'all', name: 'Todas', icon: 'FiGrid', color: 'gray', count: 8 },
  { id: 'landing', name: 'Landing Pages', icon: 'FiGlobe', color: 'blue', count: 3 },
  { id: 'webinar', name: 'Webinar', icon: 'FiPlay', color: 'red', count: 2 },
  { id: 'vsl', name: 'VSL', icon: 'FiMonitor', color: 'purple', count: 1 },
  { id: 'capture', name: 'Captura', icon: 'FiMail', color: 'green', count: 1 },
  { id: 'ecommerce', name: 'E-commerce', icon: 'FiShoppingBag', color: 'yellow', count: 2 },
  { id: 'thanks', name: 'Agradecimiento', icon: 'FiHeart', color: 'pink', count: 1 },
  { id: 'portfolio', name: 'Portfolio', icon: 'FiCamera', color: 'indigo', count: 1 },
  { id: 'blog', name: 'Blog', icon: 'FiBookOpen', color: 'cyan', count: 1 },
  { id: 'event', name: 'Eventos', icon: 'FiCalendar', color: 'orange', count: 1 },
  { id: 'service', name: 'Servicios', icon: 'FiTool', color: 'teal', count: 1 },
  { id: 'restaurant', name: 'Restaurantes', icon: 'FiCoffee', color: 'amber', count: 0 }
];

// Cache simple para evitar múltiples requests
const cache = {
  categories: null,
  templates: null,
  lastCategoriesUpdate: null,
  lastTemplatesUpdate: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};

const templateService = {
  // Obtener todas las categorías
  async getCategories(forceRefresh = false) {
    const now = Date.now();
    
    // Verificar cache
    if (
      !forceRefresh && 
      cache.categories && 
      cache.lastCategoriesUpdate &&
      (now - cache.lastCategoriesUpdate) < cache.CACHE_DURATION
    ) {
      return cache.categories;
    }

    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        cache.categories = mockCategories;
        cache.lastCategoriesUpdate = now;
        return mockCategories;
      }

      // En producción, hacer request real
      const data = await makeRequest('/categories');
      cache.categories = data;
      cache.lastCategoriesUpdate = now;
      return data;
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Fallback a datos estáticos si hay error de red
      if (cache.categories) {
        return cache.categories;
      }
      
      // Último fallback
      return mockCategories;
    }
  },

  // Obtener plantillas por categoría
  async getTemplatesByCategory(categoryId, page = 1, limit = 20) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Simular delay y paginación
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Importar datos de plantillas locales
        const { getTemplatesByCategory } = await import('../data/templateLibrary');
        const allTemplates = getTemplatesByCategory(categoryId);
        
        // Simular paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTemplates = allTemplates.slice(startIndex, endIndex);
        
        return {
          templates: paginatedTemplates,
          pagination: {
            page,
            limit,
            total: allTemplates.length,
            totalPages: Math.ceil(allTemplates.length / limit),
            hasNext: endIndex < allTemplates.length,
            hasPrev: page > 1
          }
        };
      }

      const data = await makeRequest(`/templates?category=${categoryId}&page=${page}&limit=${limit}`);
      return data;
      
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      throw error;
    }
  },

  // Buscar plantillas
  async searchTemplates(query, filters = {}) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const { searchTemplates } = await import('../data/templateLibrary');
        const results = searchTemplates(query);
        
        return {
          templates: results,
          query,
          totalResults: results.length,
          suggestions: results.length === 0 ? ['landing', 'webinar', 'ecommerce'] : []
        };
      }

      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      
      const data = await makeRequest(`/templates/search?${params}`);
      return data;
      
    } catch (error) {
      console.error('Error searching templates:', error);
      throw error;
    }
  },

  // Obtener plantillas destacadas
  async getFeaturedTemplates() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { getFeaturedTemplates } = await import('../data/templateLibrary');
        return getFeaturedTemplates();
      }

      const data = await makeRequest('/templates/featured');
      return data;
      
    } catch (error) {
      console.error('Error fetching featured templates:', error);
      throw error;
    }
  },

  // Obtener detalles de una plantilla específica
  async getTemplate(templateId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { TEMPLATE_LIBRARY } = await import('../data/templateLibrary');
        const template = TEMPLATE_LIBRARY.find(t => t.id === parseInt(templateId));
        
        if (!template) {
          throw new APIError('Template not found', 404);
        }
        
        return template;
      }

      const data = await makeRequest(`/templates/${templateId}`);
      return data;
      
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Incrementar contador de descargas
  async recordTemplateDownload(templateId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // En desarrollo, solo loggear
        console.log(`📊 Template ${templateId} downloaded`);
        return { success: true };
      }

      const data = await makeRequest(`/templates/${templateId}/download`, {
        method: 'POST'
      });
      
      return data;
      
    } catch (error) {
      console.error('Error recording template download:', error);
      // No es crítico si esto falla
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas de categorías
  async getCategoryStats() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        return mockCategories.reduce((stats, category) => {
          if (category.id !== 'all') {
            stats[category.id] = {
              count: category.count,
              popularityScore: Math.random() * 100
            };
          }
          return stats;
        }, {});
      }

      const data = await makeRequest('/analytics/categories');
      return data;
      
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return {};
    }
  },

  // Limpiar cache manualmente
  clearCache() {
    cache.categories = null;
    cache.templates = null;
    cache.lastCategoriesUpdate = null;
    cache.lastTemplatesUpdate = null;
  },

  // Verificar conectividad de API
  async healthCheck() {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { status: 'ok', mode: 'development' };
      }

      const data = await makeRequest('/health');
      return data;
      
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
};

export default templateService;
export { APIError };