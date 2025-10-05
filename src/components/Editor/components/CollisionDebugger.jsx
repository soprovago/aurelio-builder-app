import React, { useState, useEffect } from 'react';
import { FiTarget, FiInfo, FiSettings, FiX } from 'react-icons/fi';

/**
 * Componente de debug visual para collision detection
 * Muestra en tiempo real qué elemento está siendo detectado como mejor target
 */
const CollisionDebugger = ({ 
  collisionDetection, 
  isDragging, 
  activeRect, 
  activeElement,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('smart');

  // Actualizar debug info cuando hay drag activo
  useEffect(() => {
    if (!isDragging || !activeRect || !collisionDetection) {
      setDebugInfo(null);
      return;
    }

    try {
      const info = collisionDetection.getDebugInfo(activeRect);
      setDebugInfo(info);
    } catch (error) {
      console.error('Error getting debug info:', error);
      setDebugInfo(null);
    }
  }, [isDragging, activeRect, collisionDetection, selectedAlgorithm]);

  // Solo mostrar el panel si está visible, hay drag activo y hay debug info
  if (!isVisible || !isDragging || !debugInfo) {
    return null;
  }

  const { results = {}, droppableCount, algorithm } = debugInfo;

  return (
    <div className={`fixed top-16 left-4 z-[9999] ${className}`}>
      {/* Panel de debug */}
      <div className="bg-black/90 backdrop-blur text-white p-4 rounded-lg shadow-xl max-w-sm">
        <div className="bg-black/90 backdrop-blur text-white p-4 rounded-lg shadow-xl max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <FiTarget className="w-4 h-4 text-purple-400" />
          <h3 className="font-medium text-sm">Collision Detection Debug</h3>
        </div>

        {/* Active element info */}
        <div className="mb-3 p-2 bg-purple-900/30 rounded text-xs">
          <div className="font-medium text-purple-300 mb-1">Elemento Activo:</div>
          <div>{activeElement?.type || 'Unknown'} ({activeElement?.id?.slice(-8) || 'No ID'})</div>
        </div>

        {/* Algorithm selector */}
        <div className="mb-3">
          <div className="text-xs text-gray-300 mb-1">Algoritmo:</div>
          <select
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value);
              collisionDetection?.updateDetectorOptions({ algorithm: e.target.value });
            }}
            className="w-full bg-gray-800 text-white text-xs p-1 rounded border border-gray-600"
          >
            <option value="smart">Smart (Híbrido)</option>
            <option value="center">Centro más cercano</option>
            <option value="corners">Esquinas más cercanas</option>
            <option value="intersection">Intersección</option>
          </select>
        </div>

        {/* Stats */}
        <div className="mb-3 text-xs">
          <div className="text-gray-400">Elementos disponibles: {droppableCount}</div>
          <div className="text-gray-400">Algoritmo activo: {algorithm}</div>
        </div>

        {/* Results comparison */}
        <div className="space-y-2">
          {Object.entries(results).map(([algorithmName, result]) => (
            <div 
              key={algorithmName}
              className={`p-2 rounded text-xs border ${
                algorithmName === selectedAlgorithm 
                  ? 'border-purple-400 bg-purple-900/20' 
                  : 'border-gray-600 bg-gray-800/30'
              }`}
            >
              <div className={`font-medium mb-1 capitalize ${
                algorithmName === selectedAlgorithm ? 'text-purple-300' : 'text-gray-300'
              }`}>
                {algorithmName === 'smart' ? '🧠 Smart' : 
                 algorithmName === 'center' ? '🎯 Center' :
                 algorithmName === 'corners' ? '📐 Corners' : '🔄 Intersection'}
              </div>
              
              {result ? (
                <div className="space-y-1">
                  <div className="text-green-400">
                    ✅ {result.data?.type || 'Element'} 
                    <span className="text-gray-400"> ({result.id?.slice(-6)})</span>
                  </div>
                  {result.distance && (
                    <div className="text-blue-400">📏 {Math.round(result.distance)}px</div>
                  )}
                  {result.intersectionRatio && (
                    <div className="text-yellow-400">
                      🔄 {Math.round(result.intersectionRatio * 100)}%
                    </div>
                  )}
                  {result.algorithm && (
                    <div className="text-purple-400 text-[10px]">
                      via: {result.algorithm}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-400">❌ No match</div>
              )}
            </div>
          ))}
        </div>

        {/* Current best match highlight */}
        {results[selectedAlgorithm] && (
          <div className="mt-3 p-2 bg-green-900/30 border border-green-600 rounded text-xs">
            <div className="flex items-center gap-1 text-green-300 font-medium mb-1">
              <FiTarget className="w-3 h-3" />
              Mejor Match:
            </div>
            <div className="text-green-200">
              {results[selectedAlgorithm].data?.type || 'Element'} - {results[selectedAlgorithm].id?.slice(-8)}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CollisionDebugger;