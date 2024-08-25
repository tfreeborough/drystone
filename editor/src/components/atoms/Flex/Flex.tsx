import {PropsWithChildren, ReactElement} from "react";
import css from './Flex.module.scss';
import {FlexAlign, FlexDirection, FlexGap, FlexJustify} from "./Flex.types.ts";
interface FlexProps {
  className?: string,
  flexDirection?: FlexDirection,
  alignItems?: FlexAlign,
  justifyContent?: FlexJustify,
  gap?: FlexGap,
}

function Flex({ children, className, flexDirection = FlexDirection.ROW, alignItems = FlexAlign.START, justifyContent = FlexJustify.START, gap = FlexGap.NONE }: PropsWithChildren<FlexProps>): ReactElement {
  return (
    <div className={`${css.flex} ${css[`FLEX_DIRECTION_${flexDirection}`]} ${css[`ALIGN_ITEMS_${alignItems}`]} ${css[`JUSTIFY_CONTENT_${justifyContent}`]} ${css[`GAP_${gap}`]} ${className}`}>
      { children }
    </div>
  )
}

export default Flex;
