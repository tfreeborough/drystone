import { observer } from "mobx-react-lite";
import {useContext, useRef} from "react";

import {AppContext} from "../../../stores/AppContext.ts";
import {useClickOutsideRef} from "../../../hooks/useClickOutsideRef.ts";
import {AnimatePresence, motion} from "framer-motion";
import css from './ContextEditor.module.scss';
import FrameTipTap from "../FrameTipTap/FrameTipTap.tsx";
import {Frame} from "../../../types/application.types.ts";
import {JSONContent} from "@tiptap/react";



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
        ...editorContext,
        nodes: content,
      }
      ApplicationStore.updateFrame(application.id, updatedFrame);
    }
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
              <FrameTipTap frame={editorContext} onUpdate={handleUpdateFrame} />
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>

  );
}

export default observer(ContextEditor);
