import {observer} from "mobx-react-lite";
import {Scene} from "../../../types/application.types.ts";
import TextInput from "../../atoms/TextInput/TextInput.tsx";

import css from './SceneEditor.module.scss';

interface SceneEditorProps {
  scene: Scene,
  onUpdate: (scene: Scene) => void,
}

function SceneEditor({ scene, onUpdate }: SceneEditorProps){

  function handleUpdateNote(value){
    onUpdate({
      ...scene,
      metadata: {
        ...scene.metadata,
        note: value,
      }
    })
  }

  return (
    <div className={css.sceneEditor}>
      <TextInput value={scene.metadata?.note ?? ""} onChange={handleUpdateNote} label="Note" fullWidth />
    </div>
  )
}

export default observer(SceneEditor);
