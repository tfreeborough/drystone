import css from './TextInput.module.scss';
import { ReactElement } from 'react';
import Label from '../Label/Label.tsx';
import { Flex } from '@shared/components';
import { Align, FlexDirection } from '@shared/types';

interface TextInputProps {
  className?: string;
  value: string | number;
  inline?: boolean;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
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
  type = 'text',
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
    <Flex
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      className={`${fullWidth ? css.fullWidth : ''}`}
    >
      {label && <Label>{label}</Label>}
      <input
        autoFocus={autoFocus}
        className={`${css.textInput} ${css.block} ${className}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </Flex>
  );
}

export default TextInput;
