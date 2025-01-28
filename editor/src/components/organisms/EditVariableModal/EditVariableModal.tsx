import css from './EditVariableModal.module.scss';
import { observer } from 'mobx-react-lite';
import {
  Align,
  ApplicationVariable,
  ApplicationVariableType,
  FlexDirection,
  Gap,
  Justify,
} from '@shared/types';
import {
  Button,
  Flex,
  ModalContext,
  Notice,
  NoticeType,
} from '@shared/components';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { useContext, useState } from 'react';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import { AppContext } from '../../../stores/AppContext.ts';

function EditVariableModal({
  extra,
}: {
  extra?: { variable: ApplicationVariable; applicationId: string };
}) {
  const { removeModal } = useContext(ModalContext);
  const { ApplicationStore } = useContext(AppContext);
  const [name, setName] = useState(extra?.variable.name || '');
  const [value, setValue] = useState<string | boolean | number>(
    extra?.variable.value ?? '',
  );

  function handleChangeVariableName(value: string) {
    setName(value);
  }

  function resetVariableValue(type: ApplicationVariableType) {
    switch (type) {
      case ApplicationVariableType.STRING:
        setValue('');
        break;
      case ApplicationVariableType.NUMBER:
        setValue(0);
        break;
      case ApplicationVariableType.BOOLEAN:
        setValue(false);
        break;
    }
  }

  function handleChangeVariableValue(value: string | boolean | number) {
    if (value.toString().length === 0 && extra?.variable.type) {
      resetVariableValue(extra.variable.type);
    } else {
      setValue(value);
    }
  }

  function handleUpdateVariable() {
    if (extra) {
      const editedVariable = {
        ...extra.variable,
        name,
        value,
      };
      ApplicationStore.editVariable(extra.applicationId, editedVariable);
      removeModal('edit-variable-modal');
    }
  }

  function handleDeleteVariable() {
    if (extra) {
      ApplicationStore.deleteVariable(extra.applicationId, extra.variable.id);
      removeModal('edit-variable-modal');
    }
  }

  function renderDefaultValueField() {
    switch (extra?.variable.type) {
      case ApplicationVariableType.STRING:
        return (
          <TextInput
            label="Default value on new play through"
            value={value ? (value as string) : ''}
            onChange={handleChangeVariableValue}
            placeholder="Enter a default value for this variable"
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <Flex flexDirection={FlexDirection.COLUMN} alignItems={Align.STRETCH}>
            <label className={css.label}>
              Default value on new play through
            </label>
            <input
              type="number"
              value={value ? (value as number) : 0}
              onChange={e => handleChangeVariableValue(e.target.value)}
            />
          </Flex>
        );
      case ApplicationVariableType.BOOLEAN:
        return (
          <SelectInput
            label="Default value on new play through"
            value={value ? value.toString() : 'false'}
            values={[
              { text: 'TRUE', value: 'true' },
              { text: 'FALSE', value: 'false' },
            ]}
            onSelect={o => {
              if (o) {
                handleChangeVariableValue(o?.value);
              }
            }}
          />
        );
    }
  }

  if (!extra) {
    return <span>ERROR: No variable data found</span>;
  }

  return (
    <Flex
      className={css.editVariableModal}
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      gap={Gap.SM}
    >
      <Notice type={NoticeType.WARNING}>
        Changing the type & visibility of your variable is prohibited as it may
        have un-intended consequences for your applications logic.
      </Notice>
      <div>
        <TextInput
          fullWidth
          label="Variable Name"
          value={name}
          onChange={handleChangeVariableName}
        />
      </div>
      {renderDefaultValueField()}
      <Flex className={css.buttons} justifyContent={Justify.SPACE_BETWEEN}>
        <Button onClick={handleUpdateVariable}>Update & Close</Button>
        <Button className={css.delete} onClick={handleDeleteVariable}>
          Delete
        </Button>
      </Flex>
    </Flex>
  );
}

export default observer(EditVariableModal);
