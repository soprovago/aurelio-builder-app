import React, { useState } from 'react';
import { getContainerTemplates, createFromTemplate } from '../templates/containerTemplates';
import { FiPackage, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Panel de plantillas de contenedores
 * Permite seleccionar y agregar plantillas predefinidas de contenedores
 */
function ContainerTemplatesPanel({ onAddTemplate, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const templates = getContainerTemplates();

  const handleAddTemplate = (templateId) => {
    const containerElement = createFromTemplate(templateId);
    if (containerElement && onAddTemplate) {
      onAddTemplate({
        ...containerElement,
        name: `Template ${templateId}`,
        defaultProps: containerElement.props
      });
    }
  };

  return (
    <div className={`bg-[#1a1a1a] border-t border-[#2a2a2a] ${className}`}>
      {/* Header del panel */}
      <div 
        className="p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <FiPackage className="w-4 h-4 text-purple-400" />
          <h3 className="text-white font-medium text-sm">Plantillas de Contenedores</h3>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
            {templates.length}
          </span>
        </div>
        {isExpanded ? (
          <FiChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <FiChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-400 mb-3">
            Haz clic para agregar plantillas prediseñadas
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleAddTemplate(template.id)}
                className="group p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg cursor-pointer transition-all border border-transparent hover:border-purple-500/30"
              >
                <div className="flex items-start gap-3">
                  {/* Icono de la plantilla */}
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  
                  {/* Información de la plantilla */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                        {template.name}
                      </h4>
                      <FiPlus className="w-3 h-3 text-gray-400 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">
                      {template.description}
                    </p>
                    
                    {/* Preview de elementos incluidos */}
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-gray-500">Incluye:</span>
                      <div className="flex gap-1">
                        {template.template.props.children?.slice(0, 3).map((child, index) => (
                          <span 
                            key={index}
                            className="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded"
                          >
                            {child.type}
                          </span>
                        ))}
                        {template.template.props.children?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{template.template.props.children.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer con información */}
          <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
            <div className="text-xs text-gray-500 leading-relaxed">
              💡 Las plantillas incluyen elementos prediseñados con layouts profesionales. 
              Puedes personalizar todos los elementos después de agregarlos.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContainerTemplatesPanel;