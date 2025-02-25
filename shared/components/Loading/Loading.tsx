import { PropsWithChildren } from "react";
import Spinner from "./loader.svg?react";
import { Flex } from "../Flex/Flex";
import { Align, FlexDirection, Gap } from "../../types";
import css from "./Loading.module.scss";

export const Loading = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.MD}
      alignItems={Align.CENTER}
    >
      <Spinner /> <span className={css.loading}>{children}</span>
    </Flex>
  );
};
