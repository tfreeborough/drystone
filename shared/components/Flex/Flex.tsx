import { PropsWithChildren, ReactElement } from "react";
import css from "./Flex.module.scss";
import { Align, FlexDirection, Gap, Justify } from "@shared/types";
interface FlexProps {
  className?: string;
  flexDirection?: FlexDirection;
  alignItems?: Align;
  justifyContent?: Justify;
  gap?: Gap;
}

export function Flex({
  children,
  className,
  flexDirection = FlexDirection.ROW,
  alignItems = Align.START,
  justifyContent = Justify.START,
  gap = Gap.NONE,
}: PropsWithChildren<FlexProps>): ReactElement {
  return (
    <div
      className={`${css.flex} ${css[`FLEX_DIRECTION_${flexDirection}`]} ${css[`ALIGN_ITEMS_${alignItems}`]} ${css[`JUSTIFY_CONTENT_${justifyContent}`]} ${css[`GAP_${gap}`]} ${className}`}
    >
      {children}
    </div>
  );
}
