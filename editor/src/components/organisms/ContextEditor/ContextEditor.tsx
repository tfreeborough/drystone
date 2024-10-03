import { observer } from 'mobx-react-lite';
import { useContext, useRef, useState } from 'react';

import { AppContext } from '../../../stores/AppContext.ts';
import { useClickOutsideRef } from '../../../hooks/useClickOutsideRef.ts';
import { AnimatePresence, motion } from 'framer-motion';
import css from './ContextEditor.module.scss';
import { Frame, Scene } from 'drystone';
import SceneEditor from '../SceneEditor/SceneEditor.tsx';
import FrameEditor from '../FrameEditor/FrameEditor.tsx';

function ContextEditor() {
  const { ApplicationStore } = useContext(AppContext);

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  const contextEditorRef = useRef<HTMLDivElement | null>(null);

  const editorContext = ApplicationStore.editorContext;
  const application = ApplicationStore.current;

  useClickOutsideRef(contextEditorRef, () => {
    ApplicationStore.setEditorContext(null);
  });

  function handleUpdateScene(scene: Scene) {
    if (application && editorContext) {
      ApplicationStore.setEditorContext(scene);
      ApplicationStore.updateScene(application.id, scene);
    }
  }

  function handleUpdateFrame(frame: Frame) {
    if (application && editorContext) {
      const foundFrame = editorContext.frames.findIndex(f => f.id === frame.id);
      if (foundFrame > -1) {
        const newScene: Scene = {
          ...editorContext,
          frames: [
            ...editorContext.frames.slice(0, foundFrame),
            frame,
            ...editorContext.frames.slice(foundFrame + 1),
          ],
        };
        handleUpdateScene(newScene);
      }
    }
  }

  function handleSelectFrame(frame: Frame | null) {
    setSelectedFrame(frame);
  }

  function handleClearFrame() {
    setSelectedFrame(null);
  }

  function renderContext() {
    if (ApplicationStore.editorContext) {
      if (selectedFrame) {
        return (
          <FrameEditor
            frame={selectedFrame}
            onUpdate={handleUpdateFrame}
            onBack={handleClearFrame}
          />
        );
      }

      return (
        <SceneEditor
          scene={ApplicationStore.editorContext as Scene}
          onUpdate={handleUpdateScene}
          onSelectFrame={handleSelectFrame}
        />
      );
    }
    return null;
  }

  return (
    <AnimatePresence>
      {editorContext && (
        <motion.div
          ref={contextEditorRef}
          className={css.contextEditor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
          }}
        >
          <div>{renderContext()}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default observer(ContextEditor);
