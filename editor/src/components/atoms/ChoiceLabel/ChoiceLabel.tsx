import css from './ChoiceLabel.module.scss';

interface ChoiceLabelProps {
  label: string;
}

export const ChoiceLabel = ({ label }: ChoiceLabelProps) => {
  console.log(label);
  return <div className={css.choiceLabel}>{label}</div>;
};
