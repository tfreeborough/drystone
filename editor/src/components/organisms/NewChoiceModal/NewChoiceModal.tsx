import { useContext, useState } from 'react';
import css from './NewChoiceModal.module.scss';
import {
  FlexAlign,
  FlexDirection,
  FlexGap,
  FlexJustify,
} from '../../atoms/Flex/Flex.types.ts';
import Flex from '../../atoms/Flex/Flex.tsx';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { Connection } from '@xyflow/react';
import { Button } from '@shared/components';

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
        gap={FlexGap.XS}
        alignItems={FlexAlign.STRETCH}
        flexDirection={FlexDirection.COLUMN}
      >
        <TextInput
          autoFocus
          label="What should this choice say?"
          placeholder="Enter some text"
          value={label}
          onChange={value => setLabel(value)}
        />
        <Flex gap={FlexGap.SM} justifyContent={FlexJustify.SPACE_BETWEEN}>
          <Button onClick={handleSubmit}>Create link</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default NewChoiceModal;
