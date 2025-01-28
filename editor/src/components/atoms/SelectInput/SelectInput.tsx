import { Align, FlexDirection, SelectOption } from '@shared/types';
import Label from '../Label/Label.tsx';
import css from './SelectInput.module.scss';
import { Flex } from '@shared/components';

interface SelectInputProps<T = string> {
  value: string;
  values: SelectOption<T>[];
  onSelect: (option: SelectOption<T> | null) => void;
  label?: string;
  fullWidth?: boolean;
}

function SelectInput<T>({
  value,
  values,
  onSelect,
  label,
  fullWidth,
}: SelectInputProps<T>) {
  function handleSelect(event: any) {
    const option = values.find(v => {
      if (typeof v.value === 'boolean') {
        return v.value.toString() === event.target.value;
      }
      return v.value === event.target.value;
    });
    if (option) {
      onSelect(option);
    } else {
      onSelect(null);
    }
  }

  return (
    <Flex
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      className={`${fullWidth ? css.fullWidth : ''}`}
    >
      {label && <Label>{label}</Label>}
      <select
        onChange={handleSelect}
        defaultValue={value}
        className={`${css.selectInput}`}
      >
        {values.map((option, i) => {
          return (
            <option key={i} value={option.value as string}>
              {option.text}
            </option>
          );
        })}
      </select>
    </Flex>
  );
}

export default SelectInput;
