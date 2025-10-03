/**
 * Template Library Modal Component
 * Modal para seleccionar plantillas de la biblioteca
 */

import React, { useState } from 'react';
import { 
  FiX, 
  FiEye, 
  FiDownload, 
  FiSearch,
  FiStar,
  FiHeart,
  FiGrid,
  FiFileText
} from 'react-icons/fi';

// Importar la biblioteca expandida de plantillas
import { 
  TEMPLATE_LIBRARY, 
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  searchTemplates,
  getFeaturedTemplates 
} from '../data/templateLibrary';

// Importar el modal de vista previa
import TemplatePreviewModal from './TemplatePreviewModal';

// Importar el hook de favoritos
import useFavoriteTemplates from '../hooks/useFavoriteTemplates';

function TemplateLibraryModal({ isOpen, onClose, onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  // Hook de favoritos
  const {
    isFavorite,
    toggleFavorite,
    getFavoriteTemplates,
    favoriteCount
  } = useFavoriteTemplates();

  if (!isOpen) return null;

  // Filtrar plantillas usando las nuevas utilidades
  let filteredTemplates;
  
  if (selectedCategory === 'favorites') {
    // Mostrar solo favoritos
    filteredTemplates = getFavoriteTemplates(TEMPLATE_LIBRARY);
    // Aplicar búsqueda si existe
    if (searchTerm) {
      const searchResults = searchTemplates(searchTerm);
      filteredTemplates = filteredTemplates.filter(template => 
        searchResults.some(result => result.id === template.id)
      );
    }
  } else {
    // Filtrado normal
    filteredTemplates = searchTerm 
      ? searchTemplates(searchTerm) 
      : getTemplatesByCategory(selectedCategory);
    
    // Si hay búsqueda y categoría seleccionada, filtrar adicionalmente por categoría
    if (searchTerm && selectedCategory !== 'all') {
      filteredTemplates = filteredTemplates.filter(template => template.category === selectedCategory);
    }
  }

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-xl shadow-2xl border border-[#2a2a2a] w-full max-w-7xl max-h-[90vh] mx-4 flex flex-col overflow-hidden">
        
        {/* Header con gradiente colorido */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-white">Biblioteca de Plantillas</h2>
              <p className="text-purple-100 text-sm">Elige una plantilla para comenzar tu proyecto</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Contenido principal con sidebar */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar de categorías */}
          <div className="w-80 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
            
            {/* Barra de búsqueda en sidebar */}
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                />
              </div>
            </div>
            
            {/* Lista de categorías */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                <span className="text-sm font-medium text-gray-300">Categorías</span>
              </div>
              
              <div className="space-y-2">
                {/* Botón Todas */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#8b5cf6] text-white'
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiGrid className="w-4 h-4" />
                    <span>Todas</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-[#2a2a2a] text-gray-400'
                  }`}>
                    {TEMPLATE_LIBRARY.length}
                  </span>
                </button>
                
                {/* Categorías principales */}
                {TEMPLATE_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => {
                  const IconComponent = category.icon;
                  const categoryCount = TEMPLATE_LIBRARY.filter(t => t.category === category.id).length;
                  
                  if (categoryCount === 0) return null;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-[#8b5cf6] text-white'
                          : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedCategory === category.id
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-[#2a2a2a] text-gray-400'
                      }`}>
                        {categoryCount}
                      </span>
                    </button>
                  );
                })}
                
                {/* Botón de Favoritos */}
                <button
                  onClick={() => setSelectedCategory('favorites')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'favorites'
                      ? 'bg-[#ff1b6d] text-white'
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiHeart className={`w-4 h-4 ${selectedCategory === 'favorites' ? 'fill-current' : ''}`} />
                    <span>Favoritos</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedCategory === 'favorites'
                      ? 'bg-[#e0195f] text-white'
                      : 'bg-[#2a2a2a] text-gray-400'
                  }`}>
                    {favoriteCount}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Área principal del grid */}
          <div className="flex-1 flex flex-col">
            
            {/* Header del contenido principal */}
            <div className="p-6 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <h3 className="text-lg font-semibold text-white">
                Mostrando {filteredTemplates.length} plantillas
                {selectedCategory !== 'all' && selectedCategory !== 'favorites' && 
                  ` en ${TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory)?.name}`
                }
                {selectedCategory === 'favorites' && ' en Favoritos'}
              </h3>
            </div>
            
            {/* Grid de plantillas */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0f0f0f]">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FiFileText className="w-16 h-16 mb-6 text-gray-600" />
                  <h3 className="text-xl font-medium mb-2 text-gray-300">No se encontraron plantillas</h3>
                  <p className="text-sm text-center max-w-sm text-gray-400">
                    {searchTerm 
                      ? `No hay plantillas que coincidan con "${searchTerm}"` 
                      : 'No hay plantillas disponibles en esta categoría'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-[#8b5cf6] hover:text-[#7c3aed] text-sm font-medium"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden hover:shadow-xl hover:border-[#3a3a3a] transition-all duration-300 cursor-pointer"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-[#2a2a2a] relative overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
                          }}
                        />
                        
                        {/* Overlay con acciones */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template);
                              }}
                              className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                            >
                              <FiEye className="w-4 h-4 inline mr-1" />
                              Vista Previa
                            </button>
                          </div>
                        </div>

                        {/* Botón de favorito */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(template.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                            isFavorite(template.id)
                              ? 'bg-[#ff1b6d] text-white shadow-lg'
                              : 'bg-[#1a1a1a]/80 backdrop-blur-sm text-gray-400 hover:bg-[#ff1b6d]/20 hover:text-[#ff1b6d]'
                          }`}
                          title={isFavorite(template.id) ? 'Remover de favoritos' : 'Agregar a favoritos'}
                        >
                          <FiHeart className={`w-4 h-4 ${
                            isFavorite(template.id) ? 'fill-current' : ''
                          }`} />
                        </button>
                      </div>
                      
                      {/* Información */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-[#8b5cf6] transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {template.description}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-[#2a2a2a] text-gray-300 text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer con estadísticas */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{template.author}</span>
                            <span>•</span>
                            <span>{template.downloads?.toLocaleString()} descargas</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-amber-500">
                            <FiStar className="w-3 h-3 fill-current" />
                            <span className="font-medium">{template.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal de vista previa avanzado */}
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelectTemplate={(template) => {
          handleSelectTemplate(template);
          setPreviewTemplate(null);
        }}
      />
    </div>
  );
}

export default TemplateLibraryModal;