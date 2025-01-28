import {
  ApplicationVariable,
  ApplicationVariableType,
  Condition,
  ConditionOperator,
  FlexDirection,
  Gap,
  SelectOption,
} from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';

import css from './AddConditionForm.module.scss';
import { Button, Flex } from '@shared/components';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { v4 } from 'uuid';

interface AddConditionFormProps {
  onAdd: (condition: Condition) => void;
}

export const AddConditionForm = observer(({ onAdd }: AddConditionFormProps) => {
  const [variable, setVariable] = useState<ApplicationVariable | null>(null);
  const [operator, setOperator] = useState<ConditionOperator>('==');
  const [conditionValue, setConditionValue] = useState<
    string | number | boolean | null
  >(null);
  const { ApplicationStore } = useContext(AppContext);

  const current = ApplicationStore.current;
  if (!current) {
    return null;
  }

  const variables = current.variables;

  function handleAdd() {
    if (variable && conditionValue) {
      const newCondition: Condition = {
        id: v4(),
        variableId: variable?.id,
        operator,
        conditionValue,
      };
      onAdd(newCondition);
    }
  }

  function handleSelectVariable(option: SelectOption | null) {
    if (option && option.value.length > 0 && current) {
      const foundVariable = current.variables.find(
        variable => variable.id === option.value,
      );
      if (foundVariable) {
        if (foundVariable.type !== variable?.type) {
          setOperator('==');
          switch (foundVariable.type) {
            case ApplicationVariableType.STRING:
              setConditionValue('');
              break;
            case ApplicationVariableType.NUMBER:
              setConditionValue(0);
              break;
            case ApplicationVariableType.BOOLEAN:
              setConditionValue(true);
              break;
          }
        }
        setVariable(foundVariable);
      }
    } else {
      setVariable(null);
      setConditionValue(null);
    }
  }

  function handleSelectOperator(option: SelectOption | null) {
    if (option) {
      setOperator(option.value as ConditionOperator);
    }
  }

  function getOperatorOptions() {
    if (variable) {
      switch (variable.type) {
        case ApplicationVariableType.STRING:
          return [
            { text: '== (is equal to)', value: '==' },
            { text: '!= (is NOT equal to)', value: '!=' },
          ];
        case ApplicationVariableType.BOOLEAN:
          return [
            { text: '== (is equal to)', value: '==' },
            { text: '!= (is NOT equal to)', value: '!=' },
          ];
        case ApplicationVariableType.NUMBER:
          return [
            { text: '== (is equal to)', value: '==' },
            { text: '!= (is NOT equal to)', value: '!=' },
            { text: '< (is less than)', value: '<' },
            { text: '<= (is less than or equal to)', value: '<=' },
            { text: '> (is greater than)', value: '>' },
            { text: '>= (is greater than or equal to)', value: '>=' },
          ];
      }
    }
    return [];
  }

  function handleChangeConditionValue(value: string | number | boolean) {
    setConditionValue(value);
  }

  function handleChangeConditionValueFromSelect(
    option: SelectOption<boolean> | null,
  ) {
    if (option) {
      setConditionValue(option.value);
    }
  }

  function renderConditionValue() {
    switch (variable?.type) {
      case ApplicationVariableType.STRING:
        return (
          <TextInput
            fullWidth
            label="Value"
            placeholder="Enter a value"
            value={conditionValue as string}
            onChange={handleChangeConditionValue}
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <TextInput
            fullWidth
            label="Value"
            type="number"
            placeholder="Enter a number"
            value={conditionValue as number}
            onChange={handleChangeConditionValue}
          />
        );
      case ApplicationVariableType.BOOLEAN:
        return (
          <SelectInput<boolean>
            label="Value"
            value={conditionValue as string}
            fullWidth
            values={[
              { text: 'TRUE', value: true },
              { text: 'FALSE', value: false },
            ]}
            onSelect={handleChangeConditionValueFromSelect}
          />
        );
    }
  }

  const variableOptions = [
    {
      text: `-- Select a variable --`,
      value: '',
    },
  ];

  variables.forEach(v => {
    variableOptions.push({
      text: `${v.name} (${v.type}/${v.visibility})`,
      value: v.id,
    });
  });

  return (
    <Flex
      className={css.addConditionForm}
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.SM}
    >
      <SelectInput
        fullWidth
        label="Variable"
        value={variable ? variable.id : ''}
        values={variableOptions}
        onSelect={handleSelectVariable}
      />
      <SelectInput
        label="Operator"
        fullWidth
        value={operator}
        values={getOperatorOptions()}
        onSelect={handleSelectOperator}
      />
      {renderConditionValue()}
      <Button
        onClick={handleAdd}
        disabled={variable === null || conditionValue === null}
      >
        Add condition
      </Button>
    </Flex>
  );
});
