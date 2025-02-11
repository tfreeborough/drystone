import css from "./CheckboxInput.module.scss";
import { Flex } from "../Flex/Flex";
import { Align, Gap } from "../../types";

interface CheckboxInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export const CheckboxInput = ({
  value,
  onChange,
  label,
}: CheckboxInputProps) => {
  function handleChange() {
    onChange(!value);
  }

  return (
    <Flex className={css.checkboxInput} gap={Gap.XS} alignItems={Align.CENTER}>
      <input
        className={css.input}
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
      <span>{label}</span>
    </Flex>
  );
};
