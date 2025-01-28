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

    let filteredChoices: Choice[] = [...choices].filter((choice: Choice) => {
      if (!choice.conditions) {
        return true;
      }
      return choice.conditions.every((condition) => {
        const variable = PlayerStore.getVariable(condition.variableId);
        if (variable) {
          return isConditionMet(
            variable,
            condition.operator,
            condition.conditionValue,
          );
        }
        return false;
      });
    });

    return (
      <Flex
        className={css.choicesRender}
        flexDirection={FlexDirection.COLUMN}
        alignItems={Align.START}
        gap={Gap.XS}
      >
        {filteredChoices.map((choice) => {
          const targetScene = ApplicationStore.getScene(choice.target);
          let choiceIsValid = false;
          if (targetScene) {
            choiceIsValid = targetScene.frames.length > 0;
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
              {choice.label}&nbsp;
              {!choiceIsValid && <>[You can't choose this option]</>}
            </div>
          );
        })}
      </Flex>
    );
  },
);
