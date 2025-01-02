import { useContext, useState } from 'react';
import css from './NewChoiceModal.module.scss';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { Connection } from '@xyflow/react';
import { Button, Flex } from '@shared/components';
import { Align, FlexDirection, Gap, Justify } from '@shared/types';

interface NewChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  edgeInfo: Connection | null;
}

const NewChoiceModal = ({ isOpen, onClose, edgeInfo }: NewChoiceModalProps) => {
  const { ApplicationStore } = useContext(AppContext);

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
      onClose();
    }
  }

  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  return (
    <div className={css.backdrop}>
      <Flex
        className={css.card}
        gap={Gap.XS}
        alignItems={Align.STRETCH}
        flexDirection={FlexDirection.COLUMN}
      >
        <TextInput
          autoFocus
          label="What should this choice say?"
          placeholder="Enter some text"
          value={label}
          onChange={value => setLabel(value)}
        />
        <Flex gap={Gap.SM} justifyContent={Justify.SPACE_BETWEEN}>
          <Button onClick={handleSubmit}>Create link</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default NewChoiceModal;
