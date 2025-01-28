import {
  ApplicationVariable,
  ApplicationVariableType,
  Trigger,
  TriggerOperator,
} from "../types";

function modifyString(
  value: string,
  operator: TriggerOperator,
  modifier: string,
) {
  switch (operator) {
    case "=":
      return modifier;
  }
  return value;
}

function modifyBoolean(
  value: boolean,
  operator: TriggerOperator,
  modifier: boolean,
) {
  switch (operator) {
    case "=":
      return modifier;
  }
  return value;
}

function modifyNumber(
  value: number,
  operator: TriggerOperator,
  modifier: number,
) {
  switch (operator) {
    case "=":
      return modifier;
    case "+":
      return value + modifier;
    case "-":
      return value - modifier;
    case "*":
      return value * modifier;
    case "/":
      return value / modifier;
  }
}

export function modifyVariableWithTrigger(
  variable: ApplicationVariable,
  trigger: Trigger,
): ApplicationVariable {
  let value = variable.value;
  switch (variable.type) {
    case ApplicationVariableType.STRING:
      value = modifyString(
        value as string,
        trigger.operator,
        trigger.triggerValue as string,
      );
      break;
    case ApplicationVariableType.BOOLEAN:
      value = modifyBoolean(
        value as boolean,
        trigger.operator,
        trigger.triggerValue as boolean,
      );
      break;
    case ApplicationVariableType.NUMBER:
      value = modifyNumber(
        value as number,
        trigger.operator,
        trigger.triggerValue as number,
      );
      break;
  }
  return {
    ...variable,
    value,
  };
}
