import React, {useRef, useEffect, useState, useCallback} from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import {Application} from "../../../types/application.types.ts";
import ApplicationEditorMenu from "./ApplicationEditorMenu/ApplicationEditorMenu.tsx";
import css from './InfiniteCanvas.module.scss';

interface InfiniteCanvasProps {
  application: Application
}

const InfiniteCanvas = ({ application }: InfiniteCanvasProps) => {
  const [menuPosition, setMenuPosition] = useState(null);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const containerRef = useRef(null);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleDragEnd = (e) => {
    console.log(e.target.position());
    setStagePos(e.target.position());
    setDragging(false);
  };

  const handleDragStart = (e) => {
    setDragging(true);
  }

  const handleMouseDown = (e) => {
    setDragging(true);
  }

  const handleMouseUp = (e) => {
    setDragging(false);
  }

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    setMenuPosition({ x: e.evt.clientX, y: e.evt.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} className={`${css.infiniteCanvas} ${dragging ? css.dragging : ''}`}>
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      draggable
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onWheel={handleWheel}
      scale={{ x: scale, y: scale }}
      x={stagePos.x}
      y={stagePos.y}
      onContextMenu={handleContextMenu}
    >
      <Layer>
        <Rect x={40} y={40} width={200} height={200} fill="red" />
      </Layer>
    </Stage>
      {menuPosition && <ApplicationEditorMenu {...menuPosition} onClose={closeMenu} application={application} />}
    </div>
  );
};

export default InfiniteCanvas;
