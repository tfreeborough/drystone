import { SelectOption } from '@shared/types';
import Label from '../Label/Label.tsx';
import css from './SelectInput.module.scss';

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
    const option = values.find(v => v.value === event.target.value);
    if (option) {
      onSelect(option);
    } else {
      onSelect(null);
    }
  }

  return (
    <>
      {label && <Label>{label}</Label>}
      <select
        onChange={handleSelect}
        defaultValue={value}
        className={`${css.selectInput} ${fullWidth ? css.fullWidth : ''}`}
      >
        {values.map((option, i) => {
          return (
            <option key={i} value={option.value as string}>
              {option.text}
            </option>
          );
        })}
      </select>
    </>
  );
}

export default SelectInput;
