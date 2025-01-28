import {
  ApplicationVariable,
  ApplicationVariableType,
  Trigger,
  TriggerOperator,
  FlexDirection,
  Gap,
  SelectOption,
} from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';

import css from './AddTriggerForm.module.scss';
import { Button, Flex } from '@shared/components';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { v4 } from 'uuid';

interface AddTriggerFormProps {
  onAdd: (trigger: Trigger) => void;
}

export const AddTriggerForm = observer(({ onAdd }: AddTriggerFormProps) => {
  const [variable, setVariable] = useState<ApplicationVariable | null>(null);
  const [operator, setOperator] = useState<TriggerOperator>('=');
  const [triggerValue, setTriggerValue] = useState<
    string | number | boolean | null
  >(null);
  const { ApplicationStore } = useContext(AppContext);

  const current = ApplicationStore.current;
  if (!current) {
    return null;
  }

  const variables = current.variables;

  function handleAdd() {
    if (variable && triggerValue !== null) {
      const newTrigger: Trigger = {
        id: v4(),
        variableId: variable?.id,
        operator,
        triggerValue,
      };
      onAdd(newTrigger);
    }
  }

  function handleSelectVariable(option: SelectOption | null) {
    if (option && option.value.length > 0 && current) {
      const foundVariable = current.variables.find(
        variable => variable.id === option.value,
      );
      if (foundVariable) {
        if (foundVariable.type !== variable?.type) {
          setOperator('=');
          switch (foundVariable.type) {
            case ApplicationVariableType.STRING:
              setTriggerValue('');
              break;
            case ApplicationVariableType.NUMBER:
              setTriggerValue(0);
              break;
            case ApplicationVariableType.BOOLEAN:
              setTriggerValue(true);
              break;
          }
        }
        setVariable(foundVariable);
      }
    } else {
      setVariable(null);
      setTriggerValue(null);
    }
  }

  function handleSelectOperator(option: SelectOption | null) {
    if (option) {
      setOperator(option.value as TriggerOperator);
    }
  }

  function getOperatorOptions() {
    if (variable) {
      switch (variable.type) {
        case ApplicationVariableType.STRING:
          return [{ text: '= (set value)', value: '=' }];
        case ApplicationVariableType.BOOLEAN:
          return [{ text: '= (set value)', value: '=' }];
        case ApplicationVariableType.NUMBER:
          return [
            { text: '= (set value)', value: '=' },
            { text: '+ (add value to variable)', value: '+' },
            { text: '- (subtract value from variable)', value: '-' },
            { text: '* (multiply variable by value)', value: '*' },
            { text: '/ (divide variable by value)', value: '/' },
          ];
      }
    }
    return [];
  }

  function handleChangeTriggerValue(value: string) {
    console.log(value);
    if (variable?.type === ApplicationVariableType.NUMBER) {
      setTriggerValue(value.length > 0 ? parseFloat(value) : null);
      return;
    }
    if (variable?.type === ApplicationVariableType.BOOLEAN) {
      setTriggerValue(value.toLowerCase() === 'true');
      return;
    }
    setTriggerValue(value);
  }

  function handleChangeTriggerValueFromSelect(
    option: SelectOption<boolean> | null,
  ) {
    if (option) {
      setTriggerValue(option.value);
    }
  }

  function renderTriggerValue() {
    switch (variable?.type) {
      case ApplicationVariableType.STRING:
        return (
          <TextInput
            fullWidth
            label="Value"
            placeholder="Enter a value"
            value={triggerValue as string}
            onChange={handleChangeTriggerValue}
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <TextInput
            fullWidth
            label="Value"
            type="number"
            placeholder="Enter a number"
            value={triggerValue as number}
            onChange={handleChangeTriggerValue}
          />
        );
      case ApplicationVariableType.BOOLEAN:
        return (
          <SelectInput<boolean>
            label="Value"
            value={triggerValue as string}
            fullWidth
            values={[
              { text: 'TRUE', value: true },
              { text: 'FALSE', value: false },
            ]}
            onSelect={handleChangeTriggerValueFromSelect}
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
      className={css.addTriggerForm}
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
        label="Operation"
        fullWidth
        value={operator}
        values={getOperatorOptions()}
        onSelect={handleSelectOperator}
      />
      {renderTriggerValue()}
      <Button
        onClick={handleAdd}
        disabled={variable === null || triggerValue === null}
      >
        Add trigger
      </Button>
    </Flex>
  );
});
