import { Align, Choice, FlexDirection, Gap } from "../../types";
import css from "./ChoicesRender.module.scss";
import { Flex } from "../Flex/Flex";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../player/src/stores/AppContext";
import { isConditionMet } from "../../functions";

interface ChoicesRenderProps {
  choices: Choice[];
  onSelectChoice: (choice: Choice) => void;
}

export const ChoicesRender = observer(
  ({ choices, onSelectChoice }: ChoicesRenderProps) => {
    const { PlayerStore, ApplicationStore } = useContext(AppContext);
    function handleSelectChoice(choice: Choice) {
      onSelectChoice(choice);
    }

    return (
      <Flex
        className={css.choicesRender}
        flexDirection={FlexDirection.COLUMN}
        alignItems={Align.START}
        gap={Gap.XS}
      >
        {choices.map((choice) => {
          const targetScene = ApplicationStore.getScene(choice.target);
          const conditionsMet = choice.conditions
            ? choice.conditions.every((condition) => {
                const variable = PlayerStore.getVariable(condition.variableId);
                if (variable) {
                  return isConditionMet(
                    variable,
                    condition.operator,
                    condition.conditionValue,
                  );
                }
                return false;
              })
            : true;
          const choiceIsValid =
            (conditionsMet && targetScene && targetScene.frames.length > 0) ??
            false;

          const choiceShouldBeHidden =
            !choiceIsValid &&
            (choice.showAsDisabled === undefined ||
              choice.showAsDisabled === false);
          if (choiceShouldBeHidden) {
            return null;
          }
          return (
            <div
              key={choice.id}
              className={`${css.choice} ${choiceIsValid ? "" : css.invalid}`}
              onClick={() => {
                if (choiceIsValid) {
                  handleSelectChoice(choice);
                }
              }}
            >
              {choice.label}
              {!choiceIsValid && <>&nbsp;[{choice.showAsDisabledText}]</>}
            </div>
          );
        })}
      </Flex>
    );
  },
);
