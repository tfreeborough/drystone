import { useContext } from "react";
import { AppContext } from "../../../player/src/stores/AppContext";
import css from "./DynamicVariable.module.scss";
import { observer } from "mobx-react-lite";

interface DynamicVariableProps {
  name: string;
  id: string;
  inEditor?: boolean;
}

export const DynamicVariable = observer(
  ({ name, id, inEditor = false }: DynamicVariableProps) => {
    const { PlayerStore } = useContext(AppContext);
    const variable = PlayerStore.getVariable(id);

    function renderVariable(value: string | number | boolean) {
      switch (typeof value) {
        case "number":
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(value);
        case "string":
          return value;
        case "boolean":
          if (value === true) {
            return "Yes";
          }
          if (value === false) {
            return "No";
          }
          break;
        default:
          return value;
      }
    }

    if (!variable) {
      if (inEditor) {
        return (
          <span className={`${css.dynamicVariable} ${css.inEditor}`}>
            {name}
          </span>
        );
      }
      return <span className={css.error}>MISSING VAR: {name}</span>;
    }
    return (
      <span className={css.dynamicVariable}>
        {renderVariable(variable.value)}
      </span>
    );
  },
);
