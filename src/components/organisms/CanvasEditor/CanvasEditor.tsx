import {ReactElement} from "react";
import Topper from "../../atoms/Topper/Topper.tsx";
import css from './CanvasEditor.module.scss';
import InfiniteCanvas from "../InfiniteCanvas/InfiniteCanvas.tsx";


function CanvasEditor(): ReactElement{
  return (
    <div className={css.canvasEditor}>
      <InfiniteCanvas />
    </div>
  )
}

export default CanvasEditor;
