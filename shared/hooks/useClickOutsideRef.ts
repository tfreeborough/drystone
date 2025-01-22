import { useEffect, type RefObject } from "react";

export const useClickOutsideRef = (
  ref: RefObject<any>,
  onClickOutside: () => void,
): any => {
  useEffect(() => {
    /**
     * Run if we click outside of the current ref element
     * @param event
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
