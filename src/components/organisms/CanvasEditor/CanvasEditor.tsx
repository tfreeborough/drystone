import {ReactElement, useContext} from "react";
import Topper from "../../atoms/Topper/Topper.tsx";
import css from './CanvasEditor.module.scss';
import InfiniteCanvas from "../InfiniteCanvas/InfiniteCanvas.tsx";
import {AppContext} from "../../../stores/AppContext.ts";


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
      <InfiniteCanvas application={application} />
    </div>
  )
}

export default CanvasEditor;
