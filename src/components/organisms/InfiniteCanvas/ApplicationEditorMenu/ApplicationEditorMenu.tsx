import {ReactElement, useRef} from "react";
import {Application} from "../../../../types/application.types.ts";
import {useClickOutsideRef} from "../../../../hooks/useClickOutsideRef.ts";

interface ApplicationEditorMenuProps {
  x: number,
  y: number,
  onClose: () => void,
  application: Application,
}

function ApplicationEditorMenu({ x, y, onClose, application }: ApplicationEditorMenuProps): ReactElement {

  const menuRef = useRef(null);

  useClickOutsideRef(menuRef, () => {
    onClose()
  })

  return (
    <div ref={menuRef} style={{position: 'absolute', top: y, left: x, background: 'white', border: '1px solid black'}}>
      <button onClick={onClose}>Option 1</button>
      <button onClick={onClose}>Option 2</button>
      <button onClick={onClose}>{ application.name }</button>
    </div>
  )
}

export default ApplicationEditorMenu;
