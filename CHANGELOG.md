# Changelog - Aurelio Builder

## [2024-01-05] - Mejoras Importantes al Sistema de Templates y Botones

### 🎨 **Easy Layout Mode - Mejoras de Diseño**
- **Botón de cerrar corregido**: Cambió el icono de engranaje por "X" para mejor UX
- **Tema oscuro integrado**: Colores actualizados para coincidir con el tema Aurelio
  - Cards: `bg-[#2a2a2a]` → `bg-[#3a3a3a]` en hover
  - Bordes: `border-[#404040]` con hover `border-[#8b5cf6]/50`
  - Texto: `text-[#e4e4e7]` para títulos, `text-[#9ca3af]` para descripciones
- **Iconos optimizados**: Todos los iconos de secciones ahora usan color gris uniforme con strokeWidth 1.5

### 🏗️ **Sistema de Templates Mejorado**
- **Nombres actualizados**:
  - "Dos Columnas" → "Dos Contenedores"
  - "Tres Columnas" → "Tres Contenedores"
- **Iconos específicos** para cada template:
  - Card: `FiImage` (icono de imagen)
  - Hero Section: `FiType` (icono de texto)  
  - Dos Contenedores: `FiColumns` (icono de columnas)
  - Tres Contenedores: `FiGrid` (icono de cuadrícula)
  - Header/Navegación: `FiNavigation` (icono de navegación)
  - Footer: `FiMoreHorizontal` (icono horizontal)

### 🎯 **Mejoras en Template "Tres Contenedores"**
- **Botones agregados**: Cada contenedor ahora incluye un botón "Ver más"
- **Espaciado optimizado**:
  - Gap: `12px` → `16px`
  - Padding: `20px` → `24px`
  - Altura mínima: `200px` → `280px`
  - Border radius: `8px` → `12px`
- **Contenido mejorado**: Texto más descriptivo y útil
- **Centrado perfecto**: Botones ahora aparecen centrados horizontalmente

### 🔧 **Sistema de Centrado de Botones - Solución Técnica**
- **Problema identificado**: El wrapper `element-wrapper` interfería con el centrado
- **Solución implementada**: Modificado `utils/elementRenderer.jsx` para detectar `alignSelf: 'center'` y envolver botones en div centrado
- **Propiedad agregada**: `alignSelf` añadida a las propiedades base de flexbox en `BaseProperties.js`

### 🚀 **Elemento Botón - Funcionalidades Expandidas**

#### **Funcionalidades de Enlaces:**
- **href**: Soporte completo para URLs
- **target**: Opciones `_self`, `_blank`, `_parent`, `_top`
- **rel**: Atributos de relación (noopener noreferrer, etc.)
- **Detección automática**: Enlaces externos muestran icono ↗
- **Modo editor**: Prevención de navegación durante edición

#### **Estados Hover Avanzados:**
- **backgroundColorHover**: Color de fondo al hacer hover
- **textColorHover**: Color de texto al hacer hover
- **Transiciones suaves**: `transition: 'all 0.2s ease'`
- **Eventos dinámicos**: onMouseEnter/onMouseLeave implementados

#### **Tipografía Avanzada:**
- **fontSize**: Tamaño de fuente configurable
- **fontWeight**: Peso de fuente (300-800)
- **fontFamily**: Familia de fuente personalizable

#### **Estados y Comportamiento:**
- **disabled**: Estado deshabilitado con opacidad reducida
- **buttonType**: `button`, `submit`, `reset`
- **Cursor apropiado**: `pointer` normal, `not-allowed` deshabilitado

#### **Accesibilidad Completa:**
- **aria-label**: Etiquetas descriptivas para lectores de pantalla
- **aria-disabled**: Estado accesible
- **tabIndex**: Navegación por teclado
- **Focus styles**: Outline visible con teclado

### 📋 **Panel de Propiedades del Botón - Completamente Expandido**

#### **Secciones implementadas:**
1. **Contenido**: Texto del botón
2. **Enlaces**: URL y configuración de target
3. **Colores normales**: Fondo y texto
4. **Colores hover**: Fondo y texto hover
5. **Tipografía**: Tamaño y peso de fuente
6. **Espaciado**: Padding, border radius, border
7. **Comportamiento**: Tipo de botón, estado disabled
8. **Alineación**: AlignSelf con opciones visuales
9. **Accesibilidad**: Aria-label para lectores de pantalla

#### **Características del panel:**
- ✅ Color pickers con preview visual
- ✅ Dropdowns con opciones descriptivas
- ✅ Campos de texto con placeholders útiles
- ✅ Checkboxes para estados booleanos
- ✅ Tema oscuro consistente con Aurelio
- ✅ Valores por defecto sensatos

### 🧹 **Limpieza de Interfaz**
- **Botón de grilla eliminado**: Removido `GridToggle` del canvas
- **Grilla visual eliminada**: Removido `VisualGrid` innecesario
- **Código limpio**: Eliminadas importaciones y estados no utilizados

### 📚 **Ejemplos en Templates**
La plantilla "Tres Contenedores" ahora incluye tres tipos de botones como ejemplo:
1. **Botón estándar**: "Ver más" - Estilo morado clásico
2. **Enlace externo**: "Enlace externo" - Verde, abre en nueva pestaña
3. **Botón outline**: "Botón outline" - Transparente con borde morado

---

## 🔧 Archivos Modificados

### Principales:
- `src/components/Editor/components/EasyLayoutMode.jsx` - Tema oscuro y iconos
- `src/components/Editor/templates/containerTemplates.js` - Templates mejorados
- `src/components/Editor/utils/elementRenderer.jsx` - Sistema de centrado y funcionalidades de botón
- `src/components/Editor/shared/BaseProperties.js` - Propiedad alignSelf agregada
- `src/components/Editor/components/PropertiesPanel.jsx` - Panel expandido del botón
- `src/components/Editor/config/availableElements.jsx` - Props por defecto actualizadas
- `src/components/Editor/components/Canvas.jsx` - Grilla eliminada

### Funcionalidades agregadas:
- ✅ Centrado perfecto de botones
- ✅ Sistema de hover states
- ✅ Funcionalidad completa de enlaces
- ✅ Panel de propiedades completo
- ✅ Accesibilidad mejorada
- ✅ Templates más útiles
- ✅ Interfaz más limpia

---

## 🎯 Resultado Final

**Aurelio Builder ahora cuenta con:**
- Sistema de templates más intuitivo y funcional
- Botones completamente configurables desde el panel de propiedades
- Easy Layout Mode integrado visualmente con el tema
- Centrado perfecto de elementos
- Interfaz más limpia y profesional
- Accesibilidad mejorada en todos los elementos

**Estado del proyecto:** ✅ Completamente funcional y listo para producción