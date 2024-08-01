import {ReactElement, useContext, useRef} from "react";
import { v4 } from 'uuid';
import {Application} from "../../../../types/application.types.ts";
import {useClickOutsideRef} from "../../../../hooks/useClickOutsideRef.ts";
import css from './ApplicationEditorMenu.module.scss';
import {AppContext} from "../../../../stores/AppContext.ts";

interface ApplicationEditorMenuProps {
  x: number,
  y: number,
  pointerX: number,
  pointerY: number,
  onClose: () => void,
  application: Application,
  type: string,
  context: string,
}

function ApplicationEditorMenu({ x, y, pointerX, pointerY, onClose, application, type, context }: ApplicationEditorMenuProps): ReactElement {
  const menuRef = useRef(null);

  const {
    ApplicationStore,
  } = useContext(AppContext);

  useClickOutsideRef(menuRef, () => {
    onClose()
  })

  function handleNewScene(){
    ApplicationStore.addScene(application.id, {
      id: v4(),
      frames: [],
      position: { x: pointerX, y: pointerY }
    })
    onClose();
  }

  function handleRemoveScene() {
    ApplicationStore.removeScene(application.id, context);
    onClose();
  }

  function handleNewFrame() {
    ApplicationStore.addFrame(application.id, context, {
      id: v4(),
      nodes: [],
    });
    onClose();
  }

  function handleRemoveFrame(){
    ApplicationStore.removeFrame(application.id, context);
    onClose();
  }

  function handleEditFrame(){
    const frame = ApplicationStore.getFrame(application.id, context);
    ApplicationStore.setEditorContext(frame);
  }

  function renderMenu(){
    switch (type){
      case "application":
        return (
          <>
            <button onClick={handleNewScene}>New Scene</button>
          </>
        )
      case "scene":
        return (
          <>
            <button onClick={handleNewFrame}>New Frame</button>
            <button onClick={handleRemoveScene}>Remove scene</button>
          </>
        )
      case "frame":
        return (
          <>
            <button onClick={handleEditFrame}>Edit frame</button>
            <button onClick={handleRemoveFrame}>Remove frame</button>
          </>
        )
    }
  }

  return (
    <div className={css.applicationEditorMenu} ref={menuRef} style={{position: 'absolute', top: y, left: x, background: 'white', border: '1px solid black'}}>
      { renderMenu() }
    </div>
  )
}

export default ApplicationEditorMenu;
