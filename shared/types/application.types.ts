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
  defaultValue: string | number | boolean | null;
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
}

export interface Node {
  id: string;
  content: never;
}

export interface Asset {
  id: string;
  type: string;
  data: Blob;
  applicationId: string;
}
