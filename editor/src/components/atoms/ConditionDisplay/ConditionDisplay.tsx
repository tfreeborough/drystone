import { Condition, Gap, Justify } from '@shared/types';
import { DeleteIcon, Flex } from '@shared/components';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';

import css from './ConditionDisplay.module.scss';

interface ConditionDisplayProps {
  condition: Condition;
  applicationId: string;
  sceneId: string;
  choiceId: string;
}

export const ConditionDisplay = observer(
  ({ condition, applicationId, sceneId, choiceId }: ConditionDisplayProps) => {
    const { ApplicationStore } = useContext(AppContext);
    const current = ApplicationStore.current;
    if (!current) {
      return null;
    }
    const variable = current.variables.find(v => v.id === condition.variableId);
    if (!variable) {
      return (
        <span>Condition can't be displayed as variable no longer exists.</span>
      );
    }

    function handleDelete() {
      ApplicationStore.removeCondition(
        applicationId,
        sceneId,
        choiceId,
        condition.id,
      );
    }

    return (
      <Flex
        className={css.conditionDisplay}
        gap={Gap.XS}
        justifyContent={Justify.SPACE_BETWEEN}
      >
        <Flex gap={Gap.XS}>
          <span className={css.variable}>{variable.name}</span>
          <span className={css.operator}>{condition.operator}</span>
          <span className={css.conditionValue}>
            {condition.conditionValue.toString()}
          </span>
        </Flex>
        <Flex>
          <DeleteIcon onClick={handleDelete} />
        </Flex>
      </Flex>
    );
  },
);
