import { observer } from "mobx-react-lite";
import {useContext, useRef} from "react";

import {AppContext} from "../../../stores/AppContext.ts";
import {useClickOutsideRef} from "../../../hooks/useClickOutsideRef.ts";
import {AnimatePresence, motion} from "framer-motion";
import css from './ContextEditor.module.scss';
import FrameTipTap from "../FrameTipTap/FrameTipTap.tsx";
import {Frame, Scene} from "../../../types/application.types.ts";
import {JSONContent} from "@tiptap/react";
import SceneEditor from "../SceneEditor/SceneEditor.tsx";



function ContextEditor(){
  const {
    ApplicationStore
  } = useContext(AppContext);

  const contextEditorRef = useRef<HTMLDivElement | null>(null);

  const editorContext = ApplicationStore.editorContext;
  const application =ApplicationStore.current;



  useClickOutsideRef(contextEditorRef, () => {
    ApplicationStore.setEditorContext(null);
  })

  function handleUpdateFrame(content: JSONContent){
    if(application && editorContext){
      const updatedFrame: Frame = {
        ...editorContext as Frame,
        nodes: content,
      }
      ApplicationStore.updateFrame(application.id, updatedFrame);
    }
  }

  function handleUpdateScene(scene: Scene){
    if(application && editorContext){
      ApplicationStore.setEditorContext(scene);
      ApplicationStore.updateScene(application.id, scene);
    }
  }

  function renderContext(){
    if(ApplicationStore.editorContext){
      switch (editorContext?.type) {
        case "frame":
          return <FrameTipTap frame={editorContext} onUpdate={handleUpdateFrame} />
        case "scene":
          return (
            <SceneEditor scene={ApplicationStore.editorContext as Scene} onUpdate={handleUpdateScene} />
          )
      }
    }
    return null;
  }

  return (
    <AnimatePresence>
      {
        editorContext && (
          <motion.div
            ref={contextEditorRef}
            className={css.contextEditor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3
            }}
          >
            <div>
              { renderContext() }
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>

  );
}

export default observer(ContextEditor);
