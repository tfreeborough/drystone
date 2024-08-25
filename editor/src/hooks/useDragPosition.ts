import React from 'react';
const useDragPosition = () => {
  const [
    dragPosition,
    setDragPosition
  ] = React.useState<{ x: null | number, y: null | number}>({ x: null, y: null });
  React.useEffect(() => {
    const updateDragPosition = (ev: DragEvent) => {
      setDragPosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('drag', updateDragPosition);
    return () => {
      window.removeEventListener('drag', updateDragPosition);
    };
  }, []);
  return dragPosition;
};
export default useDragPosition;
