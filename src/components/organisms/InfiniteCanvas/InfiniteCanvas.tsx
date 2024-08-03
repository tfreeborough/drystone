import React, {useRef, useEffect, useState, useContext} from 'react';
import {Stage, Layer, Rect} from 'react-konva';
import {Application} from "../../../types/application.types.ts";
import ApplicationEditorMenu from "./ApplicationEditorMenu/ApplicationEditorMenu.tsx";
import css from './InfiniteCanvas.module.scss';
import {AppContext} from "../../../stores/AppContext.ts";
import Scene from "./Konva/Scene/Scene.tsx";

interface InfiniteCanvasProps {
  application: Application
}

const InfiniteCanvas = ({ application }: InfiniteCanvasProps) => {
  const [stagePos, setStagePos] = useState({ x: application.stagePosition?.x ?? 0, y: application.stagePosition?.y ?? 0 })
  const [menuPosition, setMenuPosition] = useState<Record<string, number>, null>(null);
  const [menuType, setMenuType] = useState("");
  const [menuContext, setMenuContext] = useState("");

  const [scale, setScale] = useState(application.stageScale ?? 1);
  const [dragging, setDragging] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const containerRef = useRef(null);

  const {
    ApplicationStore,
  } = useContext(AppContext);

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
    const newPos = e.target.position();
    if(e.target.attrs.id === "stage"){
      const current = ApplicationStore.current;
      if(current){
        ApplicationStore.saveApplication({
          ...current,
          stagePosition: {
            x: newPos.x,
            y: newPos.y,
          }
        })
      }
    }
    setDragging(false);
  };

  const handleDragStart = (e) => {
    e.evt.stopPropagation();
    setDragging(true);
  }

  const handleMouseDown = (e) => {
    e.evt.preventDefault();
    setDragging(true);
  }

  const handleMouseUp = (e) => {
    e.evt.preventDefault();
    setDragging(false);
  }

  const handleWheel = (e) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const current = ApplicationStore.current;
    if(current){
      ApplicationStore.saveApplication({
        ...current,
        stageScale: newScale
      })
    }

    setScale(newScale);
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  /**
   * Look at the target of the right click and work out which menu we should show.
   * @param e
   */
  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling
    const stagePointerPosition = stage.getPointerPosition();

    // Calculate the actual position on the stage, accounting for scale and stage position
    const actualStageX = (stagePointerPosition.x - stage.x()) / scale;
    const actualStageY = (stagePointerPosition.y - stage.y()) / scale;

    const sceneId = e.target.parent?.attrs.sceneId;
    const frameId = e.target.parent?.attrs.frameId;

    // Get the stage's position relative to the client viewport
    const stageBox = stage.container().getBoundingClientRect();

    // Calculate the menu position in client coordinates
    const menuX = stagePointerPosition.x + stageBox.left;
    const menuY = stagePointerPosition.y + stageBox.top;

    const menuPosition = {
      x: menuX,
      y: menuY,
      pointerX: actualStageX,
      pointerY: actualStageY
    };
    if(frameId){
      setMenuPosition(menuPosition);
      setMenuType("frame");
      setMenuContext(frameId);
    } else {
      if (sceneId) {
        const scene = application.scenes.find(s => s.id === sceneId);
        if (scene) {
          setMenuPosition(menuPosition);
          setMenuType("scene");
          setMenuContext(sceneId);
        }
      } else {
        // This is for the Stage context menu
        setMenuPosition(menuPosition);
        setMenuType("application");
      }
    }

  };



  const closeMenu = () => setMenuPosition(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} className={`${css.infiniteCanvas} ${dragging ? css.dragging : ''}`}>
    <Stage
      id="stage"
      width={stageSize.width}
      height={stageSize.height}
      draggable
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onWheel={handleWheel}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        handleContextMenu(e)
      }}
      x={stagePos.x}
      y={stagePos.y}
      scale={{ x: scale, y: scale }}
    >
      <Layer>
        <Rect x={40} y={40} width={20} height={20} fill="red" />
        {
          application.scenes.map((scene, i) => {
            return (
              <Scene key={scene.id} scene={scene} application={application} sceneId={scene.id} />
            )
          })
        }
      </Layer>
    </Stage>
      {menuPosition && <ApplicationEditorMenu {...menuPosition} onClose={closeMenu} application={application} type={menuType} context={menuContext} />}
    </div>
  );
};

export default InfiniteCanvas;
