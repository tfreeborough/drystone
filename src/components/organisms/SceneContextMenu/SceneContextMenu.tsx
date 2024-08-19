import css from './SceneContextMenu.module.scss';
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";

interface SceneContextMenuProps {
  id: string,
  top: number,
  left: number,
  onClose: () => void,
}

function SceneContextMenu({ top, left, onClose, id }: SceneContextMenuProps){
  const {
    ApplicationStore,
  } = useContext(AppContext);
  function handleDelete(){
    const currentApplication = ApplicationStore.current;
    if(currentApplication){
      ApplicationStore.removeScene(currentApplication.id, id)
      onClose();
    }
  }

  return (
    <div className={css.sceneContextMenu} style={{
      top,
      left,
    }}>
      <button onClick={handleDelete}>Delete Scene</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}


export default observer(SceneContextMenu);
