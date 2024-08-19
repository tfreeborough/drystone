import React, {ReactElement, useContext} from "react";
import css from './CanvasEditor.module.scss';
import { observer } from "mobx-react-lite";
import {AppContext} from "../../../stores/AppContext.ts";
import FlowCanvas from "../FlowCanvas/FlowCanvas.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import ContextEditor from "../ContextEditor/ContextEditor.tsx";


function CanvasEditor(): ReactElement{
  const {
    ApplicationStore
  } = useContext(AppContext);

  const application = ApplicationStore.current;
  if(!application){
    return <>No application selected to render canvas</>
  }
  return (
    <div className={css.canvasEditor}>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
      {
        ApplicationStore.editorContext && (
          <ContextEditor />
        )
      }
    </div>
  )
}

export default observer(CanvasEditor);
