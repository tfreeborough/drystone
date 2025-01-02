import { PropsWithChildren } from "react";
import css from "./Button.module.scss";

interface ButtonProps {
  className?: string;
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function Button({
  children,
  className = "",
  onClick,
  disabled = false,
}: PropsWithChildren<ButtonProps>) {
  function handleClick(evt: React.MouseEvent<HTMLButtonElement>) {
    if (!disabled) {
      onClick(evt);
    }
  }

  return (
    <button
      className={`${css.button} ${className} ${disabled ? css.disabled : ""}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
