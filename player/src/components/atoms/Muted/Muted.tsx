import { PropsWithChildren } from "react";
import css from "./Muted.module.scss";

export function Muted({ children }: PropsWithChildren) {
  return <span className={css.muted}>{children}</span>;
}
