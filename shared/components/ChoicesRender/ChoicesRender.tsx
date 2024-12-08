import { Align, Choice, FlexDirection, Gap } from "../../types";
import css from "./ChoicesRender.module.scss";
import { Flex } from "../Flex/Flex";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../player/src/stores/AppContext";

interface ChoicesRenderProps {
  choices: Choice[];
  onSelectChoice: (choice: Choice) => void;
}

export const ChoicesRender = observer(
  ({ choices, onSelectChoice }: ChoicesRenderProps) => {
    const { ApplicationStore } = useContext(AppContext);
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
