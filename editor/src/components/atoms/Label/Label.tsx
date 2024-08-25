import {PropsWithChildren} from "react";
import css from './Label.module.scss';

interface LabelProps {
  className?: string;
}

function Label({ children, className = '' }: PropsWithChildren<LabelProps>){
  return (
    <div className={`${css.label} ${className}`}>{ children }</div>
  )
}

export default Label;
