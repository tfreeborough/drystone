import {useContext} from "react";
import {AppContext} from "../../../../../stores/AppContext.ts";
import {Application, Frame, Scene as SceneType} from "../../../../../types/application.types.ts";
import {Group, Rect, Text} from "react-konva";

interface SceneProps {
  scene: SceneType,
  application: Application,
}

const Scene = ({ scene, application }: SceneProps) => {
  const sceneWidth = 200;  // Adjust as needed
  const sceneHeight = 150; // Adjust as needed
  const frameWidth = 180;   // Adjust as needed
  const frameHeight = 20;  // Adjust as needed
  const padding = 10;

  const {
    ApplicationStore,
  } = useContext(AppContext);

  const handleUpdateScenePosition = (scene: SceneType, x, y) => {
    ApplicationStore.updateScene(application.id, {
      ...scene,
      position: { x, y }
    });
  }

  const handleOpenFrame = (frame: Frame) => {
    ApplicationStore.setEditorContext(frame);
  }

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
        height={40 + (25 * scene.frames.length)}
        fill="lightgray"
        stroke="gray"
        strokeWidth={1}
      />

      {/* Scene title */}
      <Text
        text="Scene"
        fontSize={14}
        fill="black"
        x={5}
        y={5}
      />

      {/* Frames */}
      {scene.frames.map((frame, index) => (
        <Group
          frameId={frame.id}
          key={frame.id}
          x={padding + (index % 1) * (frameWidth + 5)}
          y={30 + Math.floor(index) * (frameHeight + 5)}
        >
          <Rect
            width={frameWidth}
            height={frameHeight}
            fill="white"
            stroke="black"
            strokeWidth={1}
            onClick={(e) => {
              console.log(e.evt);
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
            fill="black"
          />
        </Group>
      ))}
    </Group>
  );
};

export default Scene;
