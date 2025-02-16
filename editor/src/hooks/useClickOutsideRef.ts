import React, { useEffect } from 'react';

export const useClickOutsideRef = (
  ref: React.RefObject<any>,
  onClickOutside: (e: MouseEvent) => void,
  ignoreModals: boolean = false,
): any => {
  useEffect(() => {
    /**
     * Run if we click outside of the current ref element
     * @param event
     */
    const handleClickOutside = (event: MouseEvent) => {
      /**
       * There are some situations where we may want to ignore clicks on anything in the modal portal, for example if we
       * have opened a modal from a context window that we dont want to close when interacting with the modal.
       */
      if (ignoreModals) {
        const target = event.target as Element;
        if (target.closest('#modal-portal')) {
          return;
        }
      }
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside(event);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
