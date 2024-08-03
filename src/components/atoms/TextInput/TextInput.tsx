import css from './TextInput.module.scss';
import {ReactElement} from "react";
import Muted from "../Muted/Muted.tsx";
import Label from "../Label/Label.tsx";

interface TextInputProps{
  className?: string,
  value: string,
  inline?: boolean,
  onChange: (value: string) => void,
  label?: string,
  fullWidth?: boolean,
}

function TextInput({ inline = false, value, onChange, className = '', label, fullWidth = false }: TextInputProps): ReactElement{

  function handleChange(e){
    onChange(e.target.value);
  }
  function handleBlur(e) {
    onChange(e.target.innerText);
  }

  function handleInput(e) {
    onChange(e.target.innerText);
  }

  if(inline) {
    return (
      <span
        className={`${css.textInput} ${css.inline}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={handleInput}
      >

      </span>
    )
  }
  return (
    <>
      { label && (
        <Label>{ label }</Label>
      )}
      <input className={`${css.textInput} ${fullWidth ? css.fullWidth : ''} ${className}`} type="text" value={value}
             onChange={handleChange}/>
    </>
  )
}

export default TextInput;
