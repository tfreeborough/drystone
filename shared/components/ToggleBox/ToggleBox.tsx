import { PropsWithChildren, useEffect, useState } from "react";
import css from "./ToggleBox.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ToggleBoxProps {
  initial?: boolean;
  title: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
}

export const ToggleBox = ({
  initial = false,
  children,
  title,
  value,
  onToggle,
}: PropsWithChildren<ToggleBoxProps>) => {
  const [open, setOpen] = useState(initial);

  function handleToggle() {
    setOpen(!open);
    if (onToggle) {
      onToggle(!open);
    }
  }

  useEffect(() => {
    if (value !== undefined) {
      setOpen(value);
    }
  }, [value]);

  return (
    <div className={`${css.toggleBox} ${open ? css.open : ""}`}>
      <div className={css.topper} onClick={handleToggle}>
        <span>{title}</span>
        {open ? (
          <FontAwesomeIcon icon={["fas", "chevron-up"]} />
        ) : (
          <FontAwesomeIcon icon={["fas", "chevron-down"]} />
        )}
      </div>
      {open && <div className={css.content}>{children}</div>}
    </div>
  );
};
