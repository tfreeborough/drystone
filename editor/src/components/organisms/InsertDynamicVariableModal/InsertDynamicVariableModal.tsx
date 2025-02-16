import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import {
  Align,
  ApplicationVariableVisibility,
  EditorEvents,
  FlexDirection,
  Gap,
  SelectOption,
} from '@shared/types';
import { useContext, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { observer } from 'mobx-react-lite';
import Heading from '../../atoms/Heading/Heading.tsx';
import { Button, Flex } from '@shared/components';
import venti from 'venti-js';

export const InsertDynamicVariableModal = observer(() => {
  const { ApplicationStore } = useContext(AppContext);

  const [variable, setVariable] = useState<SelectOption<string> | null>(null);

  const current = ApplicationStore.current;
  if (!current) {
    return null;
  }

  const publicVariables = current.variables.filter(
    v => v.visibility === ApplicationVariableVisibility.PUBLIC,
  );

  function handleSelectVariable(value: SelectOption | null) {
    setVariable(value);
  }

  function handleInsertVariable() {
    if (variable) {
      const found = publicVariables.find(pv => pv.id === variable.value);
      if (found) {
        venti.trigger(EditorEvents.INSERT_DYNAMIC_VARIABLE, {
          variable: found,
        });
      }
    }
  }

  const variableOptions = [
    {
      text: `-- Select a variable --`,
      value: '',
    },
  ];

  publicVariables.forEach(v => {
    variableOptions.push({
      text: `${v.name} (${v.type}/${v.visibility})`,
      value: v.id,
    });
  });

  return (
    <Flex
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.SM}
      alignItems={Align.STRETCH}
    >
      <Heading>Insert a dynamic variable</Heading>
      <SelectInput
        fullWidth
        label="Public Variables"
        value={variable ? variable.value : ''}
        values={variableOptions}
        onSelect={handleSelectVariable}
      />
      <Button
        disabled={variable === null || variable.value.length === 0}
        onClick={handleInsertVariable}
      >
        Insert{' '}
        {variable && variable.value.length > 0 ? variable?.text : 'variable'}
      </Button>
    </Flex>
  );
});
