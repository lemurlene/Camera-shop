import { useEffect, useRef } from 'react';
import { getFocusableElements } from '../components/modals/utils';

export const useModalFocus = (isActive: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else {
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [isActive]);

  return modalRef;
};
