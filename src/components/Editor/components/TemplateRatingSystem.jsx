/**
 * Template Rating System Component
 * Componente para calificar plantillas y mostrar ratings
 */

import React, { useState, useCallback } from 'react';
import { FiStar, FiUser, FiMessageCircle, FiThumbsUp, FiFlag } from 'react-icons/fi';

// Hook para gestionar ratings de plantillas
function useTemplateRating(templateId) {
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar rating del usuario al inicializar
  React.useEffect(() => {
    const loadUserRating = () => {
      try {
        const saved = localStorage.getItem(`rating-${templateId}`);
        if (saved) {
          const rating = parseInt(saved, 10);
          setUserRating(rating);
          setHasRated(true);
        }
      } catch (err) {
        console.error('Error loading user rating:', err);
      }
    };

    if (templateId) {
      loadUserRating();
    }
  }, [templateId]);

  // Enviar rating
  const submitRating = useCallback(async (rating, review = '') => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En desarrollo, guardar en localStorage
      localStorage.setItem(`rating-${templateId}`, rating.toString());
      if (review) {
        localStorage.setItem(`review-${templateId}`, review);
      }

      setUserRating(rating);
      setHasRated(true);
      
      console.log(`📊 Rating submitted: ${rating}/5 for template ${templateId}`, review ? `Review: ${review}` : '');
      
      return { success: true };
    } catch (err) {
      setError('Error al enviar calificación');
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [templateId]);

  // Actualizar rating
  const updateRating = useCallback(async (newRating) => {
    return await submitRating(newRating);
  }, [submitRating]);

  // Eliminar rating
  const removeRating = useCallback(() => {
    try {
      localStorage.removeItem(`rating-${templateId}`);
      localStorage.removeItem(`review-${templateId}`);
      setUserRating(0);
      setHasRated(false);
    } catch (err) {
      console.error('Error removing rating:', err);
    }
  }, [templateId]);

  return {
    userRating,
    hasRated,
    isSubmitting,
    error,
    submitRating,
    updateRating,
    removeRating
  };
}

// Componente de estrellas para mostrar/establecer rating
function StarRating({ 
  rating = 0, 
  maxStars = 5, 
  size = 20, 
  interactive = false, 
  onChange,
  showValue = true,
  className = ''
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starValue) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (interactive) {
      setHoveredRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const displayRating = interactive ? (hoveredRating || rating) : rating;

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        const isPartial = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={starValue}
            className={`relative transition-all duration-150 ${
              interactive 
                ? 'hover:scale-110 cursor-pointer' 
                : 'cursor-default'
            }`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            disabled={!interactive}
            style={{ width: size, height: size }}
          >
            <FiStar
              className={`absolute inset-0 transition-colors duration-150 ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : isPartial
                    ? 'text-yellow-300 fill-current'
                    : interactive && hoveredRating >= starValue
                      ? 'text-yellow-300'
                      : 'text-gray-300'
              }`}
              size={size}
            />
          </button>
        );
      })}
      
      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating > 0 ? rating.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}

// Modal para calificar plantilla
function RatingModal({ 
  isOpen, 
  template, 
  onClose, 
  onSubmitRating,
  existingRating = 0,
  existingReview = ''
}) {
  const [rating, setRating] = useState(existingRating);
  const [review, setReview] = useState(existingReview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRating(existingRating);
      setReview(existingReview);
    }
  }, [isOpen, existingRating, existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmitRating(rating, review);
      onClose();
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Calificar Plantilla
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {template?.name}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tu calificación
            </label>
            <StarRating
              rating={rating}
              interactive={true}
              onChange={setRating}
              size={32}
              showValue={false}
              className="justify-center"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              {rating === 0 && 'Selecciona una calificación'}
              {rating === 1 && 'Muy malo'}
              {rating === 2 && 'Malo'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bueno'}
              {rating === 5 && 'Excelente'}
            </p>
          </div>

          {/* Review */}
          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Comparte tu experiencia con esta plantilla..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {review.length}/500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// Componente principal del sistema de rating
function TemplateRatingSystem({ template, compact = false }) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { 
    userRating, 
    hasRated, 
    isSubmitting, 
    submitRating 
  } = useTemplateRating(template?.id);

  const handleOpenRating = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating, review) => {
    await submitRating(rating, review);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StarRating rating={template?.rating || 0} size={16} />
        {!hasRated && (
          <button
            onClick={handleOpenRating}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Calificar
          </button>
        )}
        
        <RatingModal
          isOpen={showRatingModal}
          template={template}
          onClose={() => setShowRatingModal(false)}
          onSubmitRating={handleSubmitRating}
          existingRating={userRating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Rating promedio */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating rating={template?.rating || 0} size={20} />
          <span className="text-sm text-gray-600">
            {template?.totalRatings || 0} calificaciones
          </span>
        </div>

        {!hasRated ? (
          <button
            onClick={handleOpenRating}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiStar className="w-4 h-4" />
            Calificar
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
            Tu calificación: {userRating}
          </div>
        )}
      </div>

      {/* Reviews recientes (simulado) */}
      {!compact && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Comentarios recientes
          </h4>
          
          {/* Ejemplo de review */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <FiUser className="w-3 h-3 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Usuario</span>
              <StarRating rating={5} size={14} showValue={false} />
            </div>
            <p className="text-sm text-gray-700">
              "Excelente plantilla, muy fácil de personalizar y con un diseño moderno."
            </p>
          </div>
        </div>
      )}

      <RatingModal
        isOpen={showRatingModal}
        template={template}
        onClose={() => setShowRatingModal(false)}
        onSubmitRating={handleSubmitRating}
        existingRating={userRating}
      />
    </div>
  );
}

export default TemplateRatingSystem;
export { StarRating, RatingModal, useTemplateRating };