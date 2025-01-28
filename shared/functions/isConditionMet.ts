import {
  ApplicationVariable,
  ApplicationVariableType,
  ConditionOperator,
} from "../types";

function compareStrings(
  value: string,
  operator: ConditionOperator,
  comparison: string,
) {
  switch (operator) {
    case "==":
      return value == comparison;
    case "!=":
      return value != comparison;
  }
}

function compareNumbers(
  value: number,
  operator: ConditionOperator,
  comparison: number,
) {
  switch (operator) {
    case "==":
      return value == comparison;
    case "!=":
      return value != comparison;
    case "<":
      return value < comparison;
    case "<=":
      return value <= comparison;
    case ">":
      return value > comparison;
    case ">=":
      return value >= comparison;
  }
}

function compareBooleans(
  value: boolean,
  operator: ConditionOperator,
  comparison: boolean,
) {
  switch (operator) {
    case "==":
      return value == comparison;
    case "!=":
      return value != comparison;
  }
}

export function isConditionMet(
  variable: ApplicationVariable,
  condition: ConditionOperator,
  conditionValue: string | number | boolean,
) {
  switch (variable.type) {
    case ApplicationVariableType.STRING:
      return compareStrings(
        variable.value as string,
        condition,
        conditionValue as string,
      );
    case ApplicationVariableType.NUMBER:
      return compareNumbers(
        variable.value as number,
        condition,
        conditionValue as number,
      );
    case ApplicationVariableType.BOOLEAN:
      return compareBooleans(
        variable.value as boolean,
        condition,
        conditionValue as boolean,
      );
  }
}
