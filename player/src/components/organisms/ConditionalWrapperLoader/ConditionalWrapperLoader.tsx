import { observer } from "mobx-react-lite";
import { isConditionMet } from "@shared/functions";
import { Condition, JSONContent } from "@shared/types";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { Tiptap2React } from "@shared/components";

interface ConditionalWrapperLoaderProps {
  content: JSONContent;
  conditions: Condition[];
}

export const ConditionalWrapperLoader = observer(
  ({ conditions, content }: ConditionalWrapperLoaderProps) => {
    const { PlayerStore } = useContext(AppContext);
    const conditionsMet = conditions
      ? conditions.every((condition) => {
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

    if (!conditionsMet) return <></>;
    return (
      <div>
        <Tiptap2React nodes={content} />
      </div>
    );
  },
);
