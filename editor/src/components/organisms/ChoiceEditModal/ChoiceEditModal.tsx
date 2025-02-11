import { observer } from 'mobx-react-lite';
import { Align, EditorEvents, FlexDirection, Gap } from '@shared/types';

import css from './ChoiceEditModal.module.scss';
import { Flex } from '@shared/components';
import { useContext, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import venti from 'venti-js';
import { useDebouncedEffect } from '@shared/hooks';

interface ChoiceEditModalProps {
  extra?: { choiceId: string; applicationId: string; sceneId: string };
}

export const ChoiceEditModal = observer(({ extra }: ChoiceEditModalProps) => {
  if (!extra) {
    return null;
  }
  const { ApplicationStore } = useContext(AppContext);

  const choice = ApplicationStore.getChoice(
    extra.applicationId,
    extra.choiceId,
  );
  if (!choice) {
    return null;
  }

  const [label, setLabel] = useState(choice.label ?? '');

  function handleSaveChoice() {
    if (extra && choice) {
      ApplicationStore.updateChoice(extra.applicationId, extra.sceneId, {
        ...choice,
        label,
      });
      venti.trigger(EditorEvents.RERENDER);
    }
  }

  async function handleUpdateLabel(value: string) {
    setLabel(value);
  }

  useDebouncedEffect(
    () => {
      handleSaveChoice();
    },
    [label],
    500,
  );

  if (!choice) {
    return null;
  }

  return (
    <Flex
      className={css.choiceEditModal}
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.SM}
      alignItems={Align.STRETCH}
    >
      <TextInput
        label="Choice text"
        value={label}
        onChange={handleUpdateLabel}
      />
    </Flex>
  );
});
