import React from 'react';
import { CanvasElement } from '@/types';
import { useEditorStore } from '@/store';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
}

// Componente para campo de texto
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Componente para campo numérico
interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  suffix 
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {suffix && (
        <span className="absolute right-3 top-2 text-sm text-gray-500">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// Componente para selector de color
interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

// Componente para selector
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Componente para checkbox
interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
  <div className="mb-4">
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
    </label>
  </div>
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement }) => {
  const { updateElement, deleteElement } = useEditorStore();

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <h3 className="font-medium mb-2">Sin elemento seleccionado</h3>
        <p className="text-sm">
          Selecciona un elemento del canvas para editar sus propiedades.
        </p>
      </div>
    );
  }

  const updateProperty = (property: string, value: any, nested?: string) => {
    const updates = nested 
      ? { [nested]: { ...selectedElement[nested as keyof CanvasElement], [property]: value } }
      : { [property]: value };
    
    updateElement(selectedElement.id, updates);
  };

  const updateStyle = (property: string, value: string) => {
    updateProperty(property, value, 'styles');
  };

  const updateProp = (property: string, value: any) => {
    updateProperty(property, value, 'props');
  };

  const renderGeneralProperties = () => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">
        General
      </h4>
      
      {/* Position */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <NumberField
          label="X"
          value={selectedElement.position.x}
          onChange={(value) => updateProperty('position', { ...selectedElement.position, x: value })}
          suffix="px"
        />
        <NumberField
          label="Y"
          value={selectedElement.position.y}
          onChange={(value) => updateProperty('position', { ...selectedElement.position, y: value })}
          suffix="px"
        />
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <NumberField
          label="Ancho"
          value={selectedElement.size.width}
          onChange={(value) => updateProperty('size', { ...selectedElement.size, width: value })}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Alto"
          value={selectedElement.size.height}
          onChange={(value) => updateProperty('size', { ...selectedElement.size, height: value })}
          min={1}
          suffix="px"
        />
      </div>

      {/* Order */}
      <NumberField
        label="Orden (Z-Index)"
        value={selectedElement.order}
        onChange={(value) => updateProperty('order', value)}
        min={0}
      />

      {/* Visibility and Lock */}
      <div className="grid grid-cols-2 gap-3">
        <CheckboxField
          label="Visible"
          checked={selectedElement.isVisible}
          onChange={(checked) => updateProperty('isVisible', checked)}
        />
        <CheckboxField
          label="Bloqueado"
          checked={selectedElement.isLocked}
          onChange={(checked) => updateProperty('isLocked', checked)}
        />
      </div>
    </div>
  );

  const renderStyleProperties = () => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">
        Estilos
      </h4>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ColorField
          label="Color de texto"
          value={selectedElement.styles.color || ''}
          onChange={(value) => updateStyle('color', value)}
        />
        <ColorField
          label="Color de fondo"
          value={selectedElement.styles.backgroundColor || ''}
          onChange={(value) => updateStyle('backgroundColor', value)}
        />
      </div>

      {/* Typography */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <TextField
          label="Tamaño de fuente"
          value={selectedElement.styles.fontSize || ''}
          onChange={(value) => updateStyle('fontSize', value)}
          placeholder="16px"
        />
        <SelectField
          label="Peso de fuente"
          value={selectedElement.styles.fontWeight || 'normal'}
          onChange={(value) => updateStyle('fontWeight', value)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Negrita' },
            { value: '100', label: 'Fino (100)' },
            { value: '300', label: 'Ligero (300)' },
            { value: '500', label: 'Medio (500)' },
            { value: '700', label: 'Negrita (700)' },
            { value: '900', label: 'Muy negrita (900)' },
          ]}
        />
      </div>

      {selectedElement.type !== 'image' && selectedElement.type !== 'input' && (
        <SelectField
          label="Alineación de texto"
          value={selectedElement.styles.textAlign || 'left'}
          onChange={(value) => updateStyle('textAlign', value)}
          options={[
            { value: 'left', label: 'Izquierda' },
            { value: 'center', label: 'Centro' },
            { value: 'right', label: 'Derecha' },
          ]}
        />
      )}

      {/* Spacing */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <TextField
          label="Padding"
          value={selectedElement.styles.padding || ''}
          onChange={(value) => updateStyle('padding', value)}
          placeholder="8px"
        />
        <TextField
          label="Margin"
          value={selectedElement.styles.margin || ''}
          onChange={(value) => updateStyle('margin', value)}
          placeholder="0px"
        />
      </div>

      {/* Border */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <TextField
          label="Borde"
          value={selectedElement.styles.border || ''}
          onChange={(value) => updateStyle('border', value)}
          placeholder="1px solid #000"
        />
        <TextField
          label="Border radius"
          value={selectedElement.styles.borderRadius || ''}
          onChange={(value) => updateStyle('borderRadius', value)}
          placeholder="4px"
        />
      </div>
    </div>
  );

  const renderContentProperties = () => {
    const element = selectedElement;
    
    return (
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">
          Contenido
        </h4>

        {/* Text content for text elements */}
        {['text', 'button', 'heading', 'paragraph', 'link'].includes(element.type) && (
          <TextField
            label="Texto"
            value={element.props.text || ''}
            onChange={(value) => updateProp('text', value)}
            placeholder="Ingresa el texto..."
          />
        )}

        {/* Link specific properties */}
        {element.type === 'link' && (
          <>
            <TextField
              label="URL"
              value={element.props.href || ''}
              onChange={(value) => updateProp('href', value)}
              placeholder="https://example.com"
            />
            <SelectField
              label="Target"
              value={element.props.target || '_self'}
              onChange={(value) => updateProp('target', value)}
              options={[
                { value: '_self', label: 'Misma ventana' },
                { value: '_blank', label: 'Nueva ventana' },
              ]}
            />
          </>
        )}

        {/* Image specific properties */}
        {element.type === 'image' && (
          <>
            <TextField
              label="URL de imagen"
              value={element.props.src || ''}
              onChange={(value) => updateProp('src', value)}
              placeholder="https://example.com/image.jpg"
            />
            <TextField
              label="Texto alternativo"
              value={element.props.alt || ''}
              onChange={(value) => updateProp('alt', value)}
              placeholder="Descripción de la imagen"
            />
          </>
        )}

        {/* Input specific properties */}
        {element.type === 'input' && (
          <TextField
            label="Placeholder"
            value={element.props.placeholder || ''}
            onChange={(value) => updateProp('placeholder', value)}
            placeholder="Texto de ejemplo..."
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 capitalize">
              {selectedElement.type}
            </h3>
            <p className="text-sm text-gray-500">ID: {selectedElement.id}</p>
          </div>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar elemento"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {renderGeneralProperties()}
        {renderContentProperties()}
        {renderStyleProperties()}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Implementar duplicar elemento
              console.log('Duplicate element:', selectedElement.id);
            }}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Duplicar
          </button>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;