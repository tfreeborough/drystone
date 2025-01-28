import { Trigger, Gap, Justify } from '@shared/types';
import { DeleteIcon, Flex } from '@shared/components';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';

import css from './TriggerDisplay.module.scss';

interface TriggerDisplayProps {
  trigger: Trigger;
  applicationId: string;
  sceneId: string;
  choiceId: string;
}

export const TriggerDisplay = observer(
  ({ trigger, applicationId, sceneId, choiceId }: TriggerDisplayProps) => {
    const { ApplicationStore } = useContext(AppContext);
    const current = ApplicationStore.current;
    if (!current) {
      return null;
    }
    const variable = current.variables.find(v => v.id === trigger.variableId);
    if (!variable) {
      return (
        <span>Trigger can't be displayed as variable no longer exists.</span>
      );
    }

    function handleDelete() {
      ApplicationStore.removeTrigger(
        applicationId,
        sceneId,
        choiceId,
        trigger.id,
      );
    }

    function renderOperatorLogic() {
      if (variable) {
        switch (trigger.operator) {
          case '=':
            return (
              <Flex gap={Gap.XS}>
                <span>set</span>
                <span className={css.variable}>{variable.name}</span>
                <span>to</span>
                <span className={css.triggerValue}>
                  {trigger.triggerValue.toString()}
                </span>
              </Flex>
            );
          case '+':
          case '-':
          case '*':
          case '/':
            return (
              <Flex gap={Gap.XS}>
                <span>set</span>
                <span className={css.variable}>{variable.name}</span>
                <span>to</span>
                <span className={css.variable}>{variable.name}</span>
                <span className={css.operator}>{trigger.operator}</span>
                <span className={css.triggerValue}>
                  {trigger.triggerValue.toString()}
                </span>
              </Flex>
            );
        }
      }
      return null;
    }

    return (
      <Flex
        className={css.triggerDisplay}
        gap={Gap.XS}
        justifyContent={Justify.SPACE_BETWEEN}
      >
        {renderOperatorLogic()}
        <Flex>
          <DeleteIcon onClick={handleDelete} />
        </Flex>
      </Flex>
    );
  },
);
