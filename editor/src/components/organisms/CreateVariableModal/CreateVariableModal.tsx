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
import css from '../EditVariableModal/EditVariableModal.module.scss';
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
  const [showDefaultValue, setShowDefaultValue] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<
    string | boolean | number | null
  >(null);

  function handleChangeVariableName(value: string) {
    setName(value);
  }

  function handleChangeVariableType(
    option: SelectOption<ApplicationVariableType> | null,
  ) {
    if (option) {
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

  function handleChangeVariableDefaultValue(
    value: string | boolean | number | null,
  ) {
    setDefaultValue(value);
    if (
      type === ApplicationVariableType.STRING &&
      typeof value === 'string' &&
      value.length === 0
    ) {
      setDefaultValue(null);
    }
  }

  function handleChangeShowDefaultValue(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    setShowDefaultValue(e.target.checked);
    if (e.target.checked) {
      if (type === ApplicationVariableType.BOOLEAN && defaultValue === null) {
        setDefaultValue(false);
      }
    } else {
      setDefaultValue(null);
    }
  }

  function handleCreateVariable() {
    if (extra) {
      const variable: ApplicationVariable = {
        id: v4(),
        name,
        type,
        visibility,
        defaultValue: showDefaultValue ? defaultValue : null,
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
            value={defaultValue ? (defaultValue as string) : ''}
            onChange={handleChangeVariableDefaultValue}
            placeholder="Enter a default value for this variable"
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <input
            type="number"
            value={defaultValue ? (defaultValue as number) : ''}
            onChange={e => handleChangeVariableDefaultValue(e.target.value)}
          />
        );
      case ApplicationVariableType.BOOLEAN:
        return (
          <SelectInput
            value={defaultValue ? defaultValue.toString() : 'false'}
            values={[
              { text: 'TRUE', value: 'true' },
              { text: 'FALSE', value: 'false' },
            ]}
            onSelect={o => {
              if (o) {
                handleChangeVariableDefaultValue(o?.value);
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
      <Flex gap={Gap.XS}>
        <input
          type="checkbox"
          checked={showDefaultValue}
          onChange={handleChangeShowDefaultValue}
        />{' '}
        <span>should this variable have a default value?</span>
      </Flex>
      {showDefaultValue && <>{renderDefaultValueField()}</>}
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
