import { useState, useEffect } from 'react';

const ANIMATION_DURATION = 400; // ms

/**
 * Hook pour gérer l'animation des modals (slide depuis la droite)
 * @param {boolean} isVisible - Visibilité du modal
 * @returns {Object} { animState, isRendered } - État de l'animation et si le modal doit être rendu
 */
export function useModalAnimation(isVisible) {
  const [animState, setAnimState] = useState('');
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Rendre le modal mais sans classe d'animation pour qu'il soit caché
      setIsRendered(true);
      setAnimState(''); // Pas de classe d'animation = caché par CSS
      // Utiliser requestAnimationFrame pour s'assurer que le DOM est monté
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Maintenant on peut déclencher l'animation d'entrée
          setAnimState('in');
        });
      });
    } else {
      // Animation de sortie
      if (isRendered) {
        setAnimState('out');
        const timer = setTimeout(() => {
          setIsRendered(false);
          setAnimState('');
        }, ANIMATION_DURATION);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, isRendered]);

  const closeWithAnimation = (onClose) => {
    setAnimState('out');
    setTimeout(() => {
      if (onClose) onClose();
    }, ANIMATION_DURATION);
  };

  return {
    animState,
    isRendered,
    closeWithAnimation
  };
}

