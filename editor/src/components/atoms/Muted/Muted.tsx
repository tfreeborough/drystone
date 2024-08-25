import {PropsWithChildren, ReactElement} from "react";
import css from './Muted.module.scss';


function Muted({ children }: PropsWithChildren): ReactElement {
  return (
    <span className={css.muted}>
      { children }
    </span>
  )
}

export default Muted;
