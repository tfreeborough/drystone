import {ReactElement} from "react";
import Topper from "../../atoms/Topper/Topper.tsx";
import css from './MetadataEditor.module.scss';


function MetadataEditor(): ReactElement{
  return (
    <div className={css.metadataEditor}>
      <Topper noNegativeMargin>Metadata</Topper>
    </div>
  )
}

export default MetadataEditor;
