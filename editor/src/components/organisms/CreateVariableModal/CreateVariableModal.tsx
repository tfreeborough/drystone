import {
  Align,
  ApplicationVariable,
  ApplicationVariableType,
  ApplicationVariableVisibility,
  FlexDirection,
  Gap,
  SelectOption,
} from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import {
  Button,
  Flex,
  ModalContext,
  Notice,
  NoticeType,
} from '@shared/components';
import css from '../CreateVariableModal/CreateVariableModal.module.scss';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import { v4 } from 'uuid';
import { AppContext } from '../../../stores/AppContext.ts';

const variableTypeOptions: SelectOption<ApplicationVariableType>[] = [
  {
    text: ApplicationVariableType.STRING,
    value: ApplicationVariableType.STRING,
  },
  {
    text: ApplicationVariableType.NUMBER,
    value: ApplicationVariableType.NUMBER,
  },
  {
    text: ApplicationVariableType.BOOLEAN,
    value: ApplicationVariableType.BOOLEAN,
  },
];

const variableVisibilityOptions: SelectOption<ApplicationVariableVisibility>[] =
  [
    {
      text: ApplicationVariableVisibility.PUBLIC,
      value: ApplicationVariableVisibility.PUBLIC,
    },
    {
      text: ApplicationVariableVisibility.PRIVATE,
      value: ApplicationVariableVisibility.PRIVATE,
    },
  ];

function CreateVariableModal({
  extra,
}: {
  extra?: {
    visibility: ApplicationVariableVisibility;
    applicationId: string;
  };
}) {
  const { ApplicationStore } = useContext(AppContext);
  const { removeModal } = useContext(ModalContext);

  const [name, setName] = useState('');
  const [type, setType] = useState<ApplicationVariableType>(
    ApplicationVariableType.STRING,
  );
  const [visibility, setVisibility] = useState<ApplicationVariableVisibility>(
    extra?.visibility ?? ApplicationVariableVisibility.PUBLIC,
  );
  const [value, setValue] = useState<string | boolean | number>('');

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

  function handleChangeVariableType(
    option: SelectOption<ApplicationVariableType> | null,
  ) {
    if (option) {
      if (option.value !== type) {
        resetVariableValue(option.value);
      }
      setType(option.value);
    }
  }

  function handleChangeVariableVisibility(
    option: SelectOption<ApplicationVariableVisibility> | null,
  ) {
    if (option) {
      setVisibility(option.value);
    }
  }

  function handleChangeVariableValue(value: string | boolean | number) {
    if (value.toString().length === 0) {
      resetVariableValue(type);
    } else {
      setValue(value);
    }
  }

  function handleCreateVariable() {
    if (extra) {
      const variable: ApplicationVariable = {
        id: v4(),
        name,
        type,
        visibility,
        value,
      };
      console.log(variable);
      ApplicationStore.addVariable(extra.applicationId, variable);
      removeModal('create-variable-modal');
    }
  }

  function renderDefaultValueField() {
    switch (type) {
      case ApplicationVariableType.STRING:
        return (
          <TextInput
            label="Default value on new play through"
            value={value as string}
            onChange={handleChangeVariableValue}
            placeholder="Enter a default value for this variable"
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <Flex flexDirection={FlexDirection.COLUMN} alignItems={Align.STRETCH}>
            <span className={css.label}>Default value on new play through</span>
            <input
              type="number"
              value={value as number}
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

  return (
    <Flex
      className={css.createVariableModal}
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      gap={Gap.SM}
    >
      <Notice type={NoticeType.WARNING}>
        You will not be allowed to edit the variable type and visibility once it
        has been created, as changing these settings can have un-intended
        consequences if modified after being used.
      </Notice>
      <div>
        <TextInput
          fullWidth
          label="Variable Name"
          value={name}
          onChange={handleChangeVariableName}
        />
      </div>
      <div>
        <SelectInput
          label="Variable Type"
          fullWidth
          value={type}
          values={variableTypeOptions}
          onSelect={handleChangeVariableType}
        />
      </div>
      <div>
        <SelectInput
          label="Visibility"
          fullWidth
          value={visibility}
          values={variableVisibilityOptions}
          onSelect={handleChangeVariableVisibility}
        />
      </div>
      {renderDefaultValueField()}
      <Button
        className={css.button}
        onClick={handleCreateVariable}
        disabled={name.length === 0}
      >
        Create Variable
      </Button>
    </Flex>
  );
}

export default observer(CreateVariableModal);
