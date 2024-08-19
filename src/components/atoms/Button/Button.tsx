import {PropsWithChildren, ReactElement} from "react";
import css from './Button.module.scss';

interface ButtonProps {
  className?: string,
  onClick: () => void,
  disabled?: boolean,
  fullWidth?: boolean,
}

function Button({ children, onClick, disabled = false, fullWidth = false, className = '' }: PropsWithChildren<ButtonProps>): ReactElement{
  function handleClick(){
    if(!disabled){
      onClick()
    }
  }

  return (
    <button onClick={handleClick} role="button" tabIndex={0} className={`${css.button} ${fullWidth ? css.fullWidth : ''} ${className}`} disabled={disabled}>
      { children }
    </button>
  )
}

export default Button;
