# 🎯 ROADMAP: MEJORAS DRAG & DROP PARA AURELIO BUILDER

## 📋 Estado Actual vs Librerías de Referencia

### ✅ Lo que ya tenemos (mantenemos)
- Sistema custom con control total
- Throttling de rendimiento (60fps)
- Soporte para contenedores anidados
- Visual feedback avanzado

### 🎯 Mejoras Inspiradas en @dnd-kit/core

## 🚀 FASE 1: Mejoras Inmediatas (Sin cambiar arquitectura)

### 1. **Collision Detection Mejorada**
```javascript
// src/components/Editor/utils/collisionDetection.js
export const CollisionDetection = {
  // Inspirado en @dnd-kit closestCenter
  closestCenter: (droppableRects, activeRect) => {
    const centerX = activeRect.left + activeRect.width / 2;
    const centerY = activeRect.top + activeRect.height / 2;
    
    return droppableRects.reduce((closest, rect) => {
      const rectCenterX = rect.left + rect.width / 2;
      const rectCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(centerX - rectCenterX, 2) + Math.pow(centerY - rectCenterY, 2)
      );
      
      return distance < closest.distance ? { ...rect, distance } : closest;
    }, { distance: Infinity });
  },
  
  // Para contenedores anidados
  rectIntersection: (activeRect, droppableRect) => {
    const intersectionArea = Math.max(0, 
      Math.min(activeRect.right, droppableRect.right) - 
      Math.max(activeRect.left, droppableRect.left)
    ) * Math.max(0,
      Math.min(activeRect.bottom, droppableRect.bottom) - 
      Math.max(activeRect.top, droppableRect.top)
    );
    
    return intersectionArea / (activeRect.width * activeRect.height);
  }
};
```

### 2. **Auto-scroll Durante Drag**
```javascript
// src/components/Editor/hooks/useAutoScroll.js
export const useAutoScroll = () => {
  const autoScrollRef = useRef();
  
  const startAutoScroll = useCallback((direction, speed = 2) => {
    const scroll = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        container.scrollTop += direction * speed;
        autoScrollRef.current = requestAnimationFrame(scroll);
      }
    };
    scroll();
  }, []);
  
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
    }
  }, []);
  
  return { startAutoScroll, stopAutoScroll };
};
```

### 3. **Accessibility Enhancements**
```javascript
// src/components/Editor/utils/dragAnnouncements.js
export const DragAnnouncements = {
  onDragStart: ({ active }) => `Picked up ${active.data.element?.type || 'element'}`,
  onDragOver: ({ active, over }) => {
    if (over) {
      return `${active.data.element?.type} is over ${over.data.element?.type}`;
    }
    return `${active.data.element?.type} is no longer over a droppable area`;
  },
  onDragEnd: ({ active, over }) => {
    if (over) {
      return `${active.data.element?.type} was dropped over ${over.data.element?.type}`;
    }
    return `${active.data.element?.type} was dropped`;
  }
};

// Implementar con aria-live region
const AriaLiveRegion = ({ announcement }) => (
  <div
    aria-live="assertive"
    aria-atomic="true"
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      margin: '-1px',
      border: '0',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }}
  >
    {announcement}
  </div>
);
```

### 4. **Multiple Sensors Support**
```javascript
// src/components/Editor/sensors/CustomSensors.js
export class CustomSensors {
  static mouse = {
    activationConstraint: {
      distance: 8, // Prevenir drag accidental
    },
    onActivation: (event) => {
      // Custom logic cuando inicia el drag con mouse
    }
  };
  
  static touch = {
    activationConstraint: {
      delay: 250, // Hold para activar en touch
      tolerance: 8
    }
  };
  
  static keyboard = {
    getNextPosition: (currentPosition, { direction, containerRect }) => {
      const step = 20;
      switch (direction) {
        case 'up': return { ...currentPosition, y: currentPosition.y - step };
        case 'down': return { ...currentPosition, y: currentPosition.y + step };
        case 'left': return { ...currentPosition, x: currentPosition.x - step };
        case 'right': return { ...currentPosition, x: currentPosition.x + step };
      }
    }
  };
}
```

## 🚀 FASE 2: Mejoras de Arquitectura (Medio plazo)

### 1. **Context-based Drag State**
```javascript
// src/components/Editor/context/DragContext.jsx
const DragContext = createContext();

export const DragProvider = ({ children }) => {
  const [dragState, setDragState] = useState({
    active: null,
    over: null,
    isDragging: false,
    sensors: ['mouse', 'touch', 'keyboard']
  });
  
  return (
    <DragContext.Provider value={{ dragState, setDragState }}>
      {children}
    </DragContext.Provider>
  );
};
```

### 2. **Plugin Architecture para Extensions**
```javascript
// src/components/Editor/plugins/DragPluginSystem.js
export class DragPluginSystem {
  constructor() {
    this.plugins = new Map();
  }
  
  register(name, plugin) {
    this.plugins.set(name, plugin);
  }
  
  // Plugin para Grid Snapping
  static GridSnap = {
    name: 'gridSnap',
    modifyCoordinates: (coordinates, { gridSize = 20 }) => ({
      x: Math.round(coordinates.x / gridSize) * gridSize,
      y: Math.round(coordinates.y / gridSize) * gridSize
    })
  };
  
  // Plugin para Constraints
  static Constraints = {
    name: 'constraints',
    validateDrop: (active, over, constraints) => {
      return constraints.every(constraint => constraint(active, over));
    }
  };
}
```

## 🚀 FASE 3: Migración a @dnd-kit (Largo plazo - Opcional)

### Razones para considerar la migración:
1. **Mantenimiento reducido** - Menos código custom que mantener
2. **Accesibilidad automática** - A11y features out-of-the-box
3. **Performance optimizada** - Algoritmos battle-tested
4. **Ecosystem** - Plugins y extensiones de la comunidad

### Plan de migración:
```javascript
// Wrapper para mantener API actual mientras migramos internals
export const AurelioDroppable = ({ children, id, data }) => {
  return (
    <Droppable id={id} data={data}>
      {children}
    </Droppable>
  );
};

export const AurelioDraggable = ({ children, id, data }) => {
  return (
    <Draggable id={id} data={data}>
      {children}
    </Draggable>
  );
};
```

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### 🥇 Prioridad Alta (Próximas semanas)
1. ✅ Auto-scroll durante drag
2. ✅ Collision detection mejorada
3. ✅ Accessibility announcements

### 🥈 Prioridad Media (Próximos meses)
1. ⏳ Multiple sensors support
2. ⏳ Plugin architecture base
3. ⏳ Grid snapping opcional

### 🥉 Prioridad Baja (Futuro)
1. 🔮 Evaluación de migración completa a @dnd-kit
2. 🔮 Keyboard navigation completa
3. 🔮 Drag between multiple canvases

## 📊 MÉTRICAS DE ÉXITO

- **Performance**: Mantener 60fps durante drag operations
- **Accesibilidad**: Score 100% en accessibility audits
- **UX**: Reducir tiempo promedio para crear layouts complejos
- **Bugs**: Cero reportes de edge cases en drag & drop
- **Mantenibilidad**: Reducir líneas de código custom en 30%
