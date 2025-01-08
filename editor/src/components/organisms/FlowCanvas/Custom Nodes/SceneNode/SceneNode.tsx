import { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { observer } from 'mobx-react-lite';
import css from './SceneNode.module.scss';
import { Choice, Scene } from '@shared/types';
import { AppContext } from '../../../../../stores/AppContext.ts';

interface SceneNodePropsType {
  id: string;
  data: SceneDataType;
}
interface SceneDataType {
  label: string;
  scene: Scene;
  incomingConnections: Choice[];
  connectedScenes: Scene[];
}

function SceneNode({ data, id }: SceneNodePropsType) {
  const { ApplicationStore } = useContext(AppContext);

  const context = ApplicationStore.editorContext;
  const selected = context?.id === id;

  const handleSize = '0.4rem';

  const minWidth = Math.max(
    150, // default minimum width
    (data.incomingConnections?.length || 1) * 120,
  );

  const padding = 10;
  const getHandlePosition = (
    index: number,
    total: number,
    nodeWidth: number,
  ) => {
    if (total === 1) {
      return '50%'; // Center single handle
    }

    const usableWidth = nodeWidth - padding * 2;
    const segment = usableWidth / (total - 1);

    if (index === 0) return `${padding}px`;
    if (index === total - 1) return `calc(100% - ${padding}px)`;

    return `${padding + segment * index}px`;
  };

  const isEnding = data.scene.choices.length === 0;

  const connectedScenes = data.connectedScenes;

  const sortedChoices = data.scene.choices.slice().sort((a, b) => {
    const aScene = connectedScenes.find(s => s.id === a.target);
    const bScene = connectedScenes.find(s => s.id === b.target);
    if (aScene && bScene) {
      return aScene.position.x - bScene.position.x;
    }
    return 0;
  });

  return (
    <>
      {data.incomingConnections?.length > 0 ? (
        // Existing incoming connection handles
        data.incomingConnections.map((connection, index) => (
          <Handle
            key={connection.id}
            type="target"
            position={Position.Top}
            id={connection.id}
            style={{
              left: getHandlePosition(
                index,
                data.incomingConnections.length,
                minWidth,
              ),
            }}
          />
        ))
      ) : (
        // Default top handle when no incoming connections
        <Handle
          type="target"
          position={Position.Top}
          id="default-target"
          style={{
            left: '50%',
            width: handleSize,
            height: handleSize,
          }}
        />
      )}
      <div
        className={`${css.sceneNode} ${selected ? css.selected : ''} ${isEnding ? css.ending : ''}`}
        style={{
          width: minWidth,
          minWidth: minWidth,
        }}
      >
        <div className={css.note}>
          {isEnding && '[ENDING]'} {data.label}
        </div>
        <div className={css.metadata}>{data.scene.frames.length} Frames</div>
      </div>
      {data.scene.choices.length > 0 ? (
        sortedChoices.map((choice, index) => (
          <Handle
            key={choice.id}
            type="source"
            position={Position.Bottom}
            id={choice.id}
            style={{
              left: `${(index + 1) * (100 / (data.scene.choices.length + 1))}%`,
            }}
          />
        ))
      ) : (
        // Default handle when no choices exist
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          style={{
            left: '50%',
            width: handleSize,
            height: handleSize,
            background: 'gray',
          }}
        />
      )}
    </>
  );
}

export default observer(SceneNode);
