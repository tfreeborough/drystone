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
  const [showDefaultValue, setShowDefaultValue] = useState<boolean>(
    !!extra?.variable.defaultValue,
  );
  const [defaultValue, setDefaultValue] = useState<
    string | boolean | number | null
  >(extra?.variable.defaultValue ?? null);

  function handleChangeVariableName(value: string) {
    setName(value);
  }

  function handleChangeVariableDefaultValue(
    value: string | boolean | number | null,
  ) {
    setDefaultValue(value);
    if (
      extra?.variable.type === ApplicationVariableType.STRING &&
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
      if (
        extra?.variable.type === ApplicationVariableType.BOOLEAN &&
        defaultValue === null
      ) {
        setDefaultValue(false);
      }
    } else {
      setDefaultValue(null);
    }
  }

  function handleUpdateVariable() {
    if (extra) {
      const editedVariable = {
        ...extra.variable,
        name,
        defaultValue: showDefaultValue ? defaultValue : null,
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
            value={defaultValue ? (defaultValue as string) : ''}
            onChange={handleChangeVariableDefaultValue}
            placeholder="Enter a default value for this variable"
          />
        );
      case ApplicationVariableType.NUMBER:
        return (
          <input
            type="number"
            value={defaultValue ? (defaultValue as number) : 0}
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
      <Flex gap={Gap.XS}>
        <input
          type="checkbox"
          checked={showDefaultValue}
          onChange={handleChangeShowDefaultValue}
        />{' '}
        <span>should this variable have a default value?</span>
      </Flex>
      {showDefaultValue && <>{renderDefaultValueField()}</>}
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
