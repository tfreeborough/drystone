import {PropsWithChildren, ReactElement} from "react";
import css from './Button.module.scss';

interface ButtonProps {
  onClick: () => void,
  disabled?: boolean,
  fullWidth?: boolean,
}

function Button({ children, onClick, disabled = false, fullWidth = false }: PropsWithChildren<ButtonProps>): ReactElement{
  function handleClick(){
    if(!disabled){
      onClick()
    }
  }

  return (
    <button onClick={handleClick} role="button" tabIndex={0} className={`${css.button} ${fullWidth ? css.fullWidth : ''}`} disabled={disabled}>
      { children }
    </button>
  )
}

export default Button;
