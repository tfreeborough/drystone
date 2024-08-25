import {PropsWithChildren, ReactElement} from "react";
import css from './Topper.module.scss';

interface TopperProps {
  noNegativeMargin?: boolean
}

function Topper({ children, noNegativeMargin }: PropsWithChildren<TopperProps>): ReactElement{
  return (
    <div className={`${css.topper} ${noNegativeMargin ? css.noNegativeMargin : ''}`}>
      { children }
    </div>
  )
}

export default Topper;
