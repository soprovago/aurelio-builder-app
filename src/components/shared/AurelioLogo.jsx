/**
 * Aurelio Builder Logo Component
 * Logo SVG de Aurelio Builder para usar en la aplicación
 */

import React from 'react';

function AurelioLogo({ className = "w-8 h-8", variant = "default" }) {
  const baseClasses = `${className}`;
  
  if (variant === "icon-only") {
    return (
      <svg 
        className={baseClasses} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo con gradiente */}
        <defs>
          <linearGradient id="aurelio-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1b6d" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Contenedor del logo */}
        <rect width="32" height="32" rx="8" fill="url(#aurelio-gradient)" />
        
        {/* Símbolo "A" estilizado */}
        <path 
          d="M8 24 L16 8 L24 24 M12 20 L20 20" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <svg 
        className="w-8 h-8" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo con gradiente */}
        <defs>
          <linearGradient id="aurelio-gradient-full" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1b6d" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        <rect width="32" height="32" rx="8" fill="url(#aurelio-gradient-full)" />
        
        <path 
          d="M8 24 L16 8 L24 24 M12 20 L20 20" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      
      {/* Text */}
      {variant === "full" && (
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-none">Aurelio</span>
          <span className="text-gray-400 text-xs leading-none">Builder</span>
        </div>
      )}
    </div>
  );
}

export default AurelioLogo;