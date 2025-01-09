import { PropsWithChildren } from "react";
import css from "./Notice.module.scss";
import { FadeIn } from "../../animations";

export enum NoticeType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFORMATION = "information",
}

interface NoticeProps {
  type: NoticeType;
  onClose?: () => void;
}

export function Notice({
  type,
  children,
  onClose,
}: PropsWithChildren<NoticeProps>) {
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <FadeIn>
      <div className={`${css.notice} ${css[type]}`}>
        {onClose && (
          <div className={css.close} onClick={handleClose} tabIndex={0}>
            X
          </div>
        )}
        {children}
      </div>
    </FadeIn>
  );
}
