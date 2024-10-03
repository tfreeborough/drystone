import {PropsWithChildren} from "react";
import css from './Button.module.scss';

interface ButtonProps {
  className?: string,
  onClick: () => void,
  disabled?: boolean,
}

function Button({ children, className = '', onClick, disabled = false }: PropsWithChildren<ButtonProps>){

  function handleClick(){
    if(!disabled){
      onClick();
    }
  }

  return (
    <button className={`${css.button} ${className} ${disabled ? css.disabled : ''}`} onClick={handleClick}>
      { children }
    </button>
  )
}

export default Button;
