import css from './TextInput.module.scss';
import { ReactElement } from 'react';
import Label from '../Label/Label.tsx';

interface TextInputProps {
  className?: string;
  value: string;
  inline?: boolean;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

function TextInput({
  inline = false,
  value,
  onChange,
  className = '',
  label,
  fullWidth = false,
  autoFocus = false,
  placeholder,
}: TextInputProps): ReactElement {
  function handleChange(e: any) {
    onChange(e.target.value);
  }
  function handleBlur(e: any) {
    onChange(e.target.innerText);
  }

  function handleInput(e: any) {
    onChange(e.target.innerText);
  }

  if (inline) {
    return (
      <span
        className={`${css.textInput} ${css.inline}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={handleInput}
      ></span>
    );
  }
  return (
    <>
      {label && <Label>{label}</Label>}
      <input
        autoFocus={autoFocus}
        className={`${css.textInput} ${fullWidth ? css.fullWidth : ''} ${css.block} ${className}`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </>
  );
}

export default TextInput;
