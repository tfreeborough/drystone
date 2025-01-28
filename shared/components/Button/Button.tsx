import { PropsWithChildren } from "react";
import css from "./Button.module.scss";

interface ButtonProps {
  className?: string;
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  negative?: boolean;
}

export function Button({
  children,
  className = "",
  onClick,
  disabled = false,
  negative = false,
}: PropsWithChildren<ButtonProps>) {
  function handleClick(evt: React.MouseEvent<HTMLButtonElement>) {
    if (!disabled) {
      onClick(evt);
    }
  }

  return (
    <button
      className={`${css.button} ${className} ${negative ? css.negative : ""} ${disabled ? css.disabled : ""}`}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
    </button>
  );
}
