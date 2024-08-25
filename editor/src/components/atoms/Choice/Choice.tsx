import {Choice as ChoiceType} from "../../../types/application.types.ts";
import css from './Choice.module.scss';

interface ChoiceProps {
  onSelect: (choice: ChoiceType) => void,
  choice: ChoiceType,
}

function Choice({ onSelect, choice }: ChoiceProps) {

  function handleClick(){
    onSelect(choice);
  }

  return (
    <div className={css.choice} onClick={handleClick}>
      { choice.label }
    </div>
  )
}

export default Choice;
