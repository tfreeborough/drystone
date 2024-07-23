import React, {useRef, useEffect, useState, useCallback} from 'react';
import useMount from "../../../hooks/useMount.ts";

const InfiniteCanvas = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const animationRef = useRef(null);

  const animate = useCallback(() => {
    if (Math.abs(zoom - targetZoom) > 0.00001) {
      setZoom(prevZoom => prevZoom + (targetZoom - prevZoom) * 0.4);
      drawCanvas();
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setZoom(targetZoom);
      drawCanvas();
    }
  }, [zoom, targetZoom]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const drawCanvas = () => {
    if (!context) return;

    context.save();
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Apply transformations
    context.translate(offset.x, offset.y);
    context.scale(zoom, zoom);

    // Draw grid
    drawGrid();

    // Your drawing logic here
    // For example:
    context.fillStyle = 'red';
    context.fillRect(0, 0, 100, 100);

    context.restore();
  };

  const drawGrid = () => {
    if (!context) return;

    const gridSize = 50; // Size of grid squares
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // Calculate grid boundaries
    const startX = Math.floor(-offset.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-offset.y / zoom / gridSize) * gridSize;
    const endX = Math.ceil((canvasWidth - offset.x) / zoom / gridSize) * gridSize;
    const endY = Math.ceil((canvasHeight - offset.y) / zoom / gridSize) * gridSize;

    context.beginPath();
    context.strokeStyle = 'rgba(100, 100, 100, 0.3)'; // Light grey color
    context.lineWidth = 0.5 / zoom; // Adjust line width based on zoom

    // Draw vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      context.moveTo(x, startY);
      context.lineTo(x, endY);
    }

    // Draw horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      context.moveTo(startX, y);
      context.lineTo(endX, y);
    }

    context.stroke();
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPanPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const newOffset = {
      x: e.clientX - startPanPosition.x,
      y: e.clientY - startPanPosition.y
    };

    setOffset(newOffset);
    drawCanvas();
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 1 - e.deltaY * 0.001;
    const newTargetZoom = Math.min(Math.max(0.1, targetZoom * scale), 10);

    setOffset(prevOffset => ({
      x: x - (x - prevOffset.x) * (newTargetZoom / zoom),
      y: y - (y - prevOffset.y) * (newTargetZoom / zoom)
    }));

    setTargetZoom(newTargetZoom);
  }, [targetZoom, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);

    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initial drawing
    drawCanvas();
  }, [drawCanvas]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default InfiniteCanvas;
