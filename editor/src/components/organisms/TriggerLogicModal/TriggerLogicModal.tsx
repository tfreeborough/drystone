import { observer } from 'mobx-react-lite';
import { Align, FlexDirection, Gap, Trigger } from '@shared/types';

import css from './TriggerLogicModal.module.scss';
import Muted from '../../atoms/Muted/Muted.tsx';
import { ToggleBox } from '@shared/components/ToggleBox/ToggleBox.tsx';
import { Flex } from '@shared/components';
import { useContext, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import Label from '../../atoms/Label/Label.tsx';
import { TriggerDisplay } from '../../atoms/TriggerDisplay/TriggerDisplay.tsx';
import { AddTriggerForm } from '../../molecules/AddTriggerForm/AddTriggerForm.tsx';

interface TriggerLogicModalProps {
  extra?: { choiceId: string; applicationId: string; sceneId: string };
}

export const TriggerLogicModal = observer(
  ({ extra }: TriggerLogicModalProps) => {
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

    const [addNewOpen, setAddNewOpen] = useState<boolean>(false);

    function handleAddTrigger(trigger: Trigger) {
      if (extra) {
        ApplicationStore.addChoiceTrigger(
          extra.applicationId,
          extra.sceneId,
          extra.choiceId,
          trigger,
        );
      }

      setAddNewOpen(false);
    }

    if (!choice) {
      return null;
    }
    const triggers = choice.triggers ?? [];

    return (
      <Flex
        className={css.triggerLogicModal}
        flexDirection={FlexDirection.COLUMN}
        gap={Gap.SM}
        alignItems={Align.STRETCH}
      >
        <Muted>
          Triggers are used to manipulate variables in response to a choice
          being selected. Each trigger for a choice is performed in sequence and
          can be used to set values or perform simple arithmetic.
        </Muted>
        <Flex
          className={css.triggers}
          alignItems={Align.STRETCH}
          flexDirection={FlexDirection.COLUMN}
          gap={Gap.XS}
        >
          {triggers.length === 0 && (
            <Muted>You have no added any triggers yet.</Muted>
          )}
          {triggers.length > 0 && (
            <Label>Run the following actions in sequence</Label>
          )}
          {triggers.map(trigger => {
            return (
              <TriggerDisplay
                key={trigger.id}
                trigger={trigger}
                choiceId={extra.choiceId}
                applicationId={extra.applicationId}
                sceneId={extra.sceneId}
              />
            );
          })}
        </Flex>
        <hr />
        <ToggleBox
          title="Add new trigger"
          value={addNewOpen}
          onToggle={value => setAddNewOpen(value)}
        >
          <AddTriggerForm onAdd={handleAddTrigger} />
        </ToggleBox>
      </Flex>
    );
  },
);
