import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "./DeleteIcon.module.scss";

interface DeleteIconProps {
  onClick: (evt: React.MouseEvent) => void;
  className?: string;
}

export const DeleteIcon = ({ onClick, className = "" }: DeleteIconProps) => {
  return (
    <FontAwesomeIcon
      onClick={onClick}
      className={`${css.deleteIcon} ${className}`}
      icon={["fas", "times"]}
    />
  );
};
