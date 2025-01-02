import { PropsWithChildren } from "react";
import css from "./IconButton.module.scss";

interface IconButtonProps {
  className?: string;
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isActive?: boolean;
}

export const IconButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
  isActive = false,
}: PropsWithChildren<IconButtonProps>) => {
  function handleClick(evt: React.MouseEvent<HTMLButtonElement>) {
    if (!disabled) {
      onClick(evt);
    }
  }
  return (
    <button
      className={`${css.iconButton} ${isActive ? css.isActive : ""} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
