import { Application, Condition, JSONContent } from "./application.types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    conditionalWrapper: {
      insertConditionalWrapper: (
        content: JSONContent,
        conditions: Condition[],
      ) => ReturnType;
      updateConditionalWrapper: (
        id: string,
        content: JSONContent,
        conditions: Condition[],
      ) => ReturnType;
    };
    dynamicVariable: {
      removeEntireVariable: () => ReturnType;
    };
  }
}
