import { FallbackProps } from "react-error-boundary";
import css from "./RenderingErrorBoundary.module.scss";
import { Align, FlexDirection, Gap, Justify } from "../../types";
import { Flex } from "../Flex/Flex";
import { Button } from "../Button/Button";

export function RenderingErrorBoundary({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Flex
      className={css.renderingErrorBoundary}
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      justifyContent={Justify.CENTER}
      gap={Gap.MD}
    >
      <div className={css.header}>
        Looks like we ran into an issue showing that.
      </div>
      <span>
        This is highly likely a bug in the code. If you keep encountering this
        issue. I probably need to know about it as it will affect other users.
        Please get in touch{" "}
        <a href="https://github.com/tfreeborough" target="_blank">
          via github
        </a>
        ,&nbsp;quoting the error below.
      </span>
      <div className={css.error}>
        <span>{error.message}</span>
      </div>
      <Flex gap={Gap.MD}>
        <Button onClick={resetErrorBoundary}>Attempt Reload</Button>
      </Flex>
    </Flex>
  );
}
