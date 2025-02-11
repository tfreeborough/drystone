import { SelectOption } from "./form.types";

export type JSONContent = {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};

export interface ApplicationAuthor {
  name: string;
  link: string;
}

export enum FontStyles {
  SERIF = "serif",
  SANS_SERIF = "sans-serif",
  CURSIVE = "cursive",
  FANTASY = "fantasy",
  MONOSPACE = "monospace",
}

export interface ApplicationTheming {
  fontStyle?: FontStyles;
  elementsColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export enum ApplicationVariableVisibility {
  PRIVATE = "private",
  PUBLIC = "public",
}

export enum ApplicationVariableType {
  STRING = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export interface ApplicationVariable {
  id: string;
  name: string;
  type: ApplicationVariableType;
  visibility: ApplicationVariableVisibility;
  value: string | number | boolean;
}

export interface Application {
  id: string;
  type: "application";
  author: ApplicationAuthor;
  name: string;
  description: string;
  scenes: Scene[];
  stagePosition?: { x: number; y: number };
  stageScale?: number;
  entrypoint: string;
  theming?: ApplicationTheming;
  variables: ApplicationVariable[];
}

export interface SceneMetadata {
  note?: string;
}

export interface Scene {
  id: string;
  type: "scene";
  metadata: SceneMetadata;
  frames: Frame[];
  position: { x: number; y: number };
  choices: Choice[];
}

export interface Frame {
  id: string;
  type: "frame";
  nodes: JSONContent;
}

export interface Choice {
  id: string;
  type: "choice";
  label: string;
  target: string;
  conditions?: Condition[];
  triggers?: Trigger[];
  showAsDisabled?: boolean;
  showAsDisabledText?: string;
}

export interface Node {
  id: string;
  content: never;
}

export interface Asset {
  id: string;
  type: string;
  data: Blob;
  name: string;
  applicationId: string;
}

export interface Condition {
  id: string;
  variableId: string;
  operator: ConditionOperator;
  conditionValue: string | number | boolean;
}

export interface Trigger {
  id: string;
  variableId: string;
  operator: TriggerOperator;
  triggerValue: string | number | boolean;
}

export type ConditionOperator = "==" | "<" | ">" | "<=" | ">=" | "!=";
export type TriggerOperator = "=" | "+" | "-" | "/" | "*";

export const ConditionOperatorOptions: SelectOption[] = [
  { text: "== (is equal to)", value: "==" },
  { text: "!= (is NOT equal to)", value: "!=" },
  { text: "< (is less than)", value: "<" },
  { text: "<= (is less than or equal to)", value: "<=" },
  { text: "> (is greater than)", value: ">" },
  { text: ">= (is greater than or equal to)", value: ">=" },
];
