import { FrameTipTap } from '../FrameTipTap/FrameTipTap.tsx';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { JSONContent } from '@tiptap/react';
import { Align, FlexDirection, Frame, Gap } from '@shared/types';
import css from './FrameEditor.module.scss';
import Heading from '../../atoms/Heading/Heading.tsx';
import { Flex } from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FrameEditorProps {
  frame: Frame;
  onUpdate: (frame: Frame) => void;
  onBack: () => void;
}
function FrameEditor({ frame, onUpdate, onBack }: FrameEditorProps) {
  const { ApplicationStore } = useContext(AppContext);

  const editorContext = ApplicationStore.editorContext;
  const application = ApplicationStore.current;
  function handleUpdateFrame(content: JSONContent) {
    if (application) {
      const updatedFrame: Frame = {
        ...(frame as Frame),
        nodes: content,
      };
      onUpdate(updatedFrame);
    }
  }

  function handleGoBack() {
    onBack();
  }

  if (!editorContext || !application) {
    return <></>;
  }

  const frameNumber = editorContext.frames.findIndex(f => f.id === frame.id);

  return (
    <Flex
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      gap={Gap.MD}
      className={css.frameEditor}
    >
      <div className={css.back} onClick={handleGoBack}>
        <FontAwesomeIcon icon="chevron-left" /> Back
      </div>
      <Heading>Edit Frame #{frameNumber + 1}</Heading>
      <FrameTipTap
        frame={frame}
        onUpdate={handleUpdateFrame}
        application={application}
      />
    </Flex>
  );
}

export default observer(FrameEditor);
