/**
 * Canvas Template System Component
 * Sistema de plantillas y estructuras para el canvas vacío
 */

import React, { useState, useRef } from 'react';
import { 
  FiPlus, 
  FiFolder, 
  FiUpload, 
  FiGrid,
  FiX
} from 'react-icons/fi';
import TemplateLibraryModal from './TemplateLibraryModal';

function CanvasTemplateSystem({ 
  onAddContainerStructure, 
  onLoadTemplate, 
  onUploadTemplate,
  onToggleEasyLayout
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target.result);
          console.log('📁 Uploaded template:', template);
          onUploadTemplate(template);
        } catch (error) {
          console.error('❌ Error parsing JSON template:', error);
          alert('Error al leer el archivo JSON. Verifica que el formato sea correcto.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Por favor selecciona un archivo JSON válido.');
    }
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      {/* Tres iconos principales */}
      <div className="flex items-center justify-center gap-6 mb-6">
        
        {/* Icono de Easy Layout */}
        <div className="relative">
          <button
            onClick={onToggleEasyLayout}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-md transition-all duration-200 group min-w-[100px]"
            title="Easy Layout - Crear layouts rápidamente"
          >
            <FiGrid className="w-6 h-6 mb-3 text-gray-600 group-hover:text-purple-500 transition-colors" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
              Easy Layout
            </span>
          </button>
        </div>

        {/* Icono de Biblioteca */}
        <button
          onClick={() => setIsLibraryOpen(true)}
          className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-25 hover:shadow-md transition-all duration-200 group min-w-[100px]"
          title="Cargar plantilla de la biblioteca"
        >
          <FiFolder className="w-6 h-6 mb-3 text-gray-600 group-hover:text-blue-500 transition-colors" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
            Biblioteca
          </span>
        </button>

        {/* Icono de Subir JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-green-300 hover:bg-green-25 hover:shadow-md transition-all duration-200 group min-w-[100px]"
          title="Subir plantilla JSON"
        >
          <FiUpload className="w-6 h-6 mb-3 text-gray-600 group-hover:text-green-500 transition-colors" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
            Subir JSON
          </span>
        </button>
        
        {/* Input oculto para archivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>


      {/* Modal de biblioteca de plantillas */}
      <TemplateLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplate={(template) => {
          console.log('📚 Template selected from library:', template.name);
          onLoadTemplate(template);
          setIsLibraryOpen(false);
        }}
      />
    </div>
  );
}

export default CanvasTemplateSystem;