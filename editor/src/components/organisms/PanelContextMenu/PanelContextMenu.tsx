import { useContext } from 'react';
import { v4 } from 'uuid';
import css from './PanelContextMenu.module.scss';
import { Scene } from '@shared/types';
import { AppContext } from '../../../stores/AppContext.ts';
import { useReactFlow, Viewport } from '@xyflow/react';
import { Button } from '@shared/components';

interface PanelContextMenuProps {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

function PanelContextMenu({
  top,
  left,
  right,
  bottom,
  ...props
}: PanelContextMenuProps) {
  const { ApplicationStore } = useContext(AppContext);

  const reactFlowInstance = useReactFlow();

  function createScene(event: any) {
    event.preventDefault();
    const currentApplication = ApplicationStore.current;

    if (currentApplication) {
      const {
        zoom,
        x: panX,
        y: panY,
      }: Viewport = reactFlowInstance.getViewport();
      const sceneId = v4();
      const newScene: Scene = {
        id: sceneId,
        type: 'scene',
        metadata: {
          note: `Scene ${currentApplication.scenes.length + 1}`,
        },
        frames: [],
        position: {
          x: (-1 * panX + left) / zoom,
          y: (-1 * panY + top) / zoom,
        },
        choices: [],
      };
      /**
       * If this is the first scene, we should also set the entrypoint of the app to this one otherwise if a user exports
       * the app there will be nice entrypoint and it will break;
       */
      if (currentApplication.scenes.length === 0) {
        ApplicationStore.updateEntrypoint(currentApplication.id, sceneId);
      }

      /**
       * Add the scene.
       */
      ApplicationStore.addScene(currentApplication.id, newScene);
    }
  }

  return (
    <div
      style={{ top, left, right, bottom }}
      className={css.panelContextMenu}
      {...props}
    >
      <Button onClick={createScene}>Create new Scene</Button>
    </div>
  );
}

export default PanelContextMenu;
