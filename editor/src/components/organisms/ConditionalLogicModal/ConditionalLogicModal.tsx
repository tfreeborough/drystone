import { observer } from 'mobx-react-lite';
import { Align, Condition, FlexDirection, Gap } from '@shared/types';

import css from './ConditionalLogicModal.module.scss';
import Muted from '../../atoms/Muted/Muted.tsx';
import { CheckboxInput, Flex, ToggleBox } from '@shared/components';
import { Fragment, useContext, useState } from 'react';
import { AddConditionForm } from '../../molecules/AddConditionForm/AddConditionForm.tsx';
import { ConditionDisplay } from '../../atoms/ConditionDisplay/ConditionDisplay.tsx';
import Label from '../../atoms/Label/Label.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import TextInput from '../../atoms/TextInput/TextInput.tsx';

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
    const [showAsDisabled, setShowAsDisabled] = useState<boolean>(
      choice.showAsDisabled ?? false,
    );
    const [showAsDisabledText, setShowAsDisabledText] = useState<string>(
      choice.showAsDisabledText ?? 'Unavailable',
    );

    function handleChangeShowAsDisabled(showAsDisabled: boolean) {
      if (extra && choice) {
        setShowAsDisabled(showAsDisabled);
        console.log('updated choice');
        ApplicationStore.updateChoice(extra?.applicationId, extra?.sceneId, {
          ...choice,
          showAsDisabled,
          showAsDisabledText,
        });
      }
    }

    function handleChangeShowAsDisabledText(showAsDisabledText: string) {
      if (extra && choice) {
        setShowAsDisabledText(showAsDisabledText);
        console.log('updated choice disabled text');
        ApplicationStore.updateChoice(extra?.applicationId, extra?.sceneId, {
          ...choice,
          showAsDisabled,
          showAsDisabledText,
        });
      }
    }

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

    function handleDeleteCondition(id: string) {
      if (extra) {
        ApplicationStore.removeCondition(
          extra.applicationId,
          extra.sceneId,
          extra.choiceId,
          id,
        );
      }
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
                  onDelete={handleDeleteCondition}
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
        <CheckboxInput
          value={showAsDisabled}
          onChange={handleChangeShowAsDisabled}
          label="Show as disabled?"
        />
        {showAsDisabled && (
          <TextInput
            label="Text to show in brackets when disabled"
            value={showAsDisabledText}
            onChange={handleChangeShowAsDisabledText}
          />
        )}
      </Flex>
    );
  },
);
