import { SelectOption } from 'drystone';
import Label from '../Label/Label.tsx';
import css from './SelectInput.module.scss';

interface SelectInputProps {
  value: string;
  values: SelectOption[];
  onSelect: (option: SelectOption | null) => void;
  label?: string;
  fullWidth?: boolean;
}

function SelectInput({
  value,
  values,
  onSelect,
  label,
  fullWidth,
}: SelectInputProps) {
  function handleSelect(event) {
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
            <option key={i} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
    </>
  );
}

export default SelectInput;
