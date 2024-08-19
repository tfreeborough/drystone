import React, {useContext} from 'react';
import { v4 } from 'uuid';
import css from './PanelContextMenu.module.scss';
import {Scene} from "../../../types/application.types.ts";
import {AppContext} from "../../../stores/AppContext.ts";
import {useReactFlow, Viewport} from "@xyflow/react";

function PanelContextMenu({
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const {
    ApplicationStore,
  } = useContext(AppContext);

  const reactFlowInstance = useReactFlow();

  function createScene(event){
    event.preventDefault();
    const currentApplication = ApplicationStore.current;

    if(currentApplication){
      const { zoom, x: panX, y: panY }: Viewport = reactFlowInstance.getViewport();
      const sceneId = v4();
      const newScene: Scene = {
        id: sceneId,
        type: "scene",
        metadata: {
          note: `New scene: ${sceneId}`,
        },
        frames: [],
        position: {
          x: ((-1 * panX) + left) / zoom,
          y: ((-1 * panY) + top) / zoom,
        },
        choices: []
      }
      ApplicationStore.addScene(currentApplication.id, newScene);
    }

  }

  return (
    <div
      style={{ top, left, right, bottom }}
      className={css.panelContextMenu}
      {...props}
    >
      <button onClick={createScene}>Create new Scene</button>
    </div>
  );
}

export default PanelContextMenu;
