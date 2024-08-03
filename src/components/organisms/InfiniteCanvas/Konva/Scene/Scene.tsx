import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../../../../stores/AppContext.ts";
import {Application, Frame, Scene as SceneType} from "../../../../../types/application.types.ts";
import {Group, Rect, Text} from "react-konva";
import Konva from 'konva';

interface SceneProps {
  scene: SceneType,
  application: Application,
}

const Scene = ({ scene, application }: SceneProps) => {
  const [sceneHeight, setSceneHeight] = useState(150);
  const [noteHeight, setNoteHeight] = useState(0);
  const sceneWidth = 200;  // Adjust as needed
  const frameWidth = 180;   // Adjust as needed
  const frameHeight = 20;  // Adjust as needed
  const padding = 10;

  const sceneNoteRef = useRef<Konva.Text | null>(null);

  const {
    ApplicationStore,
  } = useContext(AppContext);

  useEffect(() => {
    if (sceneNoteRef.current) {
      const noteHeight = sceneNoteRef.current?.getHeight();
      setNoteHeight(noteHeight);
      setSceneHeight(noteHeight + 20 + (25 * scene.frames.length)); // Add padding
    }
  }, [scene.metadata.note]);

  const handleUpdateScenePosition = (scene: SceneType, x, y) => {
    ApplicationStore.updateScene(application.id, {
      ...scene,
      position: { x, y }
    });
  }

  const handleOpenFrame = (frame: Frame) => {
    ApplicationStore.setEditorContext(frame);
  }

  const sceneSelected = ApplicationStore.editorContext?.id === scene.id;
  const childFrameSelected = scene.frames.find((f) => f.id === ApplicationStore.editorContext?.id) !== undefined;

  return (
    <Group
      sceneId={scene.id}
      x={scene.position?.x ?? 0}
      y={scene.position?.y ?? 0}
      draggable
      onDragEnd={(e) => {
        // Update scene position in your state
        const newPos = e.target.position();
        handleUpdateScenePosition(scene, newPos.x, newPos.y);
      }}
    >
      {/* Scene container */}
      <Rect
        width={sceneWidth}
        height={sceneHeight}
        fill={`${sceneSelected || childFrameSelected ? "#fbeaee" : "lightgray"}`}
        stroke={`${sceneSelected || childFrameSelected ? "#db2955" : "gray"}`}
        strokeWidth={1}
      />

      {/* Scene title */}
      <Text
        ref={sceneNoteRef}
        text={ scene.metadata.note ? scene.metadata.note : "Scene"}
        fontSize={14}
        fill="black"
        wrap
        width={sceneWidth - 10}
        x={5}
        y={5}
      />

      {/* Frames */}
      {scene.frames.map((frame, index) => {
        const isSelected = ApplicationStore.editorContext?.id === frame.id;
        return (
          <Group
            frameId={frame.id}
            key={frame.id}
            x={padding + (index % 1) * (frameWidth + 5)}
            y={noteHeight + 15 + Math.floor(index) * (frameHeight + 5)}
          >
            <Rect
              width={frameWidth}
              height={frameHeight}
              fill={`${isSelected ? "#db2955" : "white"}`}
              stroke={`${isSelected ? "#db2955" : "black"}`}
              strokeWidth={1}
              onClick={(e) => {

                if (e.evt.button === 0) {
                  handleOpenFrame(frame)
                }
              }}
            />
            <Text
              x={frameWidth / 2}
              y={4}
              text={`${index+1}`}
              fontSize={14}
              fill={`${isSelected ? "#fff" : "black"}`}
            />
          </Group>
        )
      }
      )}
    </Group>
  );
};

export default Scene;
