import { observer } from 'mobx-react-lite';
import { Align, Condition, FlexDirection, Gap } from '@shared/types';

import css from './ConditionalLogicModal.module.scss';
import Muted from '../../atoms/Muted/Muted.tsx';
import { ToggleBox } from '@shared/components/ToggleBox/ToggleBox.tsx';
import { Flex } from '@shared/components';
import { Fragment, useContext, useState } from 'react';
import { AddConditionForm } from '../../molecules/AddConditionForm/AddConditionForm.tsx';
import { ConditionDisplay } from '../../atoms/ConditionDisplay/ConditionDisplay.tsx';
import Label from '../../atoms/Label/Label.tsx';
import { AppContext } from '../../../stores/AppContext.ts';

interface ConditionalLogicModalProps {
  extra?: { choiceId: string; applicationId: string; sceneId: string };
}

export const ConditionalLogicModal = observer(
  ({ extra }: ConditionalLogicModalProps) => {
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

    function handleAddCondition(condition: Condition) {
      if (extra) {
        ApplicationStore.addChoiceCondition(
          extra.applicationId,
          extra.sceneId,
          extra.choiceId,
          condition,
        );
      }

      setAddNewOpen(false);
    }

    if (!choice) {
      return null;
    }

    const conditions = choice.conditions ?? [];

    return (
      <Flex
        className={css.conditionalLogicModal}
        flexDirection={FlexDirection.COLUMN}
        gap={Gap.SM}
        alignItems={Align.STRETCH}
      >
        <Muted>
          Conditions can be used to avoid showing certain choices to users until
          the conditions are met. All conditions must be met in order to show a
          choice. A choice with no conditions will show as normal.
        </Muted>
        <Flex
          className={css.conditions}
          alignItems={Align.STRETCH}
          flexDirection={FlexDirection.COLUMN}
          gap={Gap.XS}
        >
          {conditions.length === 0 && (
            <Muted>You have no added any conditions yet.</Muted>
          )}
          {conditions.length > 0 && <Label>Only render this choice IF</Label>}
          {conditions.map((condition, index) => {
            const isLast = index === conditions.length - 1;
            return (
              <Fragment key={condition.id}>
                <ConditionDisplay
                  condition={condition}
                  choiceId={extra.choiceId}
                  applicationId={extra.applicationId}
                  sceneId={extra.sceneId}
                />
                {!isLast && <Muted>AND</Muted>}
              </Fragment>
            );
          })}
        </Flex>
        <hr />
        <ToggleBox
          title="Add new condition"
          value={addNewOpen}
          onToggle={value => setAddNewOpen(value)}
        >
          <AddConditionForm onAdd={handleAddCondition} />
        </ToggleBox>
      </Flex>
    );
  },
);
