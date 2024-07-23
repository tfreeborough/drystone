import {PropsWithChildren, ReactElement} from "react";
import css from './Card.module.scss';
interface CardProps {
  className?: string;
}

function Card({ children, className = '' }: PropsWithChildren<CardProps>): ReactElement{
  return (
    <div className={`${css.card} ${className}`}>
      { children }
    </div>
  );
}

export default Card;
