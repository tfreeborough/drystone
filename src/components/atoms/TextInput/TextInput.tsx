import css from './TextInput.module.scss';
import {ReactElement} from "react";

interface TextInputProps{
  className?: string,
  value: string,
  inline?: boolean,
  onChange: (value: string) => void,
}

function TextInput({ inline = false, value, onChange, className = '' }: TextInputProps): ReactElement{

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
    <input className={`${css.textInput} ${className}`} type="text" value={value}
           onChange={handleChange}/>
  )
}

export default TextInput;
