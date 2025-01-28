import { useContext, useState } from 'react';
import css from './NewChoiceModal.module.scss';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { Connection } from '@xyflow/react';
import { Button, Flex, ModalContext } from '@shared/components';
import { Align, FlexDirection, Gap, Justify } from '@shared/types';

interface NewChoiceModalProps {
  extra?: { edgeInfo: Connection };
}

const NewChoiceModal = ({ extra }: NewChoiceModalProps) => {
  const { removeModal } = useContext(ModalContext);
  const { ApplicationStore } = useContext(AppContext);

  if (!extra) {
    return null;
  }

  const edgeInfo = extra.edgeInfo;

  function handleClose() {
    removeModal('new-choice-modal');
  }

  function handleSubmit() {
    const current = ApplicationStore.current;
    if (current && label.trim().length > 0 && edgeInfo) {
      ApplicationStore.addChoice(
        current.id,
        edgeInfo.source,
        edgeInfo.target,
        label,
      );
      setLabel('');
      handleClose();
    }
  }

  const [label, setLabel] = useState('');

  return (
    <Flex
      className={css.newChoiceModal}
      gap={Gap.MD}
      alignItems={Align.STRETCH}
      flexDirection={FlexDirection.COLUMN}
    >
      <Flex
        flexDirection={FlexDirection.COLUMN}
        gap={Gap.XS}
        alignItems={Align.STRETCH}
      >
        <TextInput
          autoFocus
          label="What should this choice say?"
          placeholder="Enter some text"
          value={label}
          onChange={value => setLabel(value)}
        />
      </Flex>
      <Flex gap={Gap.SM} justifyContent={Justify.SPACE_BETWEEN}>
        <Button onClick={handleSubmit}>Create link</Button>
        <Button onClick={handleClose} negative>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default NewChoiceModal;
