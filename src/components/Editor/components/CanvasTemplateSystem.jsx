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

// Tipos de estructuras de contenedores
const CONTAINER_STRUCTURES = {
  SINGLE: 'single',
  DOUBLE: 'double', 
  TRIPLE: 'triple'
};

function CanvasTemplateSystem({ 
  onAddContainerStructure, 
  onLoadTemplate, 
  onUploadTemplate 
}) {
  const [isStructuresOpen, setIsStructuresOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Función para crear contenedor único
  const createSingleContainer = () => {
    return {
      id: `container-single-${Date.now()}`,
      type: 'container',
      props: {
        width: '100%',
        height: 'auto',
        minHeight: '200px',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        border: '2px dashed #e2e8f0',
        padding: '40px 20px',
        margin: '0px 0px 20px 0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        children: []
      }
    };
  };

  // Función para crear dos contenedores lado a lado
  const createDoubleContainer = () => {
    return {
      id: `container-row-${Date.now()}`,
      type: 'container',
      props: {
        width: '100%',
        height: 'auto',
        minHeight: '200px',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        margin: '0px 0px 20px 0px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '20px',
        children: [
          {
            id: `container-left-${Date.now()}`,
            type: 'container',
            props: {
              width: '50%',
              height: 'auto',
              minHeight: '150px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: '2px dashed #e2e8f0',
              padding: '30px 15px',
              margin: '0px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              children: []
            }
          },
          {
            id: `container-right-${Date.now()}`,
            type: 'container',
            props: {
              width: '50%',
              height: 'auto',
              minHeight: '150px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: '2px dashed #e2e8f0',
              padding: '30px 15px',
              margin: '0px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              children: []
            }
          }
        ]
      }
    };
  };

  // Función para crear tres contenedores lado a lado
  const createTripleContainer = () => {
    return {
      id: `container-triple-${Date.now()}`,
      type: 'container',
      props: {
        width: '100%',
        height: 'auto',
        minHeight: '200px',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        margin: '0px 0px 20px 0px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '15px',
        children: [
          {
            id: `container-1-${Date.now()}`,
            type: 'container',
            props: {
              width: '33.33%',
              height: 'auto',
              minHeight: '150px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: '2px dashed #e2e8f0',
              padding: '25px 10px',
              margin: '0px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              children: []
            }
          },
          {
            id: `container-2-${Date.now() + 1}`,
            type: 'container',
            props: {
              width: '33.33%',
              height: 'auto',
              minHeight: '150px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: '2px dashed #e2e8f0',
              padding: '25px 10px',
              margin: '0px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              children: []
            }
          },
          {
            id: `container-3-${Date.now() + 2}`,
            type: 'container',
            props: {
              width: '33.33%',
              height: 'auto',
              minHeight: '150px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: '2px dashed #e2e8f0',
              padding: '25px 10px',
              margin: '0px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              children: []
            }
          }
        ]
      }
    };
  };

  const handleStructureClick = (structureType) => {
    let structure;
    switch (structureType) {
      case CONTAINER_STRUCTURES.SINGLE:
        structure = createSingleContainer();
        break;
      case CONTAINER_STRUCTURES.DOUBLE:
        structure = createDoubleContainer();
        break;
      case CONTAINER_STRUCTURES.TRIPLE:
        structure = createTripleContainer();
        break;
      default:
        return;
    }
    
    console.log('🏗️ Adding container structure:', structureType, structure);
    onAddContainerStructure(structure);
    setIsStructuresOpen(false); // Cerrar el panel después de seleccionar
  };

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
        
        {/* Icono de Estructuras */}
        <div className="relative">
          <button
            onClick={() => setIsStructuresOpen(!isStructuresOpen)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all duration-200 group min-w-[100px] ${
              isStructuresOpen 
                ? 'border-purple-400 bg-purple-50 shadow-lg' 
                : 'border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-md'
            }`}
            title="Estructuras de contenedores"
          >
            <FiPlus className={`w-6 h-6 mb-3 transition-colors ${
              isStructuresOpen ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-500'
            }`} />
            <span className={`text-sm font-medium transition-colors ${
              isStructuresOpen ? 'text-purple-700' : 'text-gray-600 group-hover:text-purple-600'
            }`}>
              Estructuras
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

      {/* Panel desplegable de estructuras */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isStructuresOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm mx-4">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base font-semibold text-purple-700">Elige una estructura</h4>
            <button
              onClick={() => setIsStructuresOpen(false)}
              className="p-1 hover:bg-purple-100 rounded transition-colors"
            >
              <FiX className="w-4 h-4 text-purple-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Contenedor único */}
            <button
              onClick={() => handleStructureClick(CONTAINER_STRUCTURES.SINGLE)}
              className="flex flex-col items-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all duration-200 group"
              title="Agregar contenedor único"
            >
              <div className="w-16 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 mb-4 transition-colors"></div>
              <span className="text-sm text-gray-600 group-hover:text-purple-700 font-medium transition-colors">
                1 Contenedor
              </span>
            </button>

            {/* Dos contenedores */}
            <button
              onClick={() => handleStructureClick(CONTAINER_STRUCTURES.DOUBLE)}
              className="flex flex-col items-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all duration-200 group"
              title="Agregar dos contenedores lado a lado"
            >
              <div className="flex gap-2 mb-4">
                <div className="w-7 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 transition-colors"></div>
                <div className="w-7 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 transition-colors"></div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-purple-700 font-medium transition-colors">
                2 Contenedores
              </span>
            </button>

            {/* Tres contenedores */}
            <button
              onClick={() => handleStructureClick(CONTAINER_STRUCTURES.TRIPLE)}
              className="flex flex-col items-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all duration-200 group"
              title="Agregar tres contenedores lado a lado"
            >
              <div className="flex gap-1 mb-4">
                <div className="w-4 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 transition-colors"></div>
                <div className="w-4 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 transition-colors"></div>
                <div className="w-4 h-12 bg-gray-200 rounded border group-hover:bg-purple-200 transition-colors"></div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-purple-700 font-medium transition-colors">
                3 Contenedores
              </span>
            </button>
          </div>
        </div>
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