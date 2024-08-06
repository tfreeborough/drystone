import {ReactElement, useContext} from "react";
import css from './CanvasEditor.module.scss';
import {AppContext} from "../../../stores/AppContext.ts";
import FlowCanvas from "../FlowCanvas/FlowCanvas.tsx";
import {ReactFlowProvider} from "@xyflow/react";


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
    </div>
  )
}

export default CanvasEditor;
