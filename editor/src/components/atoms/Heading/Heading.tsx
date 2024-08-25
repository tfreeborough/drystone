import {PropsWithChildren, ReactElement} from "react";
import css from './Heading.module.scss';


function Heading({ children }: PropsWithChildren): ReactElement{
  return (
    <h2 className={css.heading}>{ children }</h2>
  )
}

export default Heading;
