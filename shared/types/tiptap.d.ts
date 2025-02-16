import { Application, Condition, JSONContent } from "./application.types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    conditionalWrapper: {
      insertConditionalWrapper: (
        content: JSONContent,
        conditions: Condition[],
        application: Application,
      ) => ReturnType;
      updateConditionalWrapper: (
        id: string,
        content: JSONContent,
        conditions: Condition[],
        application: Application,
      ) => ReturnType;
    };
  }
}
